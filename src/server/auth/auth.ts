import { betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import { getSqliteDatabase } from '../db/database';

const DEFAULT_SECRET = 'ecaseuro-system-admin-auth-secret-key-2024-secure';
const secret = process.env.BETTER_AUTH_SECRET || DEFAULT_SECRET;

/**
 * Safely extracts the hostname from a URL string if valid.
 */
function extractHost(urlStr?: string): string {
  if (!urlStr) return '';
  try {
    return new URL(urlStr).host;
  } catch {
    return '';
  }
}

// Inspect active environment origins (AI Studio Cloud Run container injects APP_URL)
const appUrl = (process.env.APP_URL || process.env.BETTER_AUTH_URL || '').trim();
const appHost = extractHost(process.env.APP_URL);
const explicitAuthHost = extractHost(process.env.BETTER_AUTH_URL);

/**
 * Validated host allowlist for dynamic Base URL resolution in hosted preview environments.
 * Prevents trusting arbitrary or unvalidated Host/X-Forwarded-Host headers while seamlessly
 * supporting AI Studio Cloud Run preview hosts (*.run.app, *.googleusercontent.com, *.aistudio.google.com)
 * as well as custom production deployment domains and local development.
 */
const allowedHosts = Array.from(
  new Set(
    [
      appHost,
      explicitAuthHost,
      '*.run.app',
      '*.googleusercontent.com',
      '*.aistudio.google.com',
      'localhost',
      'localhost:*',
      '127.0.0.1',
      '127.0.0.1:*',
      '0.0.0.0',
      '0.0.0.0:*'
    ].filter(Boolean)
  )
);

/**
 * Allowlist of trusted origins for CORS and CSRF verification.
 */
const trustedOrigins = Array.from(
  new Set(
    [
      appUrl,
      process.env.BETTER_AUTH_URL || '',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://localhost:*',
      'http://127.0.0.1:*',
      'https://localhost:*',
      'https://127.0.0.1:*',
      'https://*.run.app',
      'https://*.googleusercontent.com',
      'https://*.aistudio.google.com'
    ].filter(Boolean)
  )
);

export const auth = betterAuth({
  database: getSqliteDatabase(),
  secret,
  baseURL: {
    allowedHosts,
    fallback: appUrl || undefined,
    protocol: 'auto'
  },
  trustedOrigins,
  emailAndPassword: {
  enabled: true,
  autoSignIn: false
},
  user: {
    additionalFields: {
      status: {
        type: 'string',
        defaultValue: 'Active',
        required: false
      },
      role: {
        type: 'string',
        defaultValue: 'admin',
        required: false
      }
    }
  },
  hooks: {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== '/sign-in/email' || !ctx.body) {
      return;
    }

    const body = ctx.body as {
      email?: string;
      password?: string;
    };

    const rawEmail = typeof body.email === 'string'
      ? body.email.trim()
      : '';

    if (!rawEmail) {
      return;
    }

    const normalizedEmail = rawEmail.toLowerCase();

    const db = getSqliteDatabase();

    const user = db.prepare(`
      SELECT id, email, status, role
      FROM user
      WHERE lower(email) = lower(?)
      LIMIT 1
    `).get(normalizedEmail) as
      | {
          id: string;
          email: string;
          status?: string;
          role?: string;
        }
      | undefined;

    if (!user) {
      // Let Better Auth handle the normal invalid-credentials response.
      return;
    }

    // Use the exact canonical email stored in the database.
    body.email = user.email;

    if (user.status === 'Disabled') {
      throw ctx.error(403, {
        message:
          'This administrator account has been disabled. Please contact system administration.'
      });
    }
  })
},
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },
  advanced: {
    trustedProxyHeaders: true,
    disableOriginCheck: false,
    useSecureCookies: process.env.NODE_ENV === 'production' && !process.env.APP_URL?.startsWith('http://'),
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true
    }
  }
});

export default auth;

/**
 * Ensures initial administrative user account(s) exist in the database.
 */

const CREDENTIAL_PROVIDER_ID = 'credential';
const CREDENTIAL_ISSUER = 'local:credential';

function newAuthId(): string {
  return randomUUID().replace(/-/g, '');
}

/**
 * Ensures a Better Auth-compatible credential account exists.
 *
 * Better Auth's email/password sign-in expects:
 *
 * providerId = credential
 * issuer     = local:credential
 * accountId  = user.id
 *
 * Existing account IDs and password hashes are preserved.
 */
