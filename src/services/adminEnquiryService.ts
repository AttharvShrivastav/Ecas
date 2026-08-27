import type {
  EnquiryRecord,
  EnquiryListParams,
  EnquiryStats,
  EnquiryStatus,
  AdminEnquiriesResponse,
  AdminEnquiryDetailResponse,
  AdminEnquiryStatsResponse
} from '../types/adminEnquiry';

/**
 * Fetch enquiry registry statistics for the admin dashboard/operational cards
 */
export async function fetchAdminEnquiryStats(): Promise<EnquiryStats> {
  const res = await fetch('/api/admin/enquiries/stats');
  if (!res.ok) {
    throw new Error(`Failed to load enquiry stats (${res.status})`);
  }
  const json: AdminEnquiryStatsResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Failed to retrieve enquiry statistics');
  }
  return json.data;
}

/**
 * Fetch paginated enquiries list with search, filter, and sorting
 */
export async function fetchAdminEnquiries(
  params: EnquiryListParams = {}
): Promise<AdminEnquiriesResponse> {
  const query = new URLSearchParams();
  if (params.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.status && params.status !== 'ALL') {
    query.set('status', params.status);
  }
  if (params.enquiryType && params.enquiryType !== 'ALL') {
    query.set('enquiryType', params.enquiryType);
  }
  if (params.page) {
    query.set('page', params.page.toString());
  }
  if (params.limit) {
    query.set('limit', params.limit.toString());
  }
  if (params.sortBy) {
    query.set('sortBy', params.sortBy);
  }
  if (params.sortDir) {
    query.set('sortDir', params.sortDir);
  }

  const res = await fetch(`/api/admin/enquiries?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch enquiries (${res.status})`);
  }
  const json: AdminEnquiriesResponse = await res.json();
  return json;
}

/**
 * Fetch single enquiry by ID
 */
export async function fetchAdminEnquiryById(id: number): Promise<EnquiryRecord> {
  const res = await fetch(`/api/admin/enquiries/${id}`);
  if (!res.ok) {
    throw new Error(`Enquiry not found (${res.status})`);
  }
  const json: AdminEnquiryDetailResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Enquiry record not found');
  }
  return json.data;
}

/**
 * Update enquiry status and optional internal notes / handledBy
 */
export async function updateAdminEnquiryStatus(
  id: number,
  status: EnquiryStatus,
  internalNotes?: string,
  handledBy?: string
): Promise<EnquiryRecord> {
  const res = await fetch(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, internalNotes, handledBy })
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to update enquiry status (${res.status})`);
  }

  const json: AdminEnquiryDetailResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Failed to update enquiry status');
  }
  return json.data;
}
