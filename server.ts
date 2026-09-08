import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { toNodeHandler } from 'better-auth/node';
import { auth, ensureAdminUser } from './src/server/auth/auth';
import { requireAdminSession } from './src/server/middleware/authMiddleware';
import { certificateRouter, adminCertificateRouter } from './src/server/routes/certificateRoutes';
import { publicEnquiryRouter, adminEnquiryRouter } from './src/server/routes/enquiryRoutes';
import { publicCmsRouter, adminCmsRouter } from './src/server/routes/cmsRoutes';
import { adminAccountRouter } from './src/server/routes/accountRoutes';
import { getDatabase } from './src/server/db/database';
import { DATABASE_FILE, UPLOADS_DIR } from './src/server/config/storagePaths';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount Better Auth handler BEFORE express.json()
  app.all('/api/auth/*', toNodeHandler(auth));

  // JSON Body Parser for other API endpoints
  app.use(express.json());

  // Initialize persistent SQLite database & verify admin auth.
  // Fail startup if persistent state cannot be opened safely.
  try {
    await getDatabase();
    await ensureAdminUser();
    console.log('[eCAS Euro] Database & Admin Auth initialized and verified.');
    console.log('[eCAS Euro] Database file:', DATABASE_FILE);
    console.log('[eCAS Euro] Uploads directory:', UPLOADS_DIR);
  } catch (dbErr) {
    console.error('[eCAS Euro] Fatal database/auth initialization error:', dbErr);
    process.exitCode = 1;
    return;
  }

  // Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'eCAS Euro Certificate & Enquiry Management API',
      timestamp: new Date().toISOString()
    });
  });

  // Public APIs
  app.use('/api/certificates', certificateRouter);
  app.use('/api/enquiries', publicEnquiryRouter);
  app.use('/api/contact', publicEnquiryRouter);
  app.use('/api/cms', publicCmsRouter);

  // Public Uploads Static Serving (CMS Assets)
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Administrative API Protection Middleware
  app.use('/api/admin', requireAdminSession);

  // Protected Administrative API Endpoints
  app.use('/api/admin/certificates', adminCertificateRouter);
  app.use('/api/admin/enquiries', adminEnquiryRouter);
  app.use('/api/admin/cms', adminCmsRouter);
  app.use('/api/admin/accounts', adminAccountRouter);

  // Vite middleware in dev mode vs Static Files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[eCAS Euro] Application server running on http://localhost:${PORT}`);
  });
}

startServer();
