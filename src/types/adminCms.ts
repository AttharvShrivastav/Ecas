import type { ESGPageContent, SEOData, ImageAsset } from '../cms/types';

export interface AdminCMSPageResponse<T = any> {
  success: boolean;
  data: {
    id: number;
    pageKey: string;
    title: string;
    content: T;
    version: number;
    updatedBy: string;
    updatedAt: string;
  };
  message?: string;
}

export interface AdminCMSPageSummary {
  id: number;
  pageKey: string;
  title: string;
  version: number;
  updatedBy: string;
  updatedAt: string;
}

export interface AdminCMSPagesListResponse {
  success: boolean;
  data: AdminCMSPageSummary[];
}

export interface CMSFormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
