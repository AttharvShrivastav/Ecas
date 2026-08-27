import { getDatabase, queryAll, queryOne, saveDatabase } from '../db/database';
import {
  DbEnquiry,
  EnquiryRecord,
  EnquiryStatus,
  CreateEnquiryInput,
  EnquiryListParams,
  EnquiryStats
} from '../types/enquiry';

const VALID_STATUSES: EnquiryStatus[] = ['New', 'In Progress', 'Closed'];

/**
 * Validates email format according to standard RFC-compliant web pattern.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Formats a raw database row into an API-ready camelCase EnquiryRecord.
 */
export function formatEnquiry(row: DbEnquiry): EnquiryRecord {
  return {
    id: row.id,
    name: row.name,
    company: row.company || undefined,
    email: row.email,
    phone: row.phone || undefined,
    country: row.country || undefined,
    enquiryType: row.enquiry_type,
    message: row.message,
    privacyConsent: Boolean(row.privacy_consent),
    sourcePage: row.source_page || undefined,
    status: row.status,
    internalNotes: row.internal_notes || undefined,
    handledBy: row.handled_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Creates and persists a new enquiry from the public contact form.
 */
export async function createEnquiry(input: CreateEnquiryInput): Promise<EnquiryRecord> {
  const db = await getDatabase();

  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const company = input.company ? input.company.trim() : null;
  const phone = input.phone ? input.phone.trim() : null;
  const country = input.country ? input.country.trim() : null;
  const enquiryType = (input.enquiryType || '').trim();
  const message = (input.message || '').trim();
  const sourcePage = input.sourcePage ? input.sourcePage.trim() : null;

  // Validation rules
  if (!name) {
    throw new Error('Full name is required.');
  }

  if (!email) {
    throw new Error('Work email address is required.');
  }

  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!enquiryType) {
    throw new Error('Please select an enquiry category/service.');
  }

  if (!message || message.length < 5) {
    throw new Error('Message must be at least 5 characters long.');
  }

  const insertStmt = db.prepare(`
    INSERT INTO enquiries (
      name,
      company,
      email,
      phone,
      country,
      enquiry_type,
      message,
      privacy_consent,
      source_page,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'New', datetime('now'), datetime('now'))
  `);

  insertStmt.run([
    name,
    company || null,
    email,
    phone || null,
    country || null,
    enquiryType,
    message,
    sourcePage || null
  ]);
  insertStmt.free();

  // Retrieve the generated record
  const lastRow = queryOne<DbEnquiry>(
    db,
    'SELECT * FROM enquiries WHERE id = last_insert_rowid()'
  );

  saveDatabase(db);

  if (!lastRow) {
    throw new Error('Failed to retrieve newly created enquiry record.');
  }

  return formatEnquiry(lastRow);
}

/**
 * Retrieves a single enquiry record by ID.
 */
export async function getEnquiryById(id: number): Promise<EnquiryRecord | null> {
  const db = await getDatabase();
  const row = queryOne<DbEnquiry>(
    db,
    'SELECT * FROM enquiries WHERE id = ?',
    [id]
  );

  return row ? formatEnquiry(row) : null;
}

/**
 * Lists enquiries with optional search, status filtering, sorting, and pagination.
 */
export async function listEnquiries(params: EnquiryListParams = {}): Promise<{
  data: EnquiryRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const db = await getDatabase();
  const {
    search,
    status,
    enquiryType,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortDir = 'DESC'
  } = params;

  const validSortCols: Record<string, string> = {
    id: 'id',
    name: 'name',
    company: 'company',
    email: 'email',
    enquiry_type: 'enquiry_type',
    status: 'status',
    created_at: 'created_at'
  };

  const sortCol = validSortCols[sortBy] || 'created_at';
  const direction = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(
      '(name LIKE ? OR company LIKE ? OR email LIKE ? OR message LIKE ? OR enquiry_type LIKE ?)'
    );
    queryParams.push(term, term, term, term, term);
  }

  if (status) {
    conditions.push('status = ?');
    queryParams.push(status);
  }

  if (enquiryType && enquiryType.trim()) {
    conditions.push('enquiry_type = ?');
    queryParams.push(enquiryType.trim());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total records
  const countSql = `SELECT COUNT(*) as total FROM enquiries ${whereClause}`;
  const countRes = queryOne<{ total: number }>(db, countSql, queryParams);
  const total = countRes ? countRes.total : 0;

  // Pagination calculation
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const offset = (safePage - 1) * safeLimit;
  const totalPages = Math.ceil(total / safeLimit) || 1;

  // Fetch paginated data
  const dataSql = `
  SELECT * FROM enquiries
  ${whereClause}
  ORDER BY
    CASE WHEN status = 'Closed' THEN 1 ELSE 0 END ASC,
    ${sortCol} ${direction}
  LIMIT ${safeLimit} OFFSET ${offset}
`;

  const rows = queryAll<DbEnquiry>(db, dataSql, queryParams);

  return {
    data: rows.map(formatEnquiry),
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages
    }
  };
}

/**
 * Updates the lifecycle status and optional notes of an enquiry.
 */
export async function updateEnquiryStatus(
  id: number,
  status: EnquiryStatus,
  internalNotes?: string,
  handledBy?: string
): Promise<EnquiryRecord> {
  const db = await getDatabase();

  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid enquiry status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const existing = await getEnquiryById(id);
  if (!existing) {
    throw new Error(`Enquiry with ID ${id} not found.`);
  }

  const updateFields: string[] = ['status = ?', "updated_at = datetime('now')"];
  const updateParams: any[] = [status];

  if (internalNotes !== undefined) {
    updateFields.push('internal_notes = ?');
    updateParams.push(internalNotes);
  }

  if (handledBy !== undefined) {
    updateFields.push('handled_by = ?');
    updateParams.push(handledBy);
  }

  updateParams.push(id);

  const stmt = db.prepare(`
    UPDATE enquiries
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `);

  stmt.run(updateParams);
  stmt.free();

  saveDatabase(db);

  const updated = await getEnquiryById(id);
  if (!updated) {
    throw new Error('Failed to retrieve updated enquiry record.');
  }

  return updated;
}

/**
 * Aggregates statistics for admin oversight.
 */
export async function getEnquiryStats(): Promise<EnquiryStats> {
  const db = await getDatabase();

  const totalRow = queryOne<{ total: number }>(db, 'SELECT COUNT(*) as total FROM enquiries');
  const newRow = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'");
  const inProgressRow = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM enquiries WHERE status = 'In Progress'");
  const closedRow = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM enquiries WHERE status = 'Closed'");
  
  const recent24hRow = queryOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM enquiries WHERE created_at >= datetime('now', '-1 day')"
  );

  const typeRows = queryAll<{ enquiry_type: string; count: number }>(
    db,
    'SELECT enquiry_type, COUNT(*) as count FROM enquiries GROUP BY enquiry_type ORDER BY count DESC'
  );

  return {
    total: totalRow ? totalRow.total : 0,
    new: newRow ? newRow.count : 0,
    inProgress: inProgressRow ? inProgressRow.count : 0,
    closed: closedRow ? closedRow.count : 0,
    recentCount24h: recent24hRow ? recent24hRow.count : 0,
    byEnquiryType: typeRows.map((r) => ({ enquiryType: r.enquiry_type, count: r.count }))
  };
}
