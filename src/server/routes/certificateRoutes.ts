import { Router, Request, Response } from 'express';
import {
  getCertificateByNumber,
  listCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  changeCertificateStatus,
  getCertificateStats,
  getDistinctStandards
} from '../services/certificateService';
import { CertificateStatus } from '../types/certificate';

export const certificateRouter = Router();

/**
 * PUBLIC ENDPOINT: Certificate Verification
 * GET /api/certificates/verify?cert_no=<CERT_NO>
 * Also supports /api/certificates/verify/:cert_no and ?q=<CERT_NO>
 */
certificateRouter.get('/verify', async (req: Request, res: Response) => {
  try {
    const certNo = (req.query.cert_no as string) || (req.query.q as string) || '';

    if (!certNo || !certNo.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Certificate number is required for verification.'
        }
      });
      return;
    }

    const certificate = await getCertificateByNumber(certNo);

    if (!certificate) {
      res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATE_NOT_FOUND',
          message: 'No registered certificate matched the provided identification number.'
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (err: any) {
    console.error('Error during certificate verification:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to connect to the verification directory. Please try again later.'
      }
    });
  }
});

// Fallback path parameter support: /api/certificates/verify/:certNo
certificateRouter.get('/verify/:certNo', async (req: Request, res: Response) => {
  try {
    const certNo = req.params.certNo || '';
    if (!certNo.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Certificate number is required for verification.'
        }
      });
      return;
    }

    const certificate = await getCertificateByNumber(certNo);
    if (!certificate) {
      res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATE_NOT_FOUND',
          message: 'No registered certificate matched the provided identification number.'
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (err: any) {
    console.error('Error during certificate verification:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to connect to the verification directory. Please try again later.'
      }
    });
  }
});

/**
 * ADMINISTRATIVE ENDPOINTS (Foundation for future CMS)
 */
export const adminCertificateRouter = Router();

// GET /api/admin/certificates
adminCertificateRouter.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as CertificateStatus | undefined;
    const standard = req.query.standard as string | undefined;
    const expiry = req.query.expiry as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const sortBy = req.query.sortBy as any;
    const sortDir = req.query.sortDir as any;

    const result = await listCertificates({
      search,
      status,
      standard,
      expiry,
      page,
      limit,
      sortBy,
      sortDir
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/admin/certificates/standards (Distinct standards present in database)
adminCertificateRouter.get('/standards', async (_req: Request, res: Response) => {
  try {
    const standards = await getDistinctStandards();
    res.json({ success: true, data: standards });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/admin/certificates/stats
adminCertificateRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getCertificateStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});



// GET /api/admin/certificates/:id
adminCertificateRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const cert = await getCertificateById(id);
    if (!cert) {
      res.status(404).json({ success: false, error: { message: 'Certificate not found' } });
      return;
    }
    res.json({ success: true, data: cert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/admin/certificates
adminCertificateRouter.post('/', async (req: Request, res: Response) => {
  try {
    const cert = await createCertificate(req.body);
    res.status(201).json({ success: true, data: cert });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

// PUT /api/admin/certificates/:id
adminCertificateRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const cert = await updateCertificate(id, req.body);
    res.json({ success: true, data: cert });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/admin/certificates/:id/status
adminCertificateRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: { message: 'Status is required' } });
      return;
    }
    const cert = await changeCertificateStatus(id, status as CertificateStatus);
    res.json({ success: true, data: cert });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});


// DELETE /api/admin/certificates/:id
adminCertificateRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid certificate ID' }
      });
      return;
    }

    await deleteCertificate(id);

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { message: err.message }
    });
  }
});

