export interface CMSPageRecord {
  id: number;
  page_key: string;
  title: string;
  content_json: string;
  version: number;
  updated_by: string | null;
  updated_at: string;
}

export interface CMSPageDTO<T = any> {
  id: number;
  pageKey: string;
  title: string;
  content: T;
  version: number;
  updatedBy: string | null;
  updatedAt: string;
}

export interface CMSPageSummary {
  id: number;
  pageKey: string;
  title: string;
  version: number;
  updatedBy: string | null;
  updatedAt: string;
}

export type ArticleStatus = 'published' | 'draft' | 'archived';

export interface NewsArticleRecord {
  id: number;
  slug: string;
  title: string;
  category: string;
  published_at: string;
  formatted_date: string | null;
  read_time: string | null;
  featured: number;
  featured_image: string | null;
  featured_image_alt: string | null;
  author_name: string | null;
  author_role: string | null;
  author_org: string | null;
  author_avatar: string | null;
  excerpt: string;
  content_json: string;
  tags_json: string | null;
  seo_json: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleDTO {
  id: number;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  formattedDate: string | null;
  readTime: string | null;
  featured: boolean;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  author: {
    name: string;
    role?: string;
    organization?: string;
    avatar?: string;
  } | null;
  excerpt: string;
  content: any[];
  tags: string[];
  seo: any;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleInput {
  slug: string;
  title: string;
  category: string;
  publishedAt?: string;
  formattedDate?: string;
  readTime?: string;
  featured?: boolean;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  author?: {
    name: string;
    role?: string;
    organization?: string;
    avatar?: string;
  } | null;
  excerpt: string;
  content: any[];
  tags?: string[];
  seo?: any;
  status?: ArticleStatus;
}
