import { getSqliteDatabase } from '../db/database';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';
import {
  AdminAccount,
  AdminAccountStats,
  ProvisionAdminInput,
  UpdateAdminInput,
  ResetPasswordInput
} from '../../types/adminAccount';

export interface AuditActor {
  id: string;
  email: string;
}

/**
 * Validates standard email address format.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats date fields to ISO string cleanly.
 */
function formatTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'number') {
    return new Date(val).toISOString();
  }
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toISOString();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return new Date().toISOString();
}

export function logAdminAudit(entry: {
  actorId?: string;
  actorEmail?: string;
  targetUserId?: string;
  targetEmail?: string;
  action: string;
  details?: any;
}): void {
  try {
    const db = getSqliteDatabase();
    db.prepare(`
      INSERT INTO admin_audit_logs (
        actor_id,
        actor_email,
        target_user_id,
        target_email,
        action,
        details_json,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      entry.actorId || 'SYSTEM',
      entry.actorEmail || 'system@ecaseuro.com',
      entry.targetUserId || null,
      entry.targetEmail || null,
      entry.action,
      entry.details ? JSON.stringify(entry.details) : null
    );
  } catch (err) {
    console.error('[Admin Audit Log Error]', err);
  }
}

/**
 * Lists all administrator accounts with optional search and status filter.
 */
export async function listAdminAccounts(params?: {
  search?: string;
  status?: string;
}): Promise<{ accounts: AdminAccount[]; stats: AdminAccountStats }> {
  const db = getSqliteDatabase();

  const allUsersQuery = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.emailVerified,
      COALESCE(u.status, 'Active') as status,
      COALESCE(u.role, 'admin') as role,
      u.createdAt,
      u.updatedAt,
      MAX(s.updatedAt) as lastActiveAt
    FROM user u
    LEFT JOIN session s ON u.id = s.userId
    GROUP BY u.id
    ORDER BY u.createdAt ASC
  `;

  const rows = db.prepare(allUsersQuery).all() as any[];

  let total = 0;
  let active = 0;
  let disabled = 0;

  const accounts: AdminAccount[] = rows.map((row) => {
    const accountStatus = (row.status === 'Disabled' ? 'Disabled' : 'Active') as 'Active' | 'Disabled';
    total++;
    if (accountStatus === 'Active') {
      active++;
    } else {
      disabled++;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      status: accountStatus,
      role: row.role || 'admin',
      emailVerified: Boolean(row.emailVerified),
      createdAt: formatTimestamp(row.createdAt),
      updatedAt: formatTimestamp(row.updatedAt),
      lastActiveAt: row.lastActiveAt ? formatTimestamp(row.lastActiveAt) : null,
      isPrimary: row.email?.toLowerCase() === 'admin@ecaseuro.com'
    };
  });

  const stats: AdminAccountStats = {
    total,
    active,
    disabled
  };

  let filtered = accounts;

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((acc) => acc.status === params.status);
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (acc) =>
        acc.name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q)
    );
  }

  return {
    accounts: filtered,
    stats
  };
}

/**
 * Retrieves a single admin account by ID.
 */
export async function getAdminAccountById(id: string): Promise<AdminAccount | null> {
  const db = getSqliteDatabase();
  const row = db.prepare(`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.emailVerified,
      COALESCE(u.status, 'Active') as status,
      COALESCE(u.role, 'admin') as role,
      u.createdAt,
      u.updatedAt,
      MAX(s.updatedAt) as lastActiveAt
    FROM user u
    LEFT JOIN session s ON u.id = s.userId
    WHERE u.id = ?
    GROUP BY u.id
  `).get(id) as any;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    status: (row.status === 'Disabled' ? 'Disabled' : 'Active'),
    role: row.role || 'admin',
    emailVerified: Boolean(row.emailVerified),
    createdAt: formatTimestamp(row.createdAt),
    updatedAt: formatTimestamp(row.updatedAt),
    lastActiveAt: row.lastActiveAt ? formatTimestamp(row.lastActiveAt) : null,
    isPrimary: row.email?.toLowerCase() === 'admin@ecaseuro.com'
  };
}

/**
 * Provisions a new administrator account using Better Auth and sets status.
 */
