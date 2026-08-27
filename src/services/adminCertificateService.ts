import type {
  DbCertificate,
  CreateCertificateInput,
  UpdateCertificateInput,
  CertificateListParams,
  CertificateStatus,
  CertificateAuditLog,
  CertificateRegistryStats
} from '../types/adminCertificate';

export interface AdminCertificatesResponse {
  success: boolean;
  data: DbCertificate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminCertificateResponse {
  success: boolean;
  data: DbCertificate;
}

export interface AdminStatsResponse {
  success: boolean;
  data: CertificateRegistryStats;
}

export interface AdminAuditLogsResponse {
  success: boolean;
  data: CertificateAuditLog[];
}

/**
 * Fetch stats for admin certificate management
 */
export async function fetchAdminCertificateStats(): Promise<CertificateRegistryStats> {
  const res = await fetch('/api/admin/certificates/stats');
  if (!res.ok) {
    throw new Error(`Failed to load stats (${res.status})`);
  }
  const json: AdminStatsResponse = await res.json();
  if (!json.success) {
    throw new Error('Failed to retrieve certificate statistics');
  }
  return json.data;
}

/**
 * Fetch paginated certificates list with search, filter, and sorting
 */
export async function fetchAdminCertificates(
  params: CertificateListParams = {}
): Promise<AdminCertificatesResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search.trim());
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.standard && params.standard !== 'ALL') query.set('standard', params.standard);
  if (params.expiry && params.expiry !== 'ALL') query.set('expiry', params.expiry);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortDir) query.set('sortDir', params.sortDir);

  const res = await fetch(`/api/admin/certificates?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch certificates (${res.status})`);
  }
  const json = await res.json();
  return json;
}

/**
 * Fetch distinct certification standards present in database
 */
export async function fetchAdminCertificateStandards(): Promise<string[]> {
  const res = await fetch('/api/admin/certificates/standards');
  if (!res.ok) {
    throw new Error(`Failed to load standards list (${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch single certificate by ID
 */
export async function fetchAdminCertificateById(id: number): Promise<DbCertificate> {
  const res = await fetch(`/api/admin/certificates/${id}`);
  if (!res.ok) {
    throw new Error(`Certificate not found (${res.status})`);
  }
  const json: AdminCertificateResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Certificate record not found');
  }
  return json.data;
}

/**
 * Create a new certificate record
 */
export async function createAdminCertificate(
  input: CreateCertificateInput
): Promise<DbCertificate> {
  const res = await fetch('/api/admin/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Failed to create certificate');
  }
  return json.data;
}

/**
 * Update an existing certificate record
 */
export async function updateAdminCertificate(
  id: number,
  input: UpdateCertificateInput
): Promise<DbCertificate> {
  const res = await fetch(`/api/admin/certificates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Failed to update certificate');
  }
  return json.data;
}

/**
 * Change status (e.g. Suspend, Reactivate, Withdraw) with an administrative reason
 */
export async function changeAdminCertificateStatus(
  id: number,
  status: CertificateStatus,

): Promise<DbCertificate> {
  const res = await fetch(`/api/admin/certificates/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Failed to change certificate status');
  }
  return json.data;
}

/**
 * Fetch audit logs for a single certificate
 */
export async function fetchCertificateAuditLogs(
  certificateId: number
): Promise<CertificateAuditLog[]> {
  const res = await fetch(`/api/admin/certificates/${certificateId}/audit-logs`);
  if (!res.ok) {
    throw new Error(`Failed to load audit logs (${res.status})`);
  }
  const json: AdminAuditLogsResponse = await res.json();
  return json.data || [];
}

/**
 * Fetch all recent audit logs across all certificates
 */
export async function fetchGlobalAuditLogs(
  limit: number = 50
): Promise<CertificateAuditLog[]> {
  const res = await fetch(`/api/admin/certificates/audit-logs?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to load audit logs (${res.status})`);
  }
  const json: AdminAuditLogsResponse = await res.json();
  return json.data || [];
}