async function ensureCredentialAccount(
  db: ReturnType<typeof getSqliteDatabase>,
  userId: string,
  password?: string
): Promise<void> {
  const existing = db.prepare(`
    SELECT
      id,
      issuer,
      accountId,
      providerId,
      password
    FROM account
    WHERE userId = ?
      AND providerId = ?
    LIMIT 1
  `).get(userId, CREDENTIAL_PROVIDER_ID) as
    | {
        id: string;
        issuer: string;
        accountId: string;
        providerId: string;
        password?: string | null;
      }
    | undefined;

  if (!existing) {
    if (!password) {
      throw new Error(
        `Credential account is missing for user ${userId} and no password was supplied.`
      );
    }

    const hashedPassword = await hashPassword(password);
    const now = Date.now();

    db.prepare(`
      INSERT INTO account (
        id,
        issuer,
        accountId,
        providerId,
        userId,
        password,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newAuthId(),
      CREDENTIAL_ISSUER,
      userId,
      CREDENTIAL_PROVIDER_ID,
      userId,
      hashedPassword,
      now,
      now
    );

    return;
  }

  /*
   * Repair legacy account metadata without changing:
   * - account primary key
   * - password hash
   */
  if (
    existing.issuer !== CREDENTIAL_ISSUER ||
    existing.accountId !== userId ||
    existing.providerId !== CREDENTIAL_PROVIDER_ID
  ) {
    db.prepare(`
      UPDATE account
      SET
        issuer = ?,
        accountId = ?,
        providerId = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      CREDENTIAL_ISSUER,
      userId,
      CREDENTIAL_PROVIDER_ID,
      Date.now(),
      existing.id
    );
  }

  if (!existing.password) {
    if (!password) {
      throw new Error(
        `Credential account ${existing.id} has no password hash and no replacement password was supplied.`
      );
    }

    const hashedPassword = await hashPassword(password);

    db.prepare(`
      UPDATE account
      SET password = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      hashedPassword,
      Date.now(),
      existing.id
    );
  }
}

/**
 * Ensures the configured administrator exists.
 *
 * IMPORTANT:
 * This does NOT call auth.api.signUpEmail().
 *
 * Startup is not an HTTP request and therefore should not depend on
 * Better Auth's request/baseURL resolution.
 */
export async function ensureAdminUser(): Promise<void> {
  const db = getSqliteDatabase();

  const configuredEmail = (
    process.env.ADMIN_EMAIL ||
    'admin@ecaseuro.com'
  ).trim().toLowerCase();

  const configuredPassword =
    process.env.ADMIN_PASSWORD ||
    'EcasEuro2024!Admin';

  const configuredName =
    process.env.ADMIN_NAME ||
    'eCAS Euro System Administrator';

  if (!configuredEmail) {
    throw new Error('ADMIN_EMAIL must not be empty.');
  }

  const existingUser = db.prepare(`
    SELECT
      id,
      email,
      name,
      status,
      role
    FROM user
    WHERE lower(email) = lower(?)
    LIMIT 1
  `).get(configuredEmail) as
    | {
        id: string;
        email: string;
        name: string;
        status?: string;
        role?: string;
      }
    | undefined;

  /*
   * FIRST START:
   * Create the user and credential account directly.
   */
  if (!existingUser) {
    const userId = newAuthId();
    const now = Date.now();
    const hashedPassword = await hashPassword(configuredPassword);

    db.exec('BEGIN IMMEDIATE');

    try {
      db.prepare(`
        INSERT INTO user (
          id,
          name,
          email,
          emailVerified,
          image,
          status,
          role,
          createdAt,
          updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        configuredName,
        configuredEmail,
        0,
        null,
        'Active',
        'admin',
        now,
        now
      );

      db.prepare(`
        INSERT INTO account (
          id,
          issuer,
          accountId,
          providerId,
          userId,
          password,
          createdAt,
          updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newAuthId(),
        CREDENTIAL_ISSUER,
        userId,
        CREDENTIAL_PROVIDER_ID,
        userId,
        hashedPassword,
        now,
        now
      );

      db.exec('COMMIT');

      console.log(
        `[eCAS Euro Auth] Initial admin account initialized (${configuredEmail}).`
      );
    } catch (error) {
      try {
        db.exec('ROLLBACK');
      } catch {}

      throw error;
    }

    return;
  }

  /*
   * EXISTING USER:
   * Never recreate the user or account.
   */
  db.prepare(`
    UPDATE user
    SET
      status = 'Active',
      role = 'admin',
      updatedAt = ?
    WHERE id = ?
  `).run(
    Date.now(),
    existingUser.id
  );

  await ensureCredentialAccount(
    db,
    existingUser.id,
    configuredPassword
  );

  console.log(
    `[eCAS Euro Auth] Existing admin account verified (${existingUser.email}).`
  );

  /*
   * Repair credential metadata created by the previous implementation.
   *
   * Password hashes and account primary keys are untouched.
   */
  const credentialAccounts = db.prepare(`
    SELECT id, userId
    FROM account
    WHERE providerId = ?
  `).all(CREDENTIAL_PROVIDER_ID) as Array<{
    id: string;
    userId: string;
  }>;

  for (const account of credentialAccounts) {
    db.prepare(`
      UPDATE account
      SET
        issuer = ?,
        accountId = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      CREDENTIAL_ISSUER,
      account.userId,
      Date.now(),
      account.id
    );
  }

  db.prepare(`
    UPDATE user
    SET status = 'Active'
    WHERE status IS NULL OR status = ''
  `).run();

  db.prepare(`
    UPDATE user
    SET role = 'admin'
    WHERE role IS NULL OR role = ''
  `).run();
}