export type EnquiryStatus = 'New' | 'In Progress' | 'Closed';

export interface DbEnquiry {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  enquiry_type: string;
  message: string;
  privacy_consent: number; // 1 for true, 0 for false
  source_page: string | null;
  status: EnquiryStatus;
  internal_notes: string | null;
  handled_by: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface CreateEnquiryInput {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  enquiryType: string;
  message: string;
  privacyConsent: boolean;
  sourcePage?: string | null;
}

export interface EnquiryListParams {
  search?: string;
  status?: EnquiryStatus;
  enquiryType?: string;
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
