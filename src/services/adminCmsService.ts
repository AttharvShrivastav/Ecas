import { cmsClient } from '../cms/client';
import type { AdminCMSPageResponse, AdminCMSPagesListResponse } from '../types/adminCms';

/**
 * Fetch structured CMS page content for editing
 * GET /api/admin/cms/pages/:pageKey
 */
export async function fetchAdminCmsPage<T = any>(pageKey: string): Promise<AdminCMSPageResponse<T>['data']> {
  const normalizedKey = encodeURIComponent(pageKey.trim().toLowerCase());
  const res = await fetch(`/api/admin/cms/pages/${normalizedKey}`);

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Failed to fetch CMS page content (${res.status})`
    );
  }

  const json: AdminCMSPageResponse<T> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Invalid server response for CMS page');
  }

  return json.data;
}

/**
 * Update structured CMS page content
 * PUT /api/admin/cms/pages/:pageKey
 */
export async function updateAdminCmsPage<T = any>(
  pageKey: string,
  content: T
): Promise<AdminCMSPageResponse<T>['data']> {
  const normalizedKey = encodeURIComponent(pageKey.trim().toLowerCase());
  const res = await fetch(`/api/admin/cms/pages/${normalizedKey}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Failed to update CMS page content (${res.status})`
    );
  }

  const json: AdminCMSPageResponse<T> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Failed to save page changes');
  }

  // Clear public CMS in-memory client cache so immediate navigations reflect updates
  cmsClient.clearCache();

  return json.data;
}

/**
 * Reset structured CMS page content to initial system defaults
 * POST /api/admin/cms/pages/:pageKey/reset
 */
export async function resetAdminCmsPage<T = any>(
  pageKey: string
): Promise<AdminCMSPageResponse<T>['data']> {
  const normalizedKey = encodeURIComponent(pageKey.trim().toLowerCase());
  const res = await fetch(`/api/admin/cms/pages/${normalizedKey}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Failed to reset CMS page content (${res.status})`
    );
  }

  const json: AdminCMSPageResponse<T> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Failed to reset page to defaults');
  }

  // Invalidate public client cache
  cmsClient.clearCache();

  return json.data;
}

/**
 * List all manageable CMS pages
 * GET /api/admin/cms/pages
 */
export async function listAdminCmsPages(): Promise<AdminCMSPagesListResponse['data']> {
  const res = await fetch('/api/admin/cms/pages');
  if (!res.ok) {
    throw new Error(`Failed to list CMS pages (${res.status})`);
  }

  const json: AdminCMSPagesListResponse = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error('Failed to retrieve CMS pages list');
  }

  return json.data;
}

export interface CMSUploadResult {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * Upload an image asset to the server via multipart/form-data
 * POST /api/admin/cms/upload
 */
export async function uploadAdminCmsImage(file: File): Promise<CMSUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/cms/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Image upload failed (${res.status})`
    );
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json?.error?.message || json?.message || 'Invalid server response for image upload');
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Admin News & Insights Management API
// ---------------------------------------------------------------------------

export interface AdminNewsListOptions {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminNewsArticleDTO {
  id: number;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  formattedDate: string;
  readTime: string;
  featured: boolean;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  author: {
    name: string;
    role: string;
    organization: string | null;
    avatar: string | null;
  } | null;
  excerpt: string;
  content: any[];
  tags: string[];
  seo: any;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface AdminNewsListResult {
  articles: AdminNewsArticleDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch paginated list of news articles for admin
 * GET /api/admin/cms/news
 */
export async function fetchAdminNewsList(options?: AdminNewsListOptions): Promise<AdminNewsListResult> {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.status) params.set('status', options.status);
  if (options?.search) params.set('search', options.search);
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));

  const url = `/api/admin/cms/news${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Failed to fetch news articles (${res.status})`
    );
  }

  const json = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json?.message || 'Invalid server response for news list');
  }

  return {
    articles: json.data,
    pagination: json.pagination || {
      total: json.data.length,
      page: 1,
      limit: json.data.length,
      totalPages: 1,
    },
  };
}

/**
 * Fetch a single news article by ID for editing
 * GET /api/admin/cms/news/:id
 */
export async function fetchAdminNewsArticle(id: number): Promise<AdminNewsArticleDTO> {
  const res = await fetch(`/api/admin/cms/news/${id}`);

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Failed to fetch news article #${id} (${res.status})`
    );
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json?.message || 'Invalid server response for news article');
  }

  return json.data;
}

/**
 * Create a new news article
 * POST /api/admin/cms/news
 */
export async function createAdminNewsArticle(data: Partial<AdminNewsArticleDTO>): Promise<AdminNewsArticleDTO> {
  const res = await fetch('/api/admin/cms/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Failed to create news article (${res.status})`
    );
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json?.message || 'Failed to create article');
  }

  // Clear public CMS cache
  cmsClient.clearCache();

  return json.data;
}

/**
 * Update an existing news article
 * PUT /api/admin/cms/news/:id
 */
export async function updateAdminNewsArticle(
  id: number,
  data: Partial<AdminNewsArticleDTO>
): Promise<AdminNewsArticleDTO> {
  const res = await fetch(`/api/admin/cms/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Failed to update news article #${id} (${res.status})`
    );
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json?.message || 'Failed to update article');
  }

  // Clear public CMS cache
  cmsClient.clearCache();

  return json.data;
}

/**
 * Delete a news article
 * DELETE /api/admin/cms/news/:id
 */
export async function deleteAdminNewsArticle(id: number): Promise<boolean> {
  const res = await fetch(`/api/admin/cms/news/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || errorJson?.message || `Failed to delete news article #${id} (${res.status})`
    );
  }

  const json = await res.json();
  cmsClient.clearCache();
  return Boolean(json.success);
}
