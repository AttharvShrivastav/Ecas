/**
 * Types for Certificate Verification System
 */

export type CertificateStatus =
  | 'Valid'
  | 'Expired'
  | 'Suspended'
  | 'Withdrawn'
  | 'valid'
  | 'expired'
  | 'suspended'
  | 'revoked';

export interface CertificateRecord {
  certificateNumber: string;
  companyName?: string;
  organisationName?: string; // Backwards compatible alias
  standard: string;
  address?: string;
  organisationAddress?: string; // Backwards compatible alias
  otherAddress?: string;
  scope: string;
  issueDate: string;
  expiryDate: string;
  status: CertificateStatus;
  accreditationBody?: string;
  surveillanceAuditDate?: string;
  surveillanceDueDate?: string; // Backwards compatible alias
  originalRegistrationDate?: string;
  initialCertificationDate?: string; // Backwards compatible alias
  qrVerificationUrl?: string;
}

export type VerificationState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'found'; record: CertificateRecord }
  | { status: 'not_found'; query: string }
  | { status: 'error'; message: string };

export interface VerificationApiResponse {
  success: boolean;
  data?: CertificateRecord;
  error?: {
    code: string;
    message: string;
  };
}
