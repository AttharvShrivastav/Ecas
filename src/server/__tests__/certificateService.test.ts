import { describe, it, expect, beforeAll } from 'vitest';
import {
  computeEffectiveStatus,
  formatDateToHuman,
  formatCertificateForPublic,
  normalizeCertificateNumber,
  getCertificateByNumber,
  listCertificates,
  createCertificate,
  updateCertificate,
  changeCertificateStatus,
  getCertificateAuditLogs
} from '../services/certificateService';
import { getDatabase } from '../db/database';
import initialCertificates from '../data/initialCertificates.json';

describe('eCAS Euro Certificate Service & Database Foundation', () => {
  beforeAll(async () => {
    // Ensure database is initialized with initial 56 records
    const db = await getDatabase();
    // Clean any prior test artifact
    db.run("DELETE FROM certificates WHERE certificate_number LIKE 'TEST/%'");
  });

  describe('1. Data Integrity & Initial Seed Verification', () => {
    it('should have all 56 client certificates seeded in the database', async () => {
      const result = await listCertificates({ limit: 100 });
      expect(result.pagination.total).toBe(56);
      expect(result.data.length).toBe(56);
    });

    it('should match every record from initial dataset with non-empty required fields', () => {
      expect(initialCertificates.length).toBe(56);

      for (const cert of initialCertificates) {
        expect(cert.certificateNumber.trim().length).toBeGreaterThan(0);
        expect(cert.companyName.trim().length).toBeGreaterThan(0);
        expect(cert.standard.trim().length).toBeGreaterThan(0);
        expect(cert.address.trim().length).toBeGreaterThan(0);
        expect(cert.scope.trim().length).toBeGreaterThan(0);
        expect(cert.issueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(cert.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(['Valid', 'Expired', 'Suspended', 'Withdrawn']).toContain(cert.status);
      }
    });
  });

  describe('2. Automatic Expiry & Status Precedence Rules', () => {
    it('should derive Expired if expiry date is in the past for an otherwise Valid cert', () => {
      const status = computeEffectiveStatus('Valid', '2022-01-01', '2023-01-01');
      expect(status).toBe('Expired');
    });

    it('should remain Valid if expiry date is in the future', () => {
      const status = computeEffectiveStatus('Valid', '2026-11-08', '2024-01-01');
      expect(status).toBe('Valid');
    });

    it('should preserve Withdrawn status regardless of expiry date', () => {
      // Withdrawn has highest precedence
      expect(computeEffectiveStatus('Withdrawn', '2020-01-01', '2025-01-01')).toBe('Withdrawn');
      expect(computeEffectiveStatus('Withdrawn', '2030-01-01', '2025-01-01')).toBe('Withdrawn');
    });

    it('should preserve Suspended status regardless of expiry date', () => {
      // Suspended has precedence over automated expiry
      expect(computeEffectiveStatus('Suspended', '2020-01-01', '2025-01-01')).toBe('Suspended');
      expect(computeEffectiveStatus('Suspended', '2030-01-01', '2025-01-01')).toBe('Suspended');
    });
  });

  describe('3. Public Lookup & Query Handling', () => {
    it('should look up certificate IND/02/5362023 with correct details', async () => {
      const cert = await getCertificateByNumber('IND/02/5362023');
      expect(cert).not.toBeNull();
      expect(cert?.certificateNumber).toBe('IND/02/5362023');
      expect(cert?.companyName).toBe('Ravi Engineers');
      expect(cert?.standard).toBe('Iso 9001');
      expect(cert?.scope).toContain('Galvanized Bolts');
      expect(cert?.qrVerificationUrl).toContain('IND%2F02%2F5362023');
    });

    it('should look up certificate ECA/02/5372023 case-insensitively', async () => {
      const cert = await getCertificateByNumber('eca/02/5372023');
      expect(cert).not.toBeNull();
      expect(cert?.companyName).toBe('Filmpac Private Limited');
      expect(cert?.standard).toBe('ISO 22000:2018');
    });

    it('should handle whitespace trimming during lookup', async () => {
      const cert = await getCertificateByNumber('   IND/02/5362023   ');
      expect(cert).not.toBeNull();
      expect(cert?.certificateNumber).toBe('IND/02/5362023');
    });

    it('should return null for non-existent certificate numbers', async () => {
      const cert = await getCertificateByNumber('NON_EXISTENT_99999');
      expect(cert).toBeNull();
    });

    it('should return null for empty queries', async () => {
      const cert = await getCertificateByNumber('');
      expect(cert).toBeNull();
    });
  });

  describe('4. Human-Readable Date Formatting', () => {
    it('should format ISO dates into human-readable display strings', () => {
      expect(formatDateToHuman('2023-11-03')).toBe('03 November 2023');
      expect(formatDateToHuman('2026-11-08')).toBe('08 November 2026');
      expect(formatDateToHuman('2025-05-15')).toBe('15 May 2025');
    });
  });

  describe('5. Administrative Service Operations & Audit Trails', () => {
    const testCertNumber = 'TEST/QA/2026/0099';

    it('should create a new certificate with audit log', async () => {
      const created = await createCertificate({
        certificateNumber: testCertNumber,
        companyName: 'ACME Test Industries Ltd',
        standard: 'ISO 14001:2015',
        address: '100 Innovation Way, London, UK',
        scope: 'Testing and Environmental Quality Control',
        issueDate: '2024-01-15',
        expiryDate: '2027-01-14',
        status: 'Valid'
      }, 'TEST_SUITE');

      expect(created.id).toBeGreaterThan(0);
      expect(created.certificate_number).toBe(testCertNumber);

      const logs = await getCertificateAuditLogs(created.id);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].action).toBe('CREATE');
      expect(logs[0].performed_by).toBe('TEST_SUITE');
    });

    it('should prevent duplicate certificate numbers', async () => {
      await expect(
        createCertificate({
          certificateNumber: testCertNumber,
          companyName: 'Duplicate Attempt',
          standard: 'ISO 9001:2015',
          address: 'Somewhere',
          scope: 'Testing',
          issueDate: '2024-01-01',
          expiryDate: '2027-01-01'
        })
      ).rejects.toThrow(/already exists/i);
    });

    it('should update certificate details with audit log', async () => {
      const found = await getCertificateByNumber(testCertNumber);
      expect(found).not.toBeNull();

      // Look up db record to get ID
      const list = await listCertificates({ search: testCertNumber });
      const certDb = list.data[0];

      const updated = await updateCertificate(certDb.id, {
        companyName: 'ACME Global Quality Corp',
        scope: 'Expanded International Scope'
      }, 'TEST_SUITE');

      expect(updated.company_name).toBe('ACME Global Quality Corp');

      const logs = await getCertificateAuditLogs(certDb.id);
      expect(logs.some(l => l.action === 'UPDATE')).toBe(true);
    });

    it('should suspend and reactivate certificate with status audit logs', async () => {
      const list = await listCertificates({ search: testCertNumber });
      const certDb = list.data[0];

      // Suspend
      const suspended = await changeCertificateStatus(certDb.id, 'Suspended', 'Annual surveillance audit pending', 'AUDITOR_JANE');
      expect(suspended.status).toBe('Suspended');

      // Verify public API returns Suspended
      const publicCert = await getCertificateByNumber(testCertNumber);
      expect(publicCert?.status).toBe('Suspended');

      // Reactivate
      const reactivated = await changeCertificateStatus(certDb.id, 'Valid', 'Audit successfully cleared', 'AUDITOR_JANE');
      expect(reactivated.status).toBe('Valid');

      const logs = await getCertificateAuditLogs(certDb.id);
      expect(logs.some(l => l.action === 'SUSPEND')).toBe(true);
      expect(logs.some(l => l.action === 'REACTIVATE')).toBe(true);
    });
  });
});
