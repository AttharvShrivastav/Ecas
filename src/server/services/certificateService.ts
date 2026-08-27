import { getDatabase, queryAll, queryOne, saveDatabase } from '../db/database';
import {
  DbCertificate,
  PublicCertificateRecord,
  CertificateStatus,
  CreateCertificateInput,
  UpdateCertificateInput,
  CertificateListParams,
  CertificateAuditLog
} from '../types/certificate';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Converts ISO date (YYYY-MM-DD) into standard client-facing human readable string.
 * Example: "2023-11-03" -> "03 November 2023"
 */
export function formatDateToHuman(isoDateStr: string | null | undefined): string {
  if (!isoDateStr) return '';
  const parts = isoDateStr.trim().split('-');
  if (parts.length !== 3) return isoDateStr;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parts[2].padStart(2, '0');

  if (monthIdx >= 0 && monthIdx < 12) {
    return `${day} ${MONTH_NAMES[monthIdx]} ${year}`;
  }
  return isoDateStr;
}

/**
 * Gets current UTC date string formatted as YYYY-MM-DD.
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Computes the effective certificate status.
 *
 * STATUS PRECEDENCE:
 * 1. Withdrawn: Administrative revocation has absolute precedence.
 * 2. Suspended: Administrative sanction has second precedence (remains Suspended even if expired).
 * 3. Expired: Automatically derived if expiryDate < referenceDate (today).
 * 4. Valid: Otherwise Valid if active and not expired.
 */
export function computeEffectiveStatus(
  storedStatus: CertificateStatus,
  expiryDateISO: string,
  referenceDateISO: string = getCurrentDateISO()
): CertificateStatus {
  if (storedStatus === 'Withdrawn') {
    return 'Withdrawn';
  }
  if (storedStatus === 'Suspended') {
    return 'Suspended';
  }

  // ISO string comparison YYYY-MM-DD is lexicographically deterministic
  if (expiryDateISO && expiryDateISO < referenceDateISO) {
    return 'Expired';
  }

  return storedStatus === 'Expired' ? 'Expired' : 'Valid';
}

/**
 * Formats a raw database row into the exact contract expected by the public frontend UI.
 */
export function formatCertificateForPublic(
  dbCert: DbCertificate,
  referenceDateISO?: string
): PublicCertificateRecord {
  const effectiveStatus = computeEffectiveStatus(
    dbCert.status,
    dbCert.expiry_date,
    referenceDateISO
  );

  return {
    certificateNumber: dbCert.certificate_number,
    companyName: dbCert.company_name,
    standard: dbCert.standard,
    address: dbCert.address,
    otherAddress: dbCert.other_address || undefined,
    scope: dbCert.scope,
    issueDate: formatDateToHuman(dbCert.issue_date),
    expiryDate: formatDateToHuman(dbCert.expiry_date),
    status: effectiveStatus,
    accreditationBody: dbCert.accreditation_body || 'eCAS Euro International Accreditation Directorate',
    surveillanceAuditDate: dbCert.surveillance_audit_date ? formatDateToHuman(dbCert.surveillance_audit_date) : undefined,
    originalRegistrationDate: dbCert.original_registration_date ? formatDateToHuman(dbCert.original_registration_date) : undefined,
    qrVerificationUrl: dbCert.qr_verification_url || `/verify-certificate?cert_no=${encodeURIComponent(dbCert.certificate_number)}`
  };
}

/**
 * Normalizes input certificate number (trims whitespace).
 */
export function normalizeCertificateNumber(certNo: string): string {
  if (!certNo) return '';
  return certNo.trim();
}

/**
 * Public Verification Service:
 * Retrieves certificate by its certificate number with automatic status calculation.
 */
export async function getCertificateByNumber(
  certificateNumber: string
): Promise<PublicCertificateRecord | null> {
  const sanitized = normalizeCertificateNumber(certificateNumber);
  if (!sanitized) {
    return null;
  }

  const db = await getDatabase();
  const row = queryOne<DbCertificate>(
    db,
    'SELECT * FROM certificates WHERE certificate_number = ? COLLATE NOCASE',
    [sanitized]
  );

  if (!row) {
    return null;
  }

  return formatCertificateForPublic(row);
}

