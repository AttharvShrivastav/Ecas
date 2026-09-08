import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CMS_UPLOAD_DIR } from '../config/storagePaths';
import multer from 'multer';
import {
  getPageByKey,
  listAllPages,
  updatePageContent,
  resetPageToDefault,
  listPublicNewsArticles,
  getPublicNewsArticleBySlug,
  listAdminNewsArticles,
  getAdminNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from '../services/cmsService';

// ---------------------------------------------------------------------------
// CMS Image Upload Setup (Dedicated Directory & Collision-Safe Naming)
// ---------------------------------------------------------------------------
const UPLOAD_DIR = CMS_UPLOAD_DIR;
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(rawExt)
      ? rawExt
      : '.webp';
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const safeName = `cms_${Date.now()}_${randomSuffix}${safeExt}`;
    cb(null, safeName);
  },
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid image type "${file.mimetype}". Allowed types: JPEG, PNG, WEBP, SVG, GIF.`
        )
      );
    }
  },
});

// ---------------------------------------------------------------------------
// Public CMS Router
// ---------------------------------------------------------------------------
export const publicCmsRouter = Router();

/**
 * GET /api/cms/pages/:pageKey
 * Returns structured content JSON for a given page
 */
publicCmsRouter.get('/pages/:pageKey', async (req: Request, res: Response) => {
  try {
    const pageKey = req.params.pageKey;
    if (!pageKey || !pageKey.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAGE_KEY', message: 'Page key is required.' },
      });
      return;
    }

    const page = await getPageByKey(pageKey);
    if (!page) {
      res.status(404).json({
        success: false,
        error: { code: 'PAGE_NOT_FOUND', message: `Page with key "${pageKey}" not found.` },
      });
      return;
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (err: any) {
    console.error(`[CMS] Error fetching page "${req.params.pageKey}":`, err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve page content.' },
    });
  }
});

/**
 * GET /api/cms/news
 * Lists published news articles for public display
 * Supports ?category=, ?search=, ?limit=, ?page=
 */
publicCmsRouter.get('/news', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || undefined;
    const search = (req.query.search as string) || undefined;
    const limit = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100) : 50;
    const page = req.query.page ? Math.max(parseInt(req.query.page as string, 10) || 1, 1) : 1;
    const offset = (page - 1) * limit;

    const result = await listPublicNewsArticles({ category, search, limit, offset });

    res.json({
      success: true,
      data: result.articles,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err: any) {
    console.error('[CMS] Error listing public news articles:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve news articles.' },
    });
  }
});

/**
 * GET /api/cms/news/:slug
 * Retrieve single published news article by slug
 */
publicCmsRouter.get('/news/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    if (!slug || !slug.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_SLUG', message: 'Article slug is required.' },
      });
      return;
    }

    const article = await getPublicNewsArticleBySlug(slug);
    if (!article) {
      res.status(404).json({
        success: false,
        error: { code: 'ARTICLE_NOT_FOUND', message: `Article with slug "${slug}" not found.` },
      });
      return;
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (err: any) {
    console.error(`[CMS] Error fetching news article "${req.params.slug}":`, err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve article.' },
    });
  }
});

// ---------------------------------------------------------------------------
// Admin CMS Router (Protected by requireAdminSession in server.ts)
// ---------------------------------------------------------------------------
export const adminCmsRouter = Router();

/**
 * POST /api/admin/cms/upload
 * Upload image asset for CMS pages/articles
 * Accepts multipart/form-data with field 'file' or 'image'
 */
adminCmsRouter.post('/upload', (req: Request, res: Response) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: {
              code: 'FILE_TOO_LARGE',
              message: 'File size exceeds the 10MB maximum allowed limit.',
            },
          });
        }
        return res.status(400).json({
          success: false,
          error: { code: 'UPLOAD_ERROR', message: err.message },
        });
      }
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE',
          message: err.message || 'Failed to process uploaded file.',
        },
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file was provided in the upload request.' },
      });
    }

    const publicUrl = `/uploads/cms/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      data: {
        url: publicUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      url: publicUrl,
      message: 'Image uploaded successfully.',
    });
  });
});

/**
 * GET /api/admin/cms/pages
 * Lists all manageable CMS pages
 */
adminCmsRouter.get('/pages', async (_req: Request, res: Response) => {
  try {
    const pages = await listAllPages();
    res.json({
      success: true,
      data: pages,
    });
  } catch (err: any) {
    console.error('[CMS Admin] Error listing pages:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to list CMS pages.' },
    });
  }
});

/**
 * GET /api/admin/cms/pages/:pageKey
 * Get full editable content for a specific page
 */
