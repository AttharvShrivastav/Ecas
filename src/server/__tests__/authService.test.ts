import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { auth, ensureAdminUser } from '../auth/auth';
import { getSqliteDatabase, queryOne } from '../db/database';
import { requireAdminSession } from '../middleware/authMiddleware';
import { certificateRouter, adminCertificateRouter } from '../routes/certificateRoutes';
import { publicEnquiryRouter, adminEnquiryRouter } from '../routes/enquiryRoutes';
import { adminAccountRouter } from '../routes/accountRoutes';
import { provisionAdminAccount } from '../services/accountService';

describe('eCAS Euro Better Auth & Security Foundation', () => {
  let app: express.Express;
  let server: any;
  let port: number;
  let baseUrl: string;

  beforeAll(async () => {
    // Ensure DB and admin user are initialized
    getSqliteDatabase();
    await ensureAdminUser();

    // Set up test Express server mirroring server.ts
    app = express();
    app.all('/api/auth/*', toNodeHandler(auth));
    app.use(express.json());

    // Public routes
    app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/certificates', certificateRouter);
    app.use('/api/enquiries', publicEnquiryRouter);

    // Protected admin routes
    app.use('/api/admin', requireAdminSession);
    app.use('/api/admin/certificates', adminCertificateRouter);
    app.use('/api/admin/enquiries', adminEnquiryRouter);
    app.use('/api/admin/accounts', adminAccountRouter);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = (server.address() as any).port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  describe('1. Database Tables & Schema Validation', () => {
    it('should have all Better Auth tables (user, session, account, verification) provisioned in ecaseuro.db', () => {
      const db = getSqliteDatabase();

      const userTable = queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='user'");
      expect(userTable).toBeDefined();
      expect(userTable?.name).toBe('user');

      const sessionTable = queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='session'");
      expect(sessionTable).toBeDefined();
      expect(sessionTable?.name).toBe('session');

      const accountTable = queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='account'");
      expect(accountTable).toBeDefined();
      expect(accountTable?.name).toBe('account');

      const verificationTable = queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='verification'");
      expect(verificationTable).toBeDefined();
      expect(verificationTable?.name).toBe('verification');
    });

    it('should have the initial admin user account safely persisted in the user table', () => {
      const db = getSqliteDatabase();
      const user = queryOne(db, "SELECT id, name, email FROM user WHERE email = 'admin@ecaseuro.com'");
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@ecaseuro.com');
      expect(user?.name).toBe('eCAS Euro System Administrator');

      const account = queryOne(db, 'SELECT id, providerId, password FROM account WHERE userId = ?', [user?.id]);
      expect(account).toBeDefined();
      expect(account?.providerId).toBe('credential');
      expect(account?.password).toBeDefined();
      // Password must be hashed, not plaintext
      expect(account?.password).not.toBe('EcasEuro2024!Admin');
    });
  });

  describe('2. Authentication Flow & Session Management', () => {
    it('should reject sign-in attempts with incorrect credentials', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'WrongPassword123!'
        })
      });

      expect([400, 401]).toContain(res.status);
      const data = await res.json();
      expect(data).toHaveProperty('message');
    });

    it('should reject sign-in attempts for non-existent users', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'unknown@ecaseuro.com',
          password: 'Password123!'
        })
      });

      expect([400, 401]).toContain(res.status);
    });

    it('should authenticate successfully with valid credentials and return a session token', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('admin@ecaseuro.com');

      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain('better-auth.session_token');
    });

    it('should authenticate successfully with AI Studio Cloud Run preview origins and forwarded host headers', async () => {
      const previewOrigin = 'https://ais-dev-uabta7fdgeqmv7vnfhradh-831280996291.asia-east1.run.app';
      const previewHost = 'ais-dev-uabta7fdgeqmv7vnfhradh-831280996291.asia-east1.run.app';

      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': previewOrigin,
          'X-Forwarded-Host': previewHost,
          'X-Forwarded-Proto': 'https'
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('admin@ecaseuro.com');
      expect(data.token).toBeDefined();
    });

    it('should reject authentication attempts from untrusted origins with 403 Forbidden', async () => {
      const previewHost = 'ais-dev-uabta7fdgeqmv7vnfhradh-831280996291.asia-east1.run.app';
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': previewHost,
          'X-Forwarded-Proto': 'https',
          'Origin': 'https://untrusted-malicious-domain.com'
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(403);
    });

    it('should reject requests with unallowed forwarded hosts', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': 'malicious-spoofed-host.com',
          'X-Forwarded-Proto': 'https',
          'Origin': 'https://malicious-spoofed-host.com'
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(403);
    });
  });

  describe('3. Administrative API Access Control (/api/admin/*)', () => {
    it('should deny unauthenticated requests to /api/admin/certificates with 401 UNAUTHORIZED', async () => {
      const res = await fetch(`${baseUrl}/api/admin/certificates`);
      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data).toEqual({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.'
        }
      });
    });

    it('should deny unauthenticated requests to /api/admin/enquiries with 401 UNAUTHORIZED', async () => {
      const res = await fetch(`${baseUrl}/api/admin/enquiries`);
      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data.error.code).toBe('UNAUTHORIZED');
    });

    it('should grant access to /api/admin/certificates for authenticated admin session', async () => {
      // 1. Sign in
      const loginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      const cookie = loginRes.headers.get('set-cookie') || '';
      const loginData = await loginRes.json();
      const token = loginData.token;

      // 2. Fetch admin certificates with cookie or bearer token
      const authRes = await fetch(`${baseUrl}/api/admin/certificates`, {
        headers: {
          'Cookie': cookie,
          'Authorization': `Bearer ${token}`
        }
      });

      expect(authRes.status).toBe(200);
      const authData = await authRes.json();
      expect(authData.success).toBe(true);
      expect(authData.data).toBeDefined();
      expect(authData.pagination.total).toBeGreaterThanOrEqual(56);
    });

    it('should grant access to /api/admin/enquiries for authenticated admin session', async () => {
      const loginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'admin@ecaseuro.com',
          password: 'EcasEuro2024!Admin'
        })
      });

      const cookie = loginRes.headers.get('set-cookie') || '';
      const loginData = await loginRes.json();
      const token = loginData.token;

      const authRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
        headers: {
          'Cookie': cookie,
          'Authorization': `Bearer ${token}`
        }
      });

      expect(authRes.status).toBe(200);
      const authData = await authRes.json();
      expect(authData.success).toBe(true);
      expect(authData.data).toBeDefined();
    });
  });

  describe('4. Public API Availability (Zero Impact Guarantee)', () => {
    it('should allow unauthenticated access to /api/health', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
    });

    it('should allow unauthenticated access to public certificate verification /api/certificates/verify?cert_no=IND/02/5362023', async () => {
      const res = await fetch(`${baseUrl}/api/certificates/verify?cert_no=IND%2F02%2F5362023`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.certificateNumber).toBe('IND/02/5362023');
    });

    it('should allow unauthenticated public certificate lookup by path parameter /api/certificates/verify/IND/02/5362023', async () => {
      const res = await fetch(`${baseUrl}/api/certificates/verify/IND%2F02%2F5362023`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.certificateNumber).toBe('IND/02/5362023');
    });

    it('should allow unauthenticated public enquiry submission /api/enquiries', async () => {
      const res = await fetch(`${baseUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Public Test Lead',
          email: 'test.lead@client-domain.eu',
          enquiryType: 'Management System Certification',
          message: 'Public test enquiry message for certification inquiry.',
          privacyConsent: true
        })
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Public Test Lead');
    });
  });

  describe('5. Admin Authentication & Account Provisioning Regression Suite', () => {
    const existingAdminEmail = 'shrivastav.atharv21@gmail.com';
    let originalUserId: string;
    let originalAccountId: string;

    beforeAll(() => {
      const db = getSqliteDatabase();
      const user = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(existingAdminEmail) as any;
      if (user) {
        originalUserId = user.id;
        const acct = db.prepare('SELECT id FROM account WHERE userId = ?').get(user.id) as any;
        if (acct) {
          originalAccountId = acct.id;
        }
      }
    });

    it('1. Existing admin can log in with existing credentials', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: existingAdminEmail,
          password: process.env.ADMIN_PASSWORD || 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('user');
      expect(data.user.email.toLowerCase()).toBe(existingAdminEmail.toLowerCase());
      if (originalUserId) {
        expect(data.user.id).toBe(originalUserId);
      }
    });

    it('2. Incorrect password is rejected with 401', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: existingAdminEmail,
          password: 'IncorrectSecretPassword999!'
        })
      });

      expect([400, 401]).toContain(res.status);
    });

    it('3. Unknown email is rejected with 401', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: 'nonexistent.administrator@ecaseuro.com',
          password: 'AnyPassword123!'
        })
      });

      expect([400, 401]).toContain(res.status);
    });

    it('4. Existing admin receives a valid session token and cookie', async () => {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: existingAdminEmail,
          password: process.env.ADMIN_PASSWORD || 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain('better-auth.session_token');
    });

    it('5. Existing admin can access protected admin routes (/api/admin/accounts)', async () => {
      const loginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: existingAdminEmail,
          password: process.env.ADMIN_PASSWORD || 'EcasEuro2024!Admin'
        })
      });

      const cookie = loginRes.headers.get('set-cookie') || '';
      const loginData = await loginRes.json();

      const accountsRes = await fetch(`${baseUrl}/api/admin/accounts`, {
        headers: {
          'Cookie': cookie,
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      expect(accountsRes.status).toBe(200);
      const accountsData = await accountsRes.json();
      expect(accountsData.success).toBe(true);
      expect(Array.isArray(accountsData.data)).toBe(true);
      expect(accountsData.data.some((a: any) => a.email.toLowerCase() === existingAdminEmail.toLowerCase())).toBe(true);
    });

    it('6. Disabled admin cannot log in', async () => {
      const db = getSqliteDatabase();
      db.prepare('UPDATE user SET status = ? WHERE lower(email) = lower(?)').run('Disabled', existingAdminEmail);

      try {
        const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': baseUrl
          },
          body: JSON.stringify({
            email: existingAdminEmail,
            password: process.env.ADMIN_PASSWORD || 'EcasEuro2024!Admin'
          })
        });

        expect([401, 403]).toContain(res.status);
      } finally {
        // Restore Active status
        db.prepare('UPDATE user SET status = ? WHERE lower(email) = lower(?)').run('Active', existingAdminEmail);
      }
    });

    it('7. Re-enabled admin can log in again', async () => {
      const db = getSqliteDatabase();
      db.prepare('UPDATE user SET status = ? WHERE lower(email) = lower(?)').run('Active', existingAdminEmail);

      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: existingAdminEmail,
          password: process.env.ADMIN_PASSWORD || 'EcasEuro2024!Admin'
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email.toLowerCase()).toBe(existingAdminEmail.toLowerCase());
    });

    it('8. Newly provisioned admin can log in', async () => {
      const db = getSqliteDatabase();
      const testEmail = `new.prov.admin.${Date.now()}@ecaseuro.com`;
      const testPassword = 'ProvAdminPass123!';

      const provisioned = await provisionAdminAccount(
        {
          name: 'Newly Provisioned Admin',
          email: testEmail,
          password: testPassword,
          confirmPassword: testPassword,
          status: 'Active'
        },
        { id: originalUserId || 'SYSTEM', email: existingAdminEmail }
      );

      expect(provisioned).toBeDefined();
      expect(provisioned.email).toBe(testEmail);

      const loginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });

      expect(loginRes.status).toBe(200);
      const loginData = await loginRes.json();
      expect(loginData.user.email).toBe(testEmail);

      // Clean up test provisioned account
      db.prepare('DELETE FROM account WHERE userId = ?').run(provisioned.id);
      db.prepare('DELETE FROM session WHERE userId = ?').run(provisioned.id);
      db.prepare('DELETE FROM user WHERE id = ?').run(provisioned.id);
    });

    it('9. Existing admin user ID remains unchanged', () => {
      const db = getSqliteDatabase();
      const user = db.prepare('SELECT id, email FROM user WHERE lower(email) = lower(?)').get(existingAdminEmail) as any;
      expect(user).toBeDefined();
      if (originalUserId) {
        expect(user.id).toBe(originalUserId);
      }
    });

    it('10. Existing admin account ID remains unchanged', () => {
      const db = getSqliteDatabase();
      const user = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(existingAdminEmail) as any;
      expect(user).toBeDefined();
      const acct = db.prepare('SELECT id, userId, providerId FROM account WHERE userId = ? AND providerId = ?').get(user.id, 'credential') as any;
      expect(acct).toBeDefined();
      if (originalAccountId) {
        expect(acct.id).toBe(originalAccountId);
      }
    });
  });
});