export async function provisionAdminAccount(
  input: ProvisionAdminInput,
  actor?: AuditActor
): Promise<AdminAccount> {
  const db = getSqliteDatabase();

  const name = (input.name || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  const password = input.password || '';
  const confirmPassword = input.confirmPassword || '';
  const requestedStatus = input.status === 'Disabled' ? 'Disabled' : 'Active';

  if (!name || name.length < 2) {
    throw new Error('Full name is required and must be at least 2 characters.');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('A valid administrator email address is required.');
  }

  if (!password || password.length < 8) {
    throw new Error('Password is required and must be at least 8 characters.');
  }

  if (confirmPassword && confirmPassword !== password) {
    throw new Error('Passwords do not match. Please verify your password confirmation.');
  }

  // Check email uniqueness case-insensitively
  const existingUser = db.prepare('SELECT id, email FROM user WHERE lower(email) = lower(?)').get(email) as any;
  if (existingUser) {
    throw new Error(`An administrator account with email "${email}" already exists.`);
  }

  // Create Better Auth-compatible records directly.
// Do not call auth.api.signUpEmail() from this service.
const userId = randomUUID().replace(/-/g, '');
const accountId = randomUUID().replace(/-/g, '');
const now = Date.now();
const hashedPassword = await hashPassword(password);

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
    name,
    email,
    0,
    null,
    requestedStatus,
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
    accountId,
    'local:credential',
    userId,
    'credential',
    userId,
    hashedPassword,
    now,
    now
  );

  db.exec('COMMIT');
} catch (error) {
  try {
    db.exec('ROLLBACK');
  } catch {}

  throw new Error(
    error instanceof Error
      ? error.message
      : 'Failed to create administrator account.'
  );
}


  logAdminAudit({
    actorId: actor?.id,
    actorEmail: actor?.email,
    targetUserId: userId,
    targetEmail: email,
    action: 'ACCOUNT_PROVISIONED',
    details: { name, email, status: requestedStatus }
  });

  const createdAccount = await getAdminAccountById(userId);
  if (!createdAccount) {
    throw new Error('Administrator account provisioned but could not be re-queried.');
  }

  return createdAccount;
}

/**
 * Updates an existing administrator account's name, email, or status.
 */
export async function updateAdminAccount(
  id: string,
  input: UpdateAdminInput,
  actor: AuditActor
): Promise<AdminAccount> {
  const db = getSqliteDatabase();

  const user = db.prepare('SELECT id, name, email, status FROM user WHERE id = ?').get(id) as any;
  if (!user) {
    throw new Error(`Administrator account with ID "${id}" was not found.`);
  }

  const name = (input.name || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  const targetStatus = input.status ? (input.status === 'Disabled' ? 'Disabled' : 'Active') : (user.status || 'Active');

  if (!name || name.length < 2) {
    throw new Error('Full name is required and must be at least 2 characters.');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('A valid administrator email address is required.');
  }

  // If email is changed, verify uniqueness
  if (email !== user.email.toLowerCase()) {
    const existing = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?) AND id != ?').get(email, id) as any;
    if (existing) {
      throw new Error(`An administrator account with email "${email}" already exists.`);
    }
  }

  // Safeguards when changing status to Disabled
  if (targetStatus === 'Disabled' && user.status !== 'Disabled') {
    // Cannot disable self
    if (actor.id === id) {
      throw new Error('Security safeguard: You cannot disable your own administrator account.');
    }

    // Cannot disable last active admin
    const activeRow = db.prepare("SELECT COUNT(*) as count FROM user WHERE status = 'Active' AND id != ?").get(id) as any;
    const remainingActive = activeRow ? activeRow.count : 0;
    if (remainingActive === 0) {
      throw new Error('Security safeguard: Cannot disable the last active administrator account in the system.');
    }
  }

  const now = Date.now();

  db.prepare(`
    UPDATE user
    SET name = ?, email = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `).run(name, email, targetStatus, now, id);

  // If email changed, keep the Better Auth credential account
  // linked to the same user. The accountId must remain the user ID.
  if (email !== user.email.toLowerCase()) {
    db.prepare(`
      UPDATE account
      SET
        issuer = 'local:credential',
        accountId = ?,
        providerId = 'credential',
        updatedAt = ?
      WHERE userId = ?
        AND providerId = 'credential'
    `).run(
      id,
      now,
      id
    );
  }

  // If disabled, revoke active sessions
  if (targetStatus === 'Disabled') {
    db.prepare('DELETE FROM session WHERE userId = ?').run(id);
  }

  logAdminAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    targetUserId: id,
    targetEmail: email,
    action: 'ACCOUNT_UPDATED',
    details: {
      old: { name: user.name, email: user.email, status: user.status },
      new: { name, email, status: targetStatus }
    }
  });

  const updated = await getAdminAccountById(id);
  if (!updated) {
    throw new Error('Failed to load updated administrator account.');
  }

  return updated;
}

