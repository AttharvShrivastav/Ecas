import fs from 'fs';
import path from 'path';
import { DATABASE_DIR as DB_DIR, DATABASE_FILE as DB_FILE, HAS_EXPLICIT_DATABASE_PATH } from '../config/storagePaths';
import { DatabaseSync } from 'node:sqlite';
import initialCertificates from '../data/initialCertificates.json';
import { CertificateStatus } from '../types/certificate';
import { defaultAboutPageContent } from '../../cms/aboutContent';
import { defaultAssociationsPageContent } from '../../cms/associationsContent';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import { defaultContactPageContent } from '../../cms/contactContent';
import { defaultESGPageContent } from '../../cms/esgContent';
import { defaultHomePageContent } from '../../cms/homeContent';
import { defaultInspectionPageContent } from '../../cms/inspectionContent';
import { defaultManagementSystemPageContent } from '../../cms/managementSystemContent';
import { sampleNewsArticles } from '../../cms/newsContent';
import { defaultProductCertificationContent } from '../../cms/productCertificationContent';
import { defaultSiteSettingsContent } from '../../cms/siteSettingsContent';
import { defaultTrainingPageContent } from '../../cms/trainingContent';

let dbInstance: any = null;


/**
 * Returns the underlying SQLite DatabaseSync instance.
 * Synchronously or asynchronously initializes database, schema, and seed data.
 */
export function getSqliteDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  let rawDb: DatabaseSync;
  let isHealthy = false;

  // Diagnostic & Integrity Check on startup
  if (fs.existsSync(DB_FILE)) {
    try {
      const testDb = new DatabaseSync(DB_FILE);
      testDb.exec('PRAGMA journal_mode = WAL;');
      const integrityRow = testDb.prepare('PRAGMA integrity_check;').get() as any;
      if (integrityRow?.integrity_check === 'ok') {
        isHealthy = true;
        rawDb = testDb;
      } else {
        testDb.close();
      }
    } catch (openErr) {
      console.warn('[eCAS Euro DB] Existing database failed integrity verification:', openErr);
    }
  }

  if (!isHealthy) {
    if (fs.existsSync(DB_FILE)) {
      // Production safety: never delete, rename, replace, or recreate an
      // existing database after an integrity/open failure. Failing closed
      // preserves the original DB, WAL, and SHM files for recovery.
      throw new Error(
        `[eCAS Euro DB] Refusing to replace existing database after integrity/open failure: ${DB_FILE}`
      );
    }

    // When DATABASE_PATH is explicitly configured (production), a missing
    // database usually means the persistent mount/path is wrong. Refuse to
    // silently create a fresh empty production database.
    if (HAS_EXPLICIT_DATABASE_PATH) {
      throw new Error(
        `[eCAS Euro DB] Configured DATABASE_PATH does not exist: ${DB_FILE}`
      );
    }

    // Local development fallback: create a new DB only when no explicit
    // production database path has been configured.
    rawDb = new DatabaseSync(DB_FILE);
  }

  // Enable WAL and foreign keys for high performance and integrity
  try {
    rawDb.exec('PRAGMA journal_mode = WAL;');
    rawDb.exec('PRAGMA synchronous = NORMAL;');
    rawDb.exec('PRAGMA foreign_keys = ON;');

    const integrityRow = rawDb.prepare('PRAGMA integrity_check;').get() as any;
    const journalRow = rawDb.prepare('PRAGMA journal_mode;').get() as any;
    console.log('[eCAS Euro DB] SQLite connection active & verified:', {
      integrity: integrityRow?.integrity_check || 'unknown',
      journalMode: journalRow?.journal_mode || 'unknown',
    });
  } catch (err) {
    console.warn('[eCAS Euro DB] Pragma execution warning:', err);
  }

  // Wrap methods for seamless backward-compatibility with sql.js-style calls
  const origPrepare = rawDb.prepare.bind(rawDb);
  (rawDb as any).prepare = function (sql: string) {
    const stmt = origPrepare(sql);
    const origRun = stmt.run.bind(stmt);
    const origAll = stmt.all.bind(stmt);
    const origGet = stmt.get.bind(stmt);

    stmt.run = function (...args: any[]) {
      const flatArgs = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return origRun(...flatArgs);
    };
    stmt.all = function (...args: any[]) {
      const flatArgs = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return origAll(...flatArgs);
    };
    stmt.get = function (...args: any[]) {
      const flatArgs = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return origGet(...flatArgs);
    };
    (stmt as any).free = function () {}; // sql.js compatibility no-op
    (stmt as any).step = function () { return false; };
    (stmt as any).getAsObject = function () { return {}; };
    (stmt as any).bind = function () {};
    return stmt;
  };

  (rawDb as any).run = function (sql: string, params: any[] = []) {
    if (!params || params.length === 0) {
      return rawDb.exec(sql);
    }
    const flatParams = Array.isArray(params) ? params : [params];
    const stmt = rawDb.prepare(sql);
    return stmt.run(...flatParams);
  };

  initSchema(rawDb);
  seedInitialData(rawDb);

  dbInstance = rawDb;
  return dbInstance;
}

