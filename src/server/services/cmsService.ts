import { getSqliteDatabase, queryAll, queryOne } from '../db/database';
import {
  CMSPageRecord,
  CMSPageDTO,
  CMSPageSummary,
  NewsArticleRecord,
  NewsArticleDTO,
  ArticleInput,
  ArticleStatus,
} from '../types/cms';
import { defaultAboutPageContent } from '../../cms/aboutContent';
import { defaultAssociationsPageContent } from '../../cms/associationsContent';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import { defaultContactPageContent } from '../../cms/contactContent';
import { defaultESGPageContent } from '../../cms/esgContent';
import { defaultHomePageContent } from '../../cms/homeContent';
import { defaultInspectionPageContent } from '../../cms/inspectionContent';
import { defaultManagementSystemPageContent } from '../../cms/managementSystemContent';
import { defaultProductCertificationContent } from '../../cms/productCertificationContent';
import { defaultSiteSettingsContent } from '../../cms/siteSettingsContent';
import { defaultTrainingPageContent } from '../../cms/trainingContent';

/**
 * Map of static fallback defaults for page reset functionality
 */
export const DEFAULT_PAGE_CONTENTS: Record<string, { title: string; content: any }> = {
  home: {
    title: 'Home',
    content: defaultHomePageContent,
  },
  about: {
    title: 'About Us',
    content: defaultAboutPageContent,
  },
  'product-certification': {
    title: 'Product Certification',
    content: defaultProductCertificationContent,
  },
  'management-system': {
    title: 'Management System Certification',
    content: defaultManagementSystemPageContent,
  },
  inspection: {
    title: 'Inspection Services',
    content: defaultInspectionPageContent,
  },
  'cbam-verification': {
    title: 'CBAM Verification',
    content: defaultCbamVerificationPageContent,
  },
  esg: {
    title: 'ESG Assurance and Support',
    content: defaultESGPageContent,
  },
  training: {
    title: 'Training',
    content: defaultTrainingPageContent,
  },
  associations: {
    title: 'Associations & Technical Partners',
    content: defaultAssociationsPageContent,
  },
  contact: {
    title: 'Contact Us',
    content: defaultContactPageContent,
  },
  settings: {
    title: 'Site Settings & Global Contact',
    content: defaultSiteSettingsContent,
  },
};

/**
 * Helper to transform a raw DB row to CMSPageDTO
 */
function mapPageRecordToDTO(row: CMSPageRecord): CMSPageDTO {
  let parsedContent: any = {};
  try {
    parsedContent = JSON.parse(row.content_json);
  } catch (err) {
    console.error(`[CMS] Failed to parse content_json for page ${row.page_key}:`, err);
    parsedContent = {};
  }

  return {
    id: row.id,
    pageKey: row.page_key,
    title: row.title,
    content: parsedContent,
    version: row.version,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at,
  };
}

/**
 * Helper to transform a raw DB row to NewsArticleDTO
 */