/**
 * Disables an administrator account with security safeguards.
 */
export async function disableAdminAccount(
  id: string,
  actor: AuditActor
): Promise<AdminAccount> {
  const db = getSqliteDatabase();

  const user = db.prepare('SELECT id, name, email, status FROM user WHERE id = ?').get(id) as any;
  if (!user) {
    throw new Error(`Administrator account with ID "${id}" was not found.`);
  }

  // Self-disable safeguard
  if (actor.id === id) {
    throw new Error('Security safeguard: You cannot disable your own administrator account.');
  }

  // Last active admin safeguard
  const activeRow = db.prepare("SELECT COUNT(*) as count FROM user WHERE status = 'Active' AND id != ?").get(id) as any;
  const remainingActive = activeRow ? activeRow.count : 0;
  if (remainingActive === 0) {
    throw new Error('Security safeguard: Cannot disable the last active administrator account in the system.');
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE user
    SET status = 'Disabled', updatedAt = ?
    WHERE id = ?
  `).run(now, id);

  // Invalidate all active sessions for this user
  db.prepare('DELETE FROM session WHERE userId = ?').run(id);

  logAdminAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    targetUserId: id,
    targetEmail: user.email,
    action: 'ACCOUNT_DISABLED',
    details: { reason: 'Administrative status update to Disabled' }
  });

  const updated = await getAdminAccountById(id);
  if (!updated) {
    throw new Error('Failed to load disabled administrator account.');
  }

  return updated;
}

/**
 * Re-enables a previously disabled administrator account.
 */
export async function enableAdminAccount(
  id: string,
  actor: AuditActor
): Promise<AdminAccount> {
  const db = getSqliteDatabase();

  const user = db.prepare('SELECT id, name, email, status FROM user WHERE id = ?').get(id) as any;
  if (!user) {
    throw new Error(`Administrator account with ID "${id}" was not found.`);
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE user
    SET status = 'Active', updatedAt = ?
    WHERE id = ?
  `).run(now, id);

  logAdminAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    targetUserId: id,
    targetEmail: user.email,
    action: 'ACCOUNT_ENABLED',
    details: { reason: 'Administrative status update to Active' }
  });

  const updated = await getAdminAccountById(id);
  if (!updated) {
    throw new Error('Failed to load enabled administrator account.');
  }

  return updated;
}

/**
 * Resets an administrator account password securely using Better Auth's password hasher.
 */
export async function resetAdminPassword(
  id: string,
  input: ResetPasswordInput,
  actor: AuditActor
): Promise<void> {
  const db = getSqliteDatabase();

  const user = db.prepare('SELECT id, name, email, status FROM user WHERE id = ?').get(id) as any;
  if (!user) {
    throw new Error(`Administrator account with ID "${id}" was not found.`);
  }

  const newPassword = input.newPassword || '';
  const confirmPassword = input.confirmPassword || '';

  if (!newPassword || newPassword.length < 8) {
    throw new Error('New password is required and must be at least 8 characters.');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('New passwords do not match. Please verify your confirmation password.');
  }

  // Hash password using Better Auth crypto
  const hashedPassword = await hashPassword(newPassword);
  const now = Date.now();

  // Check if credential account exists
  const existingAccount = db.prepare('SELECT id FROM account WHERE userId = ? AND providerId = ?').get(id, 'credential') as any;

  if (existingAccount) {
  db.prepare(`
    UPDATE account
    SET password = ?, updatedAt = ?
    WHERE userId = ? AND providerId = 'credential'
    `).run(hashedPassword, now, id);
    } else {
  const accountId = randomUUID().replace(/-/g, '');

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
    VALUES (?, 'local:credential', ?, 'credential', ?, ?, ?, ?)
  `).run(
    accountId,
    id,
    id,
    hashedPassword,
    now,
    now
  );
}

  // Update user updatedAt timestamp
  db.prepare('UPDATE user SET updatedAt = ? WHERE id = ?').run(now, id);

  // Invalidate all active sessions for this account after password reset
  db.prepare('DELETE FROM session WHERE userId = ?').run(id);

  logAdminAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    targetUserId: id,
    targetEmail: user.email,
    action: 'PASSWORD_RESET',
    details: { reason: 'Administrative password reset; active sessions revoked' }
  });
}
