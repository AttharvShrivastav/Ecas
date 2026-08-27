import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
  createEnquiry,
  getEnquiryById,
  listEnquiries,
  updateEnquiryStatus,
  getEnquiryStats,
  isValidEmail
} from '../services/enquiryService';
import { getDatabase } from '../db/database';

describe('eCAS Euro Enquiry Service & Backend API Foundation', () => {
  beforeAll(async () => {
    // Ensure database is initialized
    await getDatabase();
  });

  beforeEach(async () => {
    // Clean test enquiries before each test block
    const db = await getDatabase();
    db.run("DELETE FROM enquiries WHERE email LIKE '%@test.ecaseuro.com' OR email LIKE '%@example.com'");
  });

  describe('1. Email Validation Helper', () => {
    it('should validate standard RFC compliant emails', () => {
      expect(isValidEmail('contact@enterprise.com')).toBe(true);
      expect(isValidEmail('auditor.lead@domain.co.uk')).toBe(true);
      expect(isValidEmail('compliance+iso@ecaseuro.com')).toBe(true);
    });

    it('should reject malformed email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@missinguser.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('2. Enquiry Creation & Field Validation', () => {
    it('should successfully create and persist a valid enquiry record', async () => {
      const enquiry = await createEnquiry({
        name: 'Alexander Weber',
        company: 'Weber Heavy Industries GmbH',
        email: 'alexander@test.ecaseuro.com',
        phone: '+49 89 123456',
        country: 'Germany',
        enquiryType: 'Management System Certification',
        message: 'Requesting quotation for ISO 9001 and ISO 14001 certification audits for our Munich facility.',
        privacyConsent: true,
        sourcePage: '/contact'
      });

      expect(enquiry).toBeDefined();
      expect(enquiry.id).toBeGreaterThan(0);
      expect(enquiry.name).toBe('Alexander Weber');
      expect(enquiry.company).toBe('Weber Heavy Industries GmbH');
      expect(enquiry.email).toBe('alexander@test.ecaseuro.com');
      expect(enquiry.phone).toBe('+49 89 123456');
      expect(enquiry.country).toBe('Germany');
      expect(enquiry.enquiryType).toBe('Management System Certification');
      expect(enquiry.message).toContain('ISO 9001 and ISO 14001');
      expect(enquiry.privacyConsent).toBe(true);
      expect(enquiry.sourcePage).toBe('/contact');
      expect(enquiry.status).toBe('New');
      expect(enquiry.createdAt).toBeDefined();
      expect(enquiry.updatedAt).toBeDefined();
    });

    it('should fail when required name is missing', async () => {
      await expect(
        createEnquiry({
          name: '',
          email: 'valid@test.ecaseuro.com',
          enquiryType: 'ESG',
          message: 'Enquiry message content here.',
          privacyConsent: true
        })
      ).rejects.toThrow(/Full name is required/i);
    });

    it('should fail when email is missing or invalid', async () => {
      await expect(
        createEnquiry({
          name: 'Jane Doe',
          email: '',
          enquiryType: 'ESG',
          message: 'Enquiry message content here.',
          privacyConsent: true
        })
      ).rejects.toThrow(/Work email address is required/i);

      await expect(
        createEnquiry({
          name: 'Jane Doe',
          email: 'invalid-email-address',
          enquiryType: 'ESG',
          message: 'Enquiry message content here.',
          privacyConsent: true
        })
      ).rejects.toThrow(/valid email address/i);
    });

    it('should fail when enquiryType is missing', async () => {
      await expect(
        createEnquiry({
          name: 'Jane Doe',
          email: 'jane@test.ecaseuro.com',
          enquiryType: '',
          message: 'Enquiry message content here.',
          privacyConsent: true
        })
      ).rejects.toThrow(/enquiry category/i);
    });

    it('should fail when message is too short or empty', async () => {
      await expect(
        createEnquiry({
          name: 'Jane Doe',
          email: 'jane@test.ecaseuro.com',
          enquiryType: 'Inspection',
          message: 'Hi',
          privacyConsent: true
        })
      ).rejects.toThrow(/at least 5 characters/i);
    });

    it('should fail when privacy consent is false', async () => {
      await expect(
        createEnquiry({
          name: 'Jane Doe',
          email: 'jane@test.ecaseuro.com',
          enquiryType: 'Inspection',
          message: 'Valid inspection request message.',
          privacyConsent: false
        })
      ).rejects.toThrow(/privacy policy/i);
    });
  });

  describe('3. Persistence, Retrieval & Status Lifecycle', () => {
    it('should retrieve an existing enquiry by its numeric ID', async () => {
      const created = await createEnquiry({
        name: 'Marcus Brody',
        company: 'Brody Logistics',
        email: 'marcus@test.ecaseuro.com',
        enquiryType: 'CBAM Verification',
        message: 'Inquiry regarding steel emissions reporting under CBAM regulation.',
        privacyConsent: true
      });

      const retrieved = await getEnquiryById(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe('Marcus Brody');
      expect(retrieved?.enquiryType).toBe('CBAM Verification');
      expect(retrieved?.status).toBe('New');
    });

    it('should return null for non-existent enquiry ID', async () => {
      const result = await getEnquiryById(9999999);
      expect(result).toBeNull();
    });

    it('should update enquiry status from New -> In Progress -> Closed', async () => {
      const created = await createEnquiry({
        name: 'Elena Rostova',
        company: 'Rostova Manufacturing',
        email: 'elena@test.ecaseuro.com',
        enquiryType: 'Product Certification',
        message: 'CE mark requirements for industrial machinery.',
        privacyConsent: true
      });

      expect(created.status).toBe('New');

      // Update to In Progress with notes
      const inProgress = await updateEnquiryStatus(
        created.id,
        'In Progress',
        'Assigned to senior certification officer for quote preparation.',
        'OFFICER_01'
      );
      expect(inProgress.status).toBe('In Progress');
      expect(inProgress.internalNotes).toBe('Assigned to senior certification officer for quote preparation.');
      expect(inProgress.handledBy).toBe('OFFICER_01');

      // Update to Closed
      const closed = await updateEnquiryStatus(
        created.id,
        'Closed',
        'Formal proposal sent and accepted by client.',
        'OFFICER_01'
      );
      expect(closed.status).toBe('Closed');
      expect(closed.internalNotes).toBe('Formal proposal sent and accepted by client.');
    });

    it('should reject invalid status transitions', async () => {
      const created = await createEnquiry({
        name: 'Test User',
        email: 'user@test.ecaseuro.com',
        enquiryType: 'Training',
        message: 'Lead auditor course dates.',
        privacyConsent: true
      });

      // @ts-expect-error testing invalid status string
      await expect(updateEnquiryStatus(created.id, 'InvalidStatus')).rejects.toThrow(/Invalid enquiry status/i);
    });
  });

  describe('4. Search, Filtering, Sorting & Pagination', () => {
    beforeEach(async () => {
      // Seed 3 distinct test records
      await createEnquiry({
        name: 'Carlos Santana',
        company: 'Solaris Energy SA',
        email: 'carlos@test.ecaseuro.com',
        enquiryType: 'ESG',
        message: 'ESG rating verification for upcoming sustainability bond issuance.',
        privacyConsent: true
      });

      await createEnquiry({
        name: 'Brenda Vance',
        company: 'Vance Metallurgy',
        email: 'brenda@test.ecaseuro.com',
        enquiryType: 'Inspection',
        message: 'Mill inspection for structural steel shipment.',
        privacyConsent: true
      });

      const closedOne = await createEnquiry({
        name: 'Daisuke Sato',
        company: 'Nippon Precision',
        email: 'sato@test.ecaseuro.com',
        enquiryType: 'Training',
        message: 'ISO 27001 lead implementer team seminar booking.',
        privacyConsent: true
      });
      await updateEnquiryStatus(closedOne.id, 'Closed', 'Completed invoice.');
    });

    it('should search enquiries by contact name', async () => {
      const result = await listEnquiries({ search: 'Santana' });
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Carlos Santana');
    });

    it('should search enquiries by company name', async () => {
      const result = await listEnquiries({ search: 'Metallurgy' });
      expect(result.data.length).toBe(1);
      expect(result.data[0].company).toBe('Vance Metallurgy');
    });

    it('should filter enquiries by status', async () => {
      const closedList = await listEnquiries({ status: 'Closed' });
      expect(closedList.data.some((e) => e.name === 'Daisuke Sato')).toBe(true);
      expect(closedList.data.every((e) => e.status === 'Closed')).toBe(true);
    });

    it('should filter enquiries by enquiryType', async () => {
      const esgList = await listEnquiries({ enquiryType: 'ESG' });
      expect(esgList.data.some((e) => e.name === 'Carlos Santana')).toBe(true);
      expect(esgList.data.every((e) => e.enquiryType === 'ESG')).toBe(true);
    });

    it('should support pagination correctly', async () => {
      const paged = await listEnquiries({ limit: 2, page: 1 });
      expect(paged.pagination.limit).toBe(2);
      expect(paged.pagination.page).toBe(1);
      expect(paged.data.length).toBeLessThanOrEqual(2);
      expect(paged.pagination.totalPages).toBeGreaterThanOrEqual(1);
    });

    it('should compute enquiry overview statistics', async () => {
      const stats = await getEnquiryStats();
      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.new).toBeGreaterThanOrEqual(2);
      expect(stats.closed).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(stats.byEnquiryType)).toBe(true);
    });
  });
});