function mapArticleRecordToDTO(row: NewsArticleRecord): NewsArticleDTO {
  let parsedContent: any[] = [];
  let parsedTags: string[] = [];
  let parsedSeo: any = {};

  try {
    parsedContent = JSON.parse(row.content_json || '[]');
  } catch {
    parsedContent = [];
  }

  try {
    parsedTags = JSON.parse(row.tags_json || '[]');
  } catch {
    parsedTags = [];
  }

  try {
    parsedSeo = JSON.parse(row.seo_json || '{}');
  } catch {
    parsedSeo = {};
  }

  const author = row.author_name
    ? {
        name: row.author_name,
        role: row.author_role || undefined,
        organization: row.author_org || undefined,
        avatar: row.author_avatar || undefined,
      }
    : null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    publishedAt: row.published_at,
    formattedDate: row.formatted_date,
    readTime: row.read_time,
    featured: Boolean(row.featured),
    featuredImage: row.featured_image,
    featuredImageAlt: row.featured_image_alt,
    author,
    excerpt: row.excerpt,
    content: parsedContent,
    tags: parsedTags,
    seo: parsedSeo,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// CMS Page Service Functions
// ---------------------------------------------------------------------------

function normalizePageKey(key: string): string {
  const k = (key || '').trim().toLowerCase();
  if (k === 'management-systems') return 'management-system';
  if (k === 'esg-verification') return 'esg';
  if (k === 'training-academy') return 'training';
  if (k === 'site-settings' || k === 'site_settings' || k === 'site' || k === 'global-settings') return 'settings';
  return k;
}

/**
 * Retrieve page content by page key
 */
export async function getPageByKey(pageKey: string): Promise<CMSPageDTO | null> {
  const db = getSqliteDatabase();
  const normalizedKey = normalizePageKey(pageKey);

  const row = queryOne<CMSPageRecord>(db, 'SELECT * FROM cms_pages WHERE page_key = ?', [normalizedKey]);

  if (!row) {
    return null;
  }

  return mapPageRecordToDTO(row);
}

/**
 * List all available CMS pages with summary metadata
 */
export async function listAllPages(): Promise<CMSPageSummary[]> {
  const db = getSqliteDatabase();
  const rows = queryAll<{ id: number; page_key: string; title: string; version: number; updated_by: string | null; updated_at: string }>(
    db,
    'SELECT id, page_key, title, version, updated_by, updated_at FROM cms_pages ORDER BY id ASC'
  );

  return rows.map((r) => ({
    id: r.id,
    pageKey: r.page_key,
    title: r.title,
    version: r.version,
    updatedBy: r.updated_by,
    updatedAt: r.updated_at,
  }));
}

/**
 * Update page content for an existing page
 */
export async function updatePageContent(
  pageKey: string,
  content: any,
  updatedBy: string = 'ADMIN'
): Promise<CMSPageDTO> {
  const db = getSqliteDatabase();
  const normalizedKey = normalizePageKey(pageKey);

  const existing = queryOne<CMSPageRecord>(db, 'SELECT * FROM cms_pages WHERE page_key = ?', [normalizedKey]);

  if (!existing) {
    throw new Error(`Page not found: ${pageKey}`);
  }

  if (!content || typeof content !== 'object') {
    throw new Error('Content must be a valid JSON object');
  }

  const contentJson = JSON.stringify(content);
  const now = new Date().toISOString();
  const newVersion = (existing.version || 1) + 1;

  db.prepare(`
    UPDATE cms_pages
    SET content_json = ?, version = ?, updated_by = ?, updated_at = ?
    WHERE page_key = ?
  `).run(contentJson, newVersion, updatedBy, now, normalizedKey);

  const updated = queryOne<CMSPageRecord>(db, 'SELECT * FROM cms_pages WHERE page_key = ?', [normalizedKey]);
  if (!updated) {
    throw new Error(`Failed to retrieve updated page: ${pageKey}`);
  }
  return mapPageRecordToDTO(updated);
}

/**
 * Reset a page's content back to the original static system defaults
 */
export async function resetPageToDefault(
  pageKey: string,
  updatedBy: string = 'ADMIN_RESET'
): Promise<CMSPageDTO> {
  const normalizedKey = normalizePageKey(pageKey);
  const defaultEntry = DEFAULT_PAGE_CONTENTS[normalizedKey];

  if (!defaultEntry) {
    throw new Error(`No default content configuration found for page: ${pageKey}`);
  }

  return updatePageContent(normalizedKey, defaultEntry.content, updatedBy);
}

// ---------------------------------------------------------------------------
// News Articles Service Functions
// ---------------------------------------------------------------------------

/**
 * List published articles for public consumption
 */
export async function listPublicNewsArticles(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ articles: NewsArticleDTO[]; total: number }> {
  const db = getSqliteDatabase();
  const { category, search, limit = 50, offset = 0 } = options;

  const conditions: string[] = ["status = 'published'"];
  const params: any[] = [];

  if (category && category !== 'All' && category.trim()) {
    conditions.push('category = ?');
    params.push(category.trim());
  }

  if (search && search.trim()) {
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR content_json LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = queryOne<{ total: number }>(db, `SELECT COUNT(*) as total FROM news_articles ${whereClause}`, params);
  const total = countRow ? countRow.total : 0;

  const queryParams = [...params, limit, offset];
  const rows = queryAll<NewsArticleRecord>(
    db,
    `SELECT * FROM news_articles
     ${whereClause}
     ORDER BY featured DESC, published_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    queryParams
  );

  return {
    articles: rows.map(mapArticleRecordToDTO),
    total,
  };
}

/**
 * Retrieve a published news article by slug (Public)
 */
export async function getPublicNewsArticleBySlug(slug: string): Promise<NewsArticleDTO | null> {
  const db = getSqliteDatabase();
  const normalizedSlug = slug.trim().toLowerCase();

  const row = queryOne<NewsArticleRecord>(
    db,
    `SELECT * FROM news_articles WHERE slug = ? AND status = 'published'`,
    [normalizedSlug]
  );

  if (!row) {
    return null;
  }

  return mapArticleRecordToDTO(row);
}

/**
 * List all articles for administrative dashboard (All statuses)
 */
export async function listAdminNewsArticles(options: {
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ articles: NewsArticleDTO[]; total: number }> {
  const db = getSqliteDatabase();
  const { category, status, search, limit = 100, offset = 0 } = options;

  const conditions: string[] = [];
  const params: any[] = [];

  if (category && category !== 'All' && category.trim()) {
    conditions.push('category = ?');
    params.push(category.trim());
  }

  if (status && status.trim()) {
    conditions.push('status = ?');
    params.push(status.trim());
  }

  if (search && search.trim()) {
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR slug LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = queryOne<{ total: number }>(db, `SELECT COUNT(*) as total FROM news_articles ${whereClause}`, params);
  const total = countRow ? countRow.total : 0;

  const queryParams = [...params, limit, offset];
  const rows = queryAll<NewsArticleRecord>(
    db,
    `SELECT * FROM news_articles
     ${whereClause}
     ORDER BY published_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    queryParams
  );

  return {
    articles: rows.map(mapArticleRecordToDTO),
    total,
  };
}

/**
 * Get news article by ID (Admin)
 */
export async function getAdminNewsArticleById(id: number): Promise<NewsArticleDTO | null> {
  const db = getSqliteDatabase();
  const row = queryOne<NewsArticleRecord>(db, 'SELECT * FROM news_articles WHERE id = ?', [id]);

  if (!row) {
    return null;
  }

  return mapArticleRecordToDTO(row);
}

/**
 * Create a new article (Admin)
 */
export async function createNewsArticle(data: ArticleInput): Promise<NewsArticleDTO> {
  const db = getSqliteDatabase();

  if (!data.title || !data.title.trim()) {
    throw new Error('Article title is required');
  }

  if (!data.slug || !data.slug.trim()) {
    throw new Error('Article slug is required');
  }

  if (!data.category || !data.category.trim()) {
    throw new Error('Article category is required');
  }

  if (!data.excerpt || !data.excerpt.trim()) {
    throw new Error('Article excerpt is required');
  }

  const normalizedSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  // Check uniqueness of slug
  const existing = queryOne<{ id: number }>(db, 'SELECT id FROM news_articles WHERE slug = ?', [normalizedSlug]);
  if (existing) {
    throw new Error(`An article with slug "${normalizedSlug}" already exists`);
  }

  const now = new Date().toISOString();
  const publishedAt = data.publishedAt || now.split('T')[0];
  const formattedDate = data.formattedDate || new Date(publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const readTime = data.readTime || '5 min read';
  const status: ArticleStatus = data.status || 'published';

  const insertStmt = db.prepare(`
    INSERT INTO news_articles (
      slug,
      title,
      category,
      published_at,
      formatted_date,
      read_time,
      featured,
      featured_image,
      featured_image_alt,
      author_name,
      author_role,
      author_org,
      author_avatar,
      excerpt,
      content_json,
      tags_json,
      seo_json,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    normalizedSlug,
    data.title.trim(),
    data.category.trim(),
    publishedAt,
    formattedDate,
    readTime,
    data.featured ? 1 : 0,
    data.featuredImage || null,
    data.featuredImageAlt || null,
    data.author?.name || null,
    data.author?.role || null,
    data.author?.organization || null,
    data.author?.avatar || null,
    data.excerpt.trim(),
    JSON.stringify(data.content || []),
    JSON.stringify(data.tags || []),
    JSON.stringify(data.seo || {}),
    status,
    now,
    now
  );

  const row = queryOne<NewsArticleRecord>(db, 'SELECT * FROM news_articles WHERE slug = ?', [normalizedSlug]);
  if (!row) {
    throw new Error(`Failed to retrieve newly created article with slug "${normalizedSlug}"`);
  }
  return mapArticleRecordToDTO(row);
}

/**
 * Update an existing news article (Admin)
 */
export async function updateNewsArticle(id: number, data: Partial<ArticleInput>): Promise<NewsArticleDTO> {
  const db = getSqliteDatabase();

  const existing = queryOne<NewsArticleRecord>(db, 'SELECT * FROM news_articles WHERE id = ?', [id]);
  if (!existing) {
    throw new Error(`Article with id ${id} not found`);
  }

  let slug = existing.slug;
  if (data.slug && data.slug.trim()) {
    const candidateSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (candidateSlug !== existing.slug) {
      const collision = queryOne<{ id: number }>(db, 'SELECT id FROM news_articles WHERE slug = ? AND id != ?', [candidateSlug, id]);
      if (collision) {
        throw new Error(`Slug "${candidateSlug}" is already taken by another article`);
      }
      slug = candidateSlug;
    }
  }

  const title = data.title !== undefined ? data.title.trim() : existing.title;
  const category = data.category !== undefined ? data.category.trim() : existing.category;
  const publishedAt = data.publishedAt !== undefined ? data.publishedAt : existing.published_at;
  const formattedDate = data.formattedDate !== undefined ? data.formattedDate : existing.formatted_date;
  const readTime = data.readTime !== undefined ? data.readTime : existing.read_time;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured;
  const featuredImage = data.featuredImage !== undefined ? data.featuredImage : existing.featured_image;
  const featuredImageAlt = data.featuredImageAlt !== undefined ? data.featuredImageAlt : existing.featured_image_alt;
  const authorName = data.author !== undefined ? data.author?.name || null : existing.author_name;
  const authorRole = data.author !== undefined ? data.author?.role || null : existing.author_role;
  const authorOrg = data.author !== undefined ? data.author?.organization || null : existing.author_org;
  const authorAvatar = data.author !== undefined ? data.author?.avatar || null : existing.author_avatar;
  const excerpt = data.excerpt !== undefined ? data.excerpt.trim() : existing.excerpt;
  const contentJson = data.content !== undefined ? JSON.stringify(data.content) : existing.content_json;
  const tagsJson = data.tags !== undefined ? JSON.stringify(data.tags) : existing.tags_json;
  const seoJson = data.seo !== undefined ? JSON.stringify(data.seo) : existing.seo_json;
  const status = data.status !== undefined ? data.status : existing.status;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE news_articles
    SET
      slug = ?,
      title = ?,
      category = ?,
      published_at = ?,
      formatted_date = ?,
      read_time = ?,
      featured = ?,
      featured_image = ?,
      featured_image_alt = ?,
      author_name = ?,
      author_role = ?,
      author_org = ?,
      author_avatar = ?,
      excerpt = ?,
      content_json = ?,
      tags_json = ?,
      seo_json = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    slug,
    title,
    category,
    publishedAt,
    formattedDate,
    readTime,
    featured,
    featuredImage,
    featuredImageAlt,
    authorName,
    authorRole,
    authorOrg,
    authorAvatar,
    excerpt,
    contentJson,
    tagsJson,
    seoJson,
    status,
    now,
    id
  );

  const updated = queryOne<NewsArticleRecord>(db, 'SELECT * FROM news_articles WHERE id = ?', [id]);
  if (!updated) {
    throw new Error(`Failed to retrieve updated article ID ${id}`);
  }
  return mapArticleRecordToDTO(updated);
}

/**
 * Delete a news article (Admin)
 */
export async function deleteNewsArticle(id: number): Promise<boolean> {
  const db = getSqliteDatabase();
  const existing = queryOne<{ id: number }>(db, 'SELECT id FROM news_articles WHERE id = ?', [id]);

  if (!existing) {
    return false;
  }

  db.prepare('DELETE FROM news_articles WHERE id = ?').run(id);
  return true;
}
