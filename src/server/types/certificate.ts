export type CertificateStatus = 'Valid' | 'Expired' | 'Suspended' | 'Withdrawn';

export interface DbCertificate {
  id: number;
  certificate_number: string;
  company_name: string;
  standard: string;
  address: string;
  other_address: string | null;
  scope: string;
  issue_date: string; // ISO format: YYYY-MM-DD
  expiry_date: string; // ISO format: YYYY-MM-DD
  status: CertificateStatus;
  accreditation_body: string;
  surveillance_audit_date: string | null;
  original_registration_date: string | null;
  qr_verification_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicCertificateRecord {
  certificateNumber: string;
  companyName: string;
  standard: string;
  address: string;
  otherAddress?: string;
  scope: string;
  issueDate: string; // Human-formatted e.g. "03 November 2023"
  expiryDate: string; // Human-formatted e.g. "08 November 2026"
  status: CertificateStatus;
  accreditationBody?: string;
  surveillanceAuditDate?: string;
  originalRegistrationDate?: string;
  qrVerificationUrl?: string;
}

export interface CertificateAuditLog {
  id: number;
  certificate_id: number;
  certificate_number: string;
  action: 'IMPORT' | 'CREATE' | 'UPDATE' | 'SUSPEND' | 'REACTIVATE' | 'WITHDRAW' | 'DELETE';
  old_values: string | null;
  new_values: string | null;
  performed_by: string;
  performed_at: string;
  notes: string | null;
}

export interface CreateCertificateInput {
  certificateNumber: string;
  companyName: string;
  standard: string;
  address: string;
  otherAddress?: string | null;
  scope: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status?: CertificateStatus;
  accreditationBody?: string;
  surveillanceAuditDate?: string | null;
  originalRegistrationDate?: string | null;
  qrVerificationUrl?: string | null;
}

export interface UpdateCertificateInput {
  companyName?: string;
  standard?: string;
  address?: string;
  otherAddress?: string | null;
  scope?: string;
  issueDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  status?: CertificateStatus;
  accreditationBody?: string;
  surveillanceAuditDate?: string | null;
  originalRegistrationDate?: string | null;
  qrVerificationUrl?: string | null;
}

export interface CertificateListParams {
  search?: string;
  status?: CertificateStatus;
  standard?: string;
  expiry?: string;
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'certificate_number' | 'company_name' | 'standard' | 'issue_date' | 'expiry_date' | 'status' | 'created_at';
  sortDir?: 'ASC' | 'DESC';
}

export interface CertificateRegistryStats {
  total: number;
  valid: number;
  expired: number;
  suspended: number;
  withdrawn: number;
  expiringSoon90Days: number;
  standardsCount: { standard: string; count: number }[];
  recentActivity: CertificateAuditLog[];
}