/**
 * Administrative / CMS Services (Prepared for future CMS phases)
 */

export async function listCertificates(params: CertificateListParams = {}) {
  const db = await getDatabase();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let sqlParams: any[] = [];

  // Search across multiple relevant fields
  if (params.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    whereClauses.push('(certificate_number LIKE ? OR company_name LIKE ? OR standard LIKE ? OR address LIKE ? OR scope LIKE ?)');
    sqlParams.push(term, term, term, term, term);
  }

  // Server-side status filter respecting dynamic expiry precedence
  if (params.status) {
    const statusVal = String(params.status);
    if (statusVal !== 'ALL') {
      if (statusVal === 'Valid') {
        whereClauses.push("(status = 'Valid' AND (expiry_date IS NULL OR expiry_date >= date('now')))");
      } else if (statusVal === 'Expired') {
        whereClauses.push("(status = 'Expired' OR (status = 'Valid' AND expiry_date < date('now')))");
      } else if (statusVal === 'Suspended') {
        whereClauses.push("status = 'Suspended'");
      } else if (statusVal === 'Withdrawn') {
        whereClauses.push("status = 'Withdrawn'");
      } else {
        whereClauses.push('status = ?');
        sqlParams.push(statusVal);
      }
    }
  }

  // Standard filter
  if (params.standard && params.standard !== 'ALL' && params.standard.trim()) {
    whereClauses.push('standard = ?');
    sqlParams.push(params.standard.trim());
  }

  // Server-side expiry filter
  if (params.expiry && params.expiry !== 'ALL') {
    if (params.expiry === 'EXPIRING_30') {
      whereClauses.push("(expiry_date >= date('now') AND expiry_date <= date('now', '+30 days'))");
    } else if (params.expiry === 'EXPIRING_90') {
      whereClauses.push("(expiry_date >= date('now') AND expiry_date <= date('now', '+90 days'))");
    } else if (params.expiry === 'EXPIRED') {
      whereClauses.push("(expiry_date < date('now') OR status = 'Expired')");
    } else if (params.expiry === 'ACTIVE') {
      whereClauses.push("((status = 'Valid' OR status IS NULL) AND (expiry_date IS NULL OR expiry_date >= date('now')))");
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Count total matching filtered rows
  const countRow = queryOne<{ total: number }>(
    db,
    `SELECT COUNT(*) as total FROM certificates ${whereSql}`,
    sqlParams
  );
  const total = countRow ? countRow.total : 0;

  // Sorting
  const allowedSortCols = [
    'id',
    'certificate_number',
    'company_name',
    'standard',
    'issue_date',
    'expiry_date',
    'status',
    'created_at'
  ];
  const sortBy = allowedSortCols.includes(params.sortBy || '') ? params.sortBy : 'id';
  const sortDir = params.sortDir === 'DESC' ? 'DESC' : 'ASC';

  const rows = queryAll<DbCertificate>(
    db,
    `SELECT * FROM certificates ${whereSql} ORDER BY ${sortBy} ${sortDir} LIMIT ? OFFSET ?`,
    [...sqlParams, limit, offset]
  );

  return {
    data: rows.map((r) => ({
      ...r,
      effectiveStatus: computeEffectiveStatus(r.status, r.expiry_date)
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

export async function getDistinctStandards(): Promise<string[]> {
  const db = await getDatabase();
  const rows = queryAll<{ standard: string }>(
    db,
    'SELECT DISTINCT standard FROM certificates WHERE standard IS NOT NULL AND TRIM(standard) != "" ORDER BY standard ASC'
  );
  return rows.map((r) => r.standard);
}

export async function getCertificateById(id: number): Promise<DbCertificate | null> {
  const db = await getDatabase();
  return queryOne<DbCertificate>(db, 'SELECT * FROM certificates WHERE id = ?', [id]);
}

export async function createCertificate(
  input: CreateCertificateInput,
): Promise<DbCertificate> {
  const db = await getDatabase();

  const certNumber = normalizeCertificateNumber(input.certificateNumber);
  if (!certNumber) throw new Error('Certificate number is required');
  if (!input.companyName) throw new Error('Company name is required');
  if (!input.standard) throw new Error('Standard is required');
  if (!input.issueDate) throw new Error('Issue date is required');
  if (!input.expiryDate) throw new Error('Expiry date is required');
  if (input.expiryDate < input.issueDate) throw new Error('Expiry date cannot precede issue date');

  const existing = queryOne(db, 'SELECT id FROM certificates WHERE certificate_number = ? COLLATE NOCASE', [certNumber]);
  if (existing) {
    throw new Error(`A certificate with number "${certNumber}" already exists.`);
  }

  const status = input.status || 'Valid';
  const accreditationBody = input.accreditationBody || 'eCAS Euro International Accreditation Directorate';
  const qrUrl = input.qrVerificationUrl || `/verify-certificate?cert_no=${encodeURIComponent(certNumber)}`;

  db.run(`
    INSERT INTO certificates (
      certificate_number, company_name, standard, address, other_address,
      scope, issue_date, expiry_date, status, accreditation_body,
      surveillance_audit_date, original_registration_date, qr_verification_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    certNumber,
    input.companyName.trim(),
    input.standard.trim(),
    input.address.trim(),
    input.otherAddress ? input.otherAddress.trim() : null,
    input.scope.trim(),
    input.issueDate,
    input.expiryDate,
    status,
    accreditationBody,
    input.surveillanceAuditDate || null,
    input.originalRegistrationDate || input.issueDate,
    qrUrl
  ]);

  const inserted = queryOne<DbCertificate>(
    db,
    'SELECT * FROM certificates WHERE certificate_number = ?',
    [certNumber]
  )!;


  saveDatabase(db);
  return inserted;
}

export async function updateCertificate(
  id: number,
  input: UpdateCertificateInput,
): Promise<DbCertificate> {
  const db = await getDatabase();
  const current = queryOne<DbCertificate>(db, 'SELECT * FROM certificates WHERE id = ?', [id]);
  if (!current) throw new Error(`Certificate with ID ${id} not found`);

  const updatedFields = {
    company_name: input.companyName !== undefined ? input.companyName.trim() : current.company_name,
    standard: input.standard !== undefined ? input.standard.trim() : current.standard,
    address: input.address !== undefined ? input.address.trim() : current.address,
    other_address: input.otherAddress !== undefined ? (input.otherAddress ? input.otherAddress.trim() : null) : current.other_address,
    scope: input.scope !== undefined ? input.scope.trim() : current.scope,
    issue_date: input.issueDate !== undefined ? input.issueDate : current.issue_date,
    expiry_date: input.expiryDate !== undefined ? input.expiryDate : current.expiry_date,
    status: input.status !== undefined ? input.status : current.status,
    accreditation_body: input.accreditationBody !== undefined ? input.accreditationBody : current.accreditation_body,
    surveillance_audit_date: input.surveillanceAuditDate !== undefined ? input.surveillanceAuditDate : current.surveillance_audit_date,
    original_registration_date: input.originalRegistrationDate !== undefined ? input.originalRegistrationDate : current.original_registration_date,
    qr_verification_url: input.qrVerificationUrl !== undefined ? input.qrVerificationUrl : current.qr_verification_url
  };

  if (updatedFields.expiry_date < updatedFields.issue_date) {
    throw new Error('Expiry date cannot precede issue date');
  }

  db.run(`
    UPDATE certificates SET
      company_name = ?, standard = ?, address = ?, other_address = ?,
      scope = ?, issue_date = ?, expiry_date = ?, status = ?,
      accreditation_body = ?, surveillance_audit_date = ?, original_registration_date = ?,
      qr_verification_url = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [
    updatedFields.company_name, updatedFields.standard, updatedFields.address, updatedFields.other_address,
    updatedFields.scope, updatedFields.issue_date, updatedFields.expiry_date, updatedFields.status,
    updatedFields.accreditation_body, updatedFields.surveillance_audit_date, updatedFields.original_registration_date,
    updatedFields.qr_verification_url, id
  ]);

  const updated = queryOne<DbCertificate>(db, 'SELECT * FROM certificates WHERE id = ?', [id])!;


  saveDatabase(db);
  return updated;
}


export async function deleteCertificate(id: number): Promise<void> {
  const db = await getDatabase();

  const current = queryOne<DbCertificate>(
    db,
    'SELECT * FROM certificates WHERE id = ?',
    [id]
  );

  if (!current) {
    throw new Error(`Certificate with ID ${id} not found`);
  }

  db.run('DELETE FROM certificates WHERE id = ?', [id]);

  saveDatabase(db);
}

export async function changeCertificateStatus(
  id: number,
  newStatus: CertificateStatus,
  reason?: string,
): Promise<DbCertificate> {
  const db = await getDatabase();
  const current = queryOne<DbCertificate>(db, 'SELECT * FROM certificates WHERE id = ?', [id]);
  if (!current) throw new Error(`Certificate with ID ${id} not found`);

  db.run(
    'UPDATE certificates SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [newStatus, id]
  );

  const updated = queryOne<DbCertificate>(db, 'SELECT * FROM certificates WHERE id = ?', [id])!;

  let actionName: CertificateAuditLog['action'] = 'UPDATE';
  if (newStatus === 'Suspended') actionName = 'SUSPEND';
  else if (newStatus === 'Withdrawn') actionName = 'WITHDRAW';
  else if (newStatus === 'Valid' && current.status === 'Suspended') actionName = 'REACTIVATE';


  saveDatabase(db);
  return updated;
}

export async function getCertificateAuditLogs(certificateId: number): Promise<CertificateAuditLog[]> {
  const db = await getDatabase();
  return queryAll<CertificateAuditLog>(
    db,
    'SELECT * FROM certificate_audit_logs WHERE certificate_id = ? ORDER BY performed_at DESC',
    [certificateId]
  );
}

export async function getAllAuditLogs(limit: number = 50): Promise<CertificateAuditLog[]> {
  const db = await getDatabase();
  return queryAll<CertificateAuditLog>(
    db,
    'SELECT * FROM certificate_audit_logs ORDER BY performed_at DESC LIMIT ?',
    [limit]
  );
}

export async function getCertificateStats() {
  const db = await getDatabase();
  const allRows = queryAll<DbCertificate>(db, 'SELECT * FROM certificates');
  const today = getCurrentDateISO();

  // 90 days from now
  const now = new Date();
  const future90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let valid = 0;
  let expired = 0;
  let suspended = 0;
  let withdrawn = 0;
  let expiringSoon90Days = 0;

  const standardsMap = new Map<string, number>();

  for (const row of allRows) {
    const effective = computeEffectiveStatus(row.status, row.expiry_date, today);
    if (effective === 'Valid') {
      valid++;
      if (row.expiry_date >= today && row.expiry_date <= future90) {
        expiringSoon90Days++;
      }
    } else if (effective === 'Expired') {
      expired++;
    } else if (effective === 'Suspended') {
      suspended++;
    } else if (effective === 'Withdrawn') {
      withdrawn++;
    }

    const std = row.standard.trim();
    standardsMap.set(std, (standardsMap.get(std) || 0) + 1);
  }

  const standardsCount = Array.from(standardsMap.entries())
    .map(([standard, count]) => ({ standard, count }))
    .sort((a, b) => b.count - a.count);

  const recentActivity = await getAllAuditLogs(15);

  return {
    total: allRows.length,
    valid,
    expired,
    suspended,
    withdrawn,
    expiringSoon90Days,
    standardsCount,
  };
}