/**
 * Async getter for backwards compatibility with existing application service calls.
 */
export async function getDatabase(): Promise<any> {
  return getSqliteDatabase();
}

/**
 * Compatibility helper for saving database changes (no-op since DatabaseSync writes synchronously).
 */
export function saveDatabase(_db?: any): void {
  // node:sqlite DatabaseSync automatically writes directly to the disk file.
}

/**
 * Creates relational schema, constraints, performance indexes, and Better Auth authentication tables.
 */
function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certificate_number TEXT UNIQUE NOT NULL COLLATE NOCASE,
      company_name TEXT NOT NULL,
      standard TEXT NOT NULL,
      address TEXT NOT NULL,
      other_address TEXT,
      scope TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Valid' CHECK (status IN ('Valid', 'Expired', 'Suspended', 'Withdrawn')),
      accreditation_body TEXT NOT NULL DEFAULT 'eCAS Euro International Accreditation Directorate',
      surveillance_audit_date TEXT,
      original_registration_date TEXT,
      qr_verification_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_cert_no ON certificates (certificate_number);
    CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates (status);
    CREATE INDEX IF NOT EXISTS idx_certificates_expiry_date ON certificates (expiry_date);
    CREATE INDEX IF NOT EXISTS idx_certificates_company_name ON certificates (company_name);
    CREATE INDEX IF NOT EXISTS idx_certificates_standard ON certificates (standard);

    CREATE TABLE IF NOT EXISTS certificate_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certificate_id INTEGER NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
      certificate_number TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('IMPORT', 'CREATE', 'UPDATE', 'SUSPEND', 'REACTIVATE', 'WITHDRAW', 'DELETE')),
      old_values TEXT,
      new_values TEXT,
      performed_by TEXT NOT NULL DEFAULT 'SYSTEM',
      performed_at TEXT NOT NULL DEFAULT (datetime('now')),
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_audit_cert_id ON certificate_audit_logs (certificate_id);
    CREATE INDEX IF NOT EXISTS idx_audit_cert_number ON certificate_audit_logs (certificate_number);
    CREATE INDEX IF NOT EXISTS idx_audit_performed_at ON certificate_audit_logs (performed_at);

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      enquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      privacy_consent INTEGER NOT NULL DEFAULT 1,
      source_page TEXT,
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Closed')),
      internal_notes TEXT,
      handled_by TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at);
    CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries (email);
    CREATE INDEX IF NOT EXISTS idx_enquiries_enquiry_type ON enquiries (enquiry_type);

    -- Better Auth Tables
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'Active',
      role TEXT NOT NULL DEFAULT 'admin',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expiresAt INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      issuer TEXT NOT NULL,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt INTEGER,
      refreshTokenExpiresAt INTEGER,
      scope TEXT,
      password TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_session_userId ON session (userId);
    CREATE INDEX IF NOT EXISTS idx_session_token ON session (token);
    CREATE INDEX IF NOT EXISTS idx_account_userId ON account (userId);
    CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification (identifier);
    CREATE INDEX IF NOT EXISTS idx_user_status ON user (status);

    -- Admin Security & Account Audit Logs
    CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id TEXT,
      actor_email TEXT,
      target_user_id TEXT,
      target_email TEXT,
      action TEXT NOT NULL,
      details_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON admin_audit_logs (action);
    CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON admin_audit_logs (created_at);

    -- CMS Pages Table (Singleton Content-as-Data per page_key)
    CREATE TABLE IF NOT EXISTS cms_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content_json TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_pages_page_key ON cms_pages (page_key);

    -- News Articles Table
    CREATE TABLE IF NOT EXISTS news_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      published_at TEXT NOT NULL,
      formatted_date TEXT,
      read_time TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      featured_image TEXT,
      featured_image_alt TEXT,
      author_name TEXT,
      author_role TEXT,
      author_org TEXT,
      author_avatar TEXT,
      excerpt TEXT NOT NULL,
      content_json TEXT NOT NULL,
      tags_json TEXT,
      seo_json TEXT,
      status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles (slug);
    CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles (status);
    CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles (category);
    CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles (published_at);
  `);

  // Safe, introspected schema migrations for user table & security fields
  runSafeMigrations(db);
}

/**
 * Idempotent schema migration using table introspection.
 * Guarantees zero data loss and safe startup every time.
 */
function runSafeMigrations(db: DatabaseSync): void {
  try {
    const tableInfo = db.prepare('PRAGMA table_info(user)').all() as Array<{ name: string }>;
    const existingColumns = new Set(tableInfo.map((col) => col.name.toLowerCase()));

    if (!existingColumns.has('status')) {
      db.exec("ALTER TABLE user ADD COLUMN status TEXT NOT NULL DEFAULT 'Active';");
      console.log('[eCAS Euro DB] Applied schema migration: added status column to user table.');
    }

    if (!existingColumns.has('role')) {
      db.exec("ALTER TABLE user ADD COLUMN role TEXT NOT NULL DEFAULT 'admin';");
      console.log('[eCAS Euro DB] Applied schema migration: added role column to user table.');
    }

    // Ensure all existing user records have valid status and role
    db.prepare("UPDATE user SET status = 'Active' WHERE status IS NULL OR status = ''").run();
    db.prepare("UPDATE user SET role = 'admin' WHERE role IS NULL OR role = ''").run();

    // Safe index creation
    db.exec("CREATE INDEX IF NOT EXISTS idx_user_status ON user (status);");
  } catch (migErr) {
    console.warn('[eCAS Euro DB] Safe schema migration notice:', migErr);
  }
}

/**
 * Seeds the initial client-provided 56 records safely and deterministically.
 */
function seedInitialData(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM certificates').get() as { total: number } | undefined;
  const count = countRow ? countRow.total : 0;

  if (count < 56) {
    const insertCert = db.prepare(`
      INSERT OR IGNORE INTO certificates (
        certificate_number,
        company_name,
        standard,
        address,
        other_address,
        scope,
        issue_date,
        expiry_date,
        status,
        accreditation_body,
        surveillance_audit_date,
        original_registration_date,
        qr_verification_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAudit = db.prepare(`
      INSERT INTO certificate_audit_logs (
        certificate_id,
        certificate_number,
        action,
        old_values,
        new_values,
        performed_by,
        performed_at,
        notes
      ) VALUES (?, ?, 'IMPORT', NULL, ?, 'SYSTEM_SEED', datetime('now'), 'Initial Client Excel Dataset Import (56 records)')
    `);

    for (const item of initialCertificates) {
      const certNumber = item.certificateNumber.trim();
      const qrUrl = `/verify-certificate?cert_no=${encodeURIComponent(certNumber)}`;
      const statusVal = item.status as CertificateStatus;

      insertCert.run(
        certNumber,
        item.companyName.trim(),
        item.standard.trim(),
        item.address.trim(),
        item.otherAddress ? item.otherAddress.trim() : null,
        item.scope.trim(),
        item.issueDate,
        item.expiryDate,
        statusVal,
        'eCAS Euro International Accreditation Directorate',
        null,
        item.issueDate,
        qrUrl
      );

      const idRow = db.prepare('SELECT id FROM certificates WHERE certificate_number = ?').get(certNumber) as { id: number } | undefined;
      if (idRow) {
        insertAudit.run(
          idRow.id,
          certNumber,
          JSON.stringify({
            companyName: item.companyName,
            standard: item.standard,
            status: statusVal,
            issueDate: item.issueDate,
            expiryDate: item.expiryDate
          })
        );
      }
    }
  }


  // Seed CMS pages if missing
  const initialPages = [
    {
      page_key: 'home',
      title: 'Home',
      content: defaultHomePageContent,
    },
    {
      page_key: 'about',
      title: 'About Us',
      content: defaultAboutPageContent,
    },
    {
      page_key: 'product-certification',
      title: 'Product Certification',
      content: defaultProductCertificationContent,
    },
    {
      page_key: 'management-system',
      title: 'Management System Certification',
      content: defaultManagementSystemPageContent,
    },
    {
      page_key: 'inspection',
      title: 'Inspection Services',
      content: defaultInspectionPageContent,
    },
    {
      page_key: 'cbam-verification',
      title: 'CBAM Verification',
      content: defaultCbamVerificationPageContent,
    },
    {
      page_key: 'esg',
      title: 'ESG Assurance and Support',
      content: defaultESGPageContent,
    },
    {
      page_key: 'training',
      title: 'Training',
      content: defaultTrainingPageContent,
    },
    {
      page_key: 'associations',
      title: 'Associations & Technical Partners',
      content: defaultAssociationsPageContent,
    },
    {
      page_key: 'contact',
      title: 'Contact Us',
      content: defaultContactPageContent,
    },
    {
      page_key: 'settings',
      title: 'Site Settings & Global Contact',
      content: defaultSiteSettingsContent,
    },
  ];

  const insertPageStmt = db.prepare(`
    INSERT OR IGNORE INTO cms_pages (page_key, title, content_json, version, updated_by, updated_at)
    VALUES (?, ?, ?, 1, 'SYSTEM_SEED', datetime('now'))
  `);

  for (const p of initialPages) {
    insertPageStmt.run(p.page_key, p.title, JSON.stringify(p.content));
  }

  // Seed News Articles if table is empty
  const newsCountRow = db.prepare('SELECT COUNT(*) as total FROM news_articles').get() as { total: number } | undefined;
  const newsCount = newsCountRow ? newsCountRow.total : 0;

  if (newsCount === 0) {
    const insertArticleStmt = db.prepare(`
      INSERT OR IGNORE INTO news_articles (
        slug,
        title,
        category,
        published_at,
        formatted_date,
        read_time,
        featured,
        featured_image,
        featured_image_alt,
        author_name,
        author_role,
        author_org,
        author_avatar,
        excerpt,
        content_json,
        tags_json,
        seo_json,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'))
    `);

    for (const art of sampleNewsArticles) {
      insertArticleStmt.run(
        art.slug,
        art.title,
        art.category,
        art.publishedAt,
        art.formattedDate || null,
        art.readTime || null,
        art.featured ? 1 : 0,
        art.featuredImage || null,
        art.featuredImageAlt || null,
        art.author?.name || null,
        art.author?.role || null,
        art.author?.organization || null,
        art.author?.avatar || null,
        art.excerpt,
        JSON.stringify(art.content || []),
        JSON.stringify(art.tags || []),
        JSON.stringify(art.seo || {})
      );
    }
  }
}

/**
 * Helper to convert SQL query result to typed array of objects
 */
export function queryAll<T = any>(db: any, sql: string, params: any[] = []): T[] {
  const flatParams = Array.isArray(params) ? params : [params];
  const stmt = db.prepare(sql);
  return stmt.all(...flatParams) as T[];
}

/**
 * Helper to query a single row
 */
export function queryOne<T = any>(db: any, sql: string, params: any[] = []): T | null {
  const flatParams = Array.isArray(params) ? params : [params];
  const stmt = db.prepare(sql);
  const row = stmt.get(...flatParams);
  return row ? (row as T) : null;
}