adminCmsRouter.get('/pages/:pageKey', async (req: Request, res: Response) => {
  try {
    const pageKey = req.params.pageKey;
    const page = await getPageByKey(pageKey);

    if (!page) {
      res.status(404).json({
        success: false,
        error: { code: 'PAGE_NOT_FOUND', message: `Page with key "${pageKey}" not found.` },
      });
      return;
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error fetching page "${req.params.pageKey}":`, err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve page content.' },
    });
  }
});

/**
 * PUT /api/admin/cms/pages/:pageKey
 * Update editable content for a specific page
 */
adminCmsRouter.put('/pages/:pageKey', async (req: Request, res: Response) => {
  try {
    const pageKey = req.params.pageKey;
    const { content } = req.body || {};

    if (!content || typeof content !== 'object') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAYLOAD', message: 'Body must contain a valid "content" object.' },
      });
      return;
    }

    const updatedBy = (req as any).user?.email || 'ADMIN';
    const updatedPage = await updatePageContent(pageKey, content, updatedBy);

    res.json({
      success: true,
      data: updatedPage,
      message: `Page "${pageKey}" updated successfully to version ${updatedPage.version}.`,
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error updating page "${req.params.pageKey}":`, err);
    res.status(400).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: err.message || 'Failed to update page content.' },
    });
  }
});

/**
 * POST /api/admin/cms/pages/:pageKey/reset
 * Reset a page's content back to initial static defaults
 */
adminCmsRouter.post('/pages/:pageKey/reset', async (req: Request, res: Response) => {
  try {
    const pageKey = req.params.pageKey;
    const updatedBy = (req as any).user?.email || 'ADMIN_RESET';
    const resetPage = await resetPageToDefault(pageKey, updatedBy);

    res.json({
      success: true,
      data: resetPage,
      message: `Page "${pageKey}" reset to system defaults.`,
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error resetting page "${req.params.pageKey}":`, err);
    res.status(400).json({
      success: false,
      error: { code: 'RESET_FAILED', message: err.message || 'Failed to reset page.' },
    });
  }
});

/**
 * GET /api/admin/cms/news
 * List all news articles for admin dashboard (all statuses)
 */
adminCmsRouter.get('/news', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const search = (req.query.search as string) || undefined;
    const limit = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit as string, 10) || 20, 1), 200) : 100;
    const page = req.query.page ? Math.max(parseInt(req.query.page as string, 10) || 1, 1) : 1;
    const offset = (page - 1) * limit;

    const result = await listAdminNewsArticles({ category, status, search, limit, offset });

    res.json({
      success: true,
      data: result.articles,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err: any) {
    console.error('[CMS Admin] Error listing articles:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve articles.' },
    });
  }
});

/**
 * GET /api/admin/cms/news/:id
 * Get single news article by ID
 */
adminCmsRouter.get('/news/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'A valid numeric article ID is required.' },
      });
      return;
    }

    const article = await getAdminNewsArticleById(id);
    if (!article) {
      res.status(404).json({
        success: false,
        error: { code: 'ARTICLE_NOT_FOUND', message: `Article with ID ${id} not found.` },
      });
      return;
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error fetching article ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve article.' },
    });
  }
});

/**
 * POST /api/admin/cms/news
 * Create a new news article
 */
adminCmsRouter.post('/news', async (req: Request, res: Response) => {
  try {
    const data = req.body || {};
    const createdBy = (req as any).user?.name || 'Admin';
    const article = await createNewsArticle(data);

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article created successfully.',
    });
  } catch (err: any) {
    console.error('[CMS Admin] Error creating news article:', err);
    res.status(400).json({
      success: false,
      error: { code: 'CREATION_FAILED', message: err.message || 'Failed to create article.' },
    });
  }
});

/**
 * PUT /api/admin/cms/news/:id
 * Update an existing news article
 */
adminCmsRouter.put('/news/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'A valid numeric article ID is required.' },
      });
      return;
    }

    const data = req.body || {};
    const updated = await updateNewsArticle(id, data);

    res.json({
      success: true,
      data: updated,
      message: 'Article updated successfully.',
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error updating article ID ${req.params.id}:`, err);
    res.status(400).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: err.message || 'Failed to update article.' },
    });
  }
});

/**
 * DELETE /api/admin/cms/news/:id
 * Delete an article
 */
adminCmsRouter.delete('/news/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'A valid numeric article ID is required.' },
      });
      return;
    }

    const deleted = await deleteNewsArticle(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Article with ID ${id} not found.` },
      });
      return;
    }

    res.json({
      success: true,
      message: `Article with ID ${id} deleted successfully.`,
    });
  } catch (err: any) {
    console.error(`[CMS Admin] Error deleting article ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete article.' },
    });
  }
});
