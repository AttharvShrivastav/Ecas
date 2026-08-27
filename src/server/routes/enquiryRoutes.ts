import { Router, Request, Response } from 'express';
import {
  createEnquiry,
  getEnquiryById,
  listEnquiries,
  updateEnquiryStatus,
  getEnquiryStats
} from '../services/enquiryService';
import { EnquiryStatus } from '../types/enquiry';

/**
 * PUBLIC ENQUIRY ROUTER
 * Dedicated to handling incoming customer enquiries from public forms.
 * Accepts only public user fields and rejects administrative overrides.
 */
export const publicEnquiryRouter = Router();

publicEnquiryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      country,
      enquiryType,
      message,
      sourcePage
    } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Full name is required.' }
      });
      return;
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Work email is required.' }
      });
      return;
    }

    if (!enquiryType || typeof enquiryType !== 'string' || !enquiryType.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Enquiry type is required.' }
      });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Message must be at least 5 characters.' }
      });
      return;
    }

    const created = await createEnquiry({
      name,
      company,
      email,
      phone,
      country,
      enquiryType,
      message,
      sourcePage
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your enquiry has been received.',
      enquiryId: `ENQ-${created.id}`,
      data: {
        id: created.id,
        name: created.name,
        email: created.email,
        enquiryType: created.enquiryType,
        createdAt: created.createdAt
      }
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'ENQUIRY_CREATION_FAILED',
        message: err.message || 'Unable to submit enquiry. Please check your submission.'
      }
    });
  }
});

/**
 * ADMINISTRATIVE ENQUIRY ROUTER
 * Protected API for future administrative enquiry management, filtering, and status updates.
 */
export const adminEnquiryRouter = Router();

// GET /api/admin/enquiries
adminEnquiryRouter.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as EnquiryStatus | undefined;
    const enquiryType = req.query.enquiryType as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const sortBy = req.query.sortBy as any;
    const sortDir = req.query.sortDir as any;

    const result = await listEnquiries({
      search,
      status,
      enquiryType,
      page,
      limit,
      sortBy,
      sortDir
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// GET /api/admin/enquiries/stats
adminEnquiryRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getEnquiryStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// GET /api/admin/enquiries/:id
adminEnquiryRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Valid enquiry ID required.' }
      });
      return;
    }

    const enquiry = await getEnquiryById(id);
    if (!enquiry) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Enquiry with ID ${id} not found.` }
      });
      return;
    }

    res.json({ success: true, data: enquiry });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// PATCH /api/admin/enquiries/:id/status
adminEnquiryRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Valid enquiry ID required.' }
      });
      return;
    }

    const { status, internalNotes, handledBy } = req.body || {};

    if (!status) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_STATUS', message: 'Status is required.' }
      });
      return;
    }

    const updated = await updateEnquiryStatus(
      id,
      status as EnquiryStatus,
      internalNotes,
      handledBy
    );

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: err.message }
    });
  }
});
