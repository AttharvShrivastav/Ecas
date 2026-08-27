/**
 * Certificate Verification API Client Service
 *
 * Connects the public frontend verification UI to the backend SQLite Certificate Registry API:
 * GET /api/certificates/verify?cert_no=<CERT_NO>
 */

import type { CertificateRecord, VerificationApiResponse } from '../types/verification';

export interface VerifyCertificateResult {
  success: boolean;
  record?: CertificateRecord;
  notFound?: boolean;
  errorMessage?: string;
}

/**
 * Builds the URL for certificate verification API requests.
 * Properly encodes URL characters such as '/' (e.g., 'IND/02/5482025' -> 'IND%2F02%2F5482025').
 */
export function buildVerificationApiUrl(certNo: string): string {
  const encodedCert = encodeURIComponent(certNo.trim());
  return `/api/certificates/verify?cert_no=${encodedCert}`;
}

/**
 * Verifies a certificate number against the live eCAS Euro Certificate Registry.
 *
 * @param certNo Certificate identifier string (e.g., "IND/02/5482025", "UAE/01/99245")
 * @returns Object with verification status and certificate record if found
 */
export async function verifyCertificate(certNo: string): Promise<VerifyCertificateResult> {
  const trimmed = certNo.trim();
  if (!trimmed) {
    return {
      success: false,
      notFound: true,
      errorMessage: 'Certificate number cannot be empty.'
    };
  }

  const url = buildVerificationApiUrl(trimmed);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.status === 404) {
      return {
        success: false,
        notFound: true,
        errorMessage: 'No registered certificate matched the provided identification number.'
      };
    }

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as VerificationApiResponse | null;
      return {
        success: false,
        errorMessage: errorData?.error?.message || `Verification request failed with status: ${response.status}`
      };
    }

    const data = (await response.json()) as VerificationApiResponse;
    if (data.success && data.data) {
      return {
        success: true,
        record: data.data
      };
    }

    return {
      success: false,
      notFound: true,
      errorMessage: 'Certificate record not found.'
    };
  } catch (err: any) {
    console.error('Failed to verify certificate against registry API:', err);
    return {
      success: false,
      errorMessage: 'Unable to connect to the verification directory. Please check your connection and try again.'
    };
  }
}
