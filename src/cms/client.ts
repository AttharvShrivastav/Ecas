import type { NewsArticle } from './types';

/**
 * CMS Client Configuration
 */
export interface CMSClientConfig {
  baseUrl?: string;
  cacheTtlMs?: number;
  headers?: Record<string, string>;
}

/**
 * Cache entry for in-flight or cached responses
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * ECASEURO Controlled CMS Client
 *
 * Provides typed, error-safe communication with the local/hosted CMS API (/api/cms/*).
 * Incorporates:
 * - Deterministic error containment (returns null on network/server/schema failures without throwing)
 * - Request deduplication for simultaneous component mounts
 * - Lightweight in-memory caching to eliminate redundant network round-trips
 */
export class CMSClient {
  private baseUrl: string;
  private cacheTtlMs: number;
  private headers: Record<string, string>;
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();

  constructor(config: CMSClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '';
    this.cacheTtlMs = config.cacheTtlMs ?? 30000; // 30s cache TTL by default
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Internal request helper with deduplication and caching
   */
  private async request<T>(endpoint: string): Promise<T | null> {
    const url = `${this.baseUrl}${endpoint}`;

    // 1. Check valid cache entry
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.data as T;
    }

    // 2. Check active in-flight request to deduplicate
    if (this.inFlight.has(url)) {
      return (await this.inFlight.get(url)) as T | null;
    }

    // 3. Initiate new fetch
    const fetchPromise = (async (): Promise<T | null> => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: this.headers,
        });

        if (!response.ok) {
          if (response.status !== 404) {
            console.warn(`[CMSClient] HTTP ${response.status} from ${endpoint}`);
          }
          return null;
        }

        const json = await response.json();
        if (json && json.success) {
          const result = json.data !== undefined ? json.data : null;
          this.cache.set(url, { data: result, timestamp: Date.now() });
          return result as T;
        }

        return null;
      } catch (err) {
        console.warn(`[CMSClient] Network error for ${endpoint}:`, err);
        return null;
      } finally {
        this.inFlight.delete(url);
      }
    })();

    this.inFlight.set(url, fetchPromise);
    return fetchPromise;
  }

  /**
   * Retrieve structured content for a specific CMS page key
   * GET /api/cms/pages/:pageKey
   */
  async getPage<T = unknown>(pageKey: string): Promise<T | null> {
    const normalizedKey = encodeURIComponent(pageKey.trim().toLowerCase());
    const res = await this.request<{ content?: T }>(`/api/cms/pages/${normalizedKey}`);
    if (res && res.content) {
      return res.content;
    }
    return null;
  }

  /**
   * List published news articles with optional category/search filters
   * GET /api/cms/news
   */
  async getNews(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<NewsArticle[] | null> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      query.set('category', params.category);
    }
    if (params?.search) {
      query.set('search', params.search);
    }
    if (params?.limit) {
      query.set('limit', String(params.limit));
    }
    if (params?.page) {
      query.set('page', String(params.page));
    }

    const queryString = query.toString();
    const endpoint = `/api/cms/news${queryString ? `?${queryString}` : ''}`;
    const res = await this.request<NewsArticle[]>(endpoint);
    return Array.isArray(res) ? res : null;
  }

  /**
   * Retrieve a single published news article by slug
   * GET /api/cms/news/:slug
   */
  async getNewsArticle(slug: string): Promise<NewsArticle | null> {
    const normalizedSlug = encodeURIComponent(slug.trim());
    return this.request<NewsArticle>(`/api/cms/news/${normalizedSlug}`);
  }

  /**
   * Generic fetch method to preserve legacy or custom query abstractions
   */
  async fetch<T>(endpointOrQuery: string, _params: Record<string, unknown> = {}): Promise<T | null> {
    if (endpointOrQuery.startsWith('/api/')) {
      return this.request<T>(endpointOrQuery);
    }
    // Generic queries that are not endpoints return null, letting callers use fallback
    return null;
  }

  /**
   * Invalidate local memory cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const cmsClient = new CMSClient();

