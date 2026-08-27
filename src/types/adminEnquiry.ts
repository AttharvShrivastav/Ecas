export type EnquiryStatus = 'New' | 'In Progress' | 'Closed';

export interface EnquiryRecord {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  enquiryType: string;
  message: string;
  privacyConsent: boolean;
  sourcePage?: string;
  status: EnquiryStatus;
  internalNotes?: string;
  handledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryListParams {
  search?: string;
  status?: EnquiryStatus | 'ALL';
  enquiryType?: string | 'ALL';
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'name' | 'company' | 'email' | 'enquiry_type' | 'status' | 'created_at';
  sortDir?: 'ASC' | 'DESC';
}

export interface EnquiryStats {
  total: number;
  new: number;
  inProgress: number;
  closed: number;
  recentCount24h: number;
  byEnquiryType: { enquiryType: string; count: number }[];
}

export interface AdminEnquiriesResponse {
  success: boolean;
  data: EnquiryRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminEnquiryDetailResponse {
  success: boolean;
  data: EnquiryRecord;
}

export interface AdminEnquiryStatsResponse {
  success: boolean;
  data: EnquiryStats;
}
