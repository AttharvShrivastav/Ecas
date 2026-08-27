import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
  getPageByKey,
  updatePageContent,
  resetPageToDefault,
} from '../services/cmsService';
import { getSqliteDatabase, queryOne } from '../db/database';
import { defaultHomePageContent, defaultHomeSEO } from '../../cms/homeContent';
import type { HomePageContent } from '../../cms/types';
import { cmsClient } from '../../cms/client';

describe('Admin CMS Home Page Editor (Phase 3)', () => {
  beforeAll(() => {
    getSqliteDatabase();
  });

  beforeEach(async () => {
    cmsClient.clearCache();
    // Ensure clean state before each test
    await resetPageToDefault('home', 'TEST_SETUP');
  });

  describe('1. Home Page Model Fetching', () => {
    it('should retrieve structured Home page content matching complete default schema', async () => {
      const page = await getPageByKey('home');
      expect(page).toBeDefined();
      expect(page?.pageKey).toBe('home');
      expect(page?.title).toBe('Home');
      expect(page?.content).toBeDefined();

      const content: HomePageContent = page?.content;

      // 1. Hero
      expect(content.hero).toBeDefined();
      expect(content.hero.headingLines).toEqual([
        'Certification.',
        'Inspection.',
        'Training',
        'Compliance, Assured.',
      ]);
      expect(content.hero.description).toContain('ISO Certification');
      expect(content.hero.globeAsset?.src).toBe('/images/home/hero-globe.webp');

      // 2. Services
      expect(content.services).toBeDefined();
      expect(content.services.services).toBeInstanceOf(Array);
      expect(content.services.services.length).toBe(3);
      expect(content.services.services[0].id).toBe('management-system-certification');
      expect(content.services.services[0].title).toBe('Management System Certification');
      expect(content.services.services[0].visualType).toBe('management-system');
      expect(content.services.services[0].metadata?.chips).toContain('ISO 9001');

      // 3. Certificate Shortcut
      expect(content.certificateShortcut).toBeDefined();
      expect(content.certificateShortcut.heading).toContain('Verify an ECASEURO');
      expect(content.certificateShortcut.placeholder).toBe('EXAMPLE- IND/02/678505');
      expect(content.certificateShortcut.buttonLabel).toBe('VERIFY TODAY');

      // 4. Process Steps
      expect(content.process).toBeDefined();
      expect(content.process.steps).toBeInstanceOf(Array);
      expect(content.process.steps.length).toBe(5);
      expect(content.process.steps[0].number).toBe('01');
      expect(content.process.steps[0].title).toBe('Enquiry and Scope');

      // 5. Testimonials
      expect(content.testimonials).toBeDefined();
      expect(content.testimonials.testimonials).toBeInstanceOf(Array);
      expect(content.testimonials.testimonials.length).toBe(4);
      expect(content.testimonials.testimonials[0].personName).toBe('Mr Rahul Mehta');
      expect(content.testimonials.testimonials[0].organisation).toBe('ADPICO');

      // 6. FAQ
      expect(content.faq).toBeDefined();
      expect(content.faq.items.length).toBe(6);

      // 7. Consulting CTA
      expect(content.consultingCta).toBeDefined();
      expect(content.consultingCta.buttonLabel).toBe('VERIFY TODAY');
      expect(content.consultingCta.buttonHref).toBe('/verify-certificate');

      // 8. Footer
      expect(content.footer).toBeDefined();
      expect(content.footer.brandHeading).toContain('Certification');
      expect(content.footer.privacyHref).toBe('/privacy-policy');
      expect(content.footer.termsHref).toBe('/terms-of-use');

      // 9. SEO
      expect(content.seo).toBeDefined();
      expect(content.seo?.title).toContain('ECASEURO');
    });
  });

  describe('2. Controlled Home Page Updating (PUT /api/admin/cms/pages/home)', () => {
    it('should update content fields, increment version, and track editor identity', async () => {
      const originalPage = await getPageByKey('home');
      const initialVersion = originalPage?.version || 1;

      const modifiedContent: HomePageContent = {
        ...defaultHomePageContent,
        hero: {
          headingLines: ['Global Assurance.', 'Accredited Excellence.'],
          description: 'Updated leading European certification directorate overview statement.',
          globeAsset: {
            src: '/images/custom-globe.webp',
            alt: 'Custom Globe Description',
          },
        },
        services: {
          heading: 'Core Services for Compliance',
          description: 'Updated featured services description.',
          cta: {
            label: 'VIEW ALL CAPABILITIES',
            href: '/services',
            variant: 'primary',
          },
          services: [
            {
              id: 'custom-svc-1',
              title: 'Advanced Management System Audits',
              description: 'ISO 9001 and ISO 27001 specialized technical audits.',
              href: '/services/management-system-certification',
              visualType: 'management-system',
              metadata: {
                statusText: 'Audit Ready',
                statNumber: '99',
                statUnit: '%',
                chips: ['ISO 9001', 'ISO 27001', 'ISO 14001'],
              },
            },
          ],
        },
        certificateShortcut: {
          heading: 'Verify Your Certificate Instantly',
          placeholder: 'ENTER CERT ID',
          buttonLabel: 'CHECK STATUS',
        },
        process: {
          heading: 'Our Five Stage Journey',
          description: 'Step by step roadmap from inquiry to accredited certification.',
          steps: [
            {
              number: '01',
              title: 'Initial Consultation',
              description: 'Scope and standard identification.',
            },
            {
              number: '02',
              title: 'Audit Stage 1 & 2',
              description: 'On-site and remote rigorous conformity evaluation.',
            },
          ],
        },
        testimonials: {
          heading: 'Client Endorsements',
          description: 'Read feedback from certified enterprise leaders.',
          testimonials: [
            {
              id: 'test-custom',
              quote: 'Exceptional audit rigor and swift certification issuance.',
              personName: 'Elena Rostova',
              organisation: 'Nordic Clean Energy Ltd',
            },
          ],
        },
        faq: {
          heading: 'Frequently Asked Questions',
          description: 'Clear guidance on certification requirements.',
          items: [
            {
              id: 'faq-c1',
              number: '01',
              question: 'How long does certification take?',
              answer: 'Typically between 2 to 6 weeks depending on organizational readiness.',
            },
          ],
        },
        consultingCta: {
          heading: 'Ready to Certify Your Business?',
          description: 'Speak with our technical specialists today.',
          buttonLabel: 'CONTACT EXPERTS',
          buttonHref: '/contact',
        },
        footer: {
          ...defaultHomePageContent.footer,
          brandHeading: 'ECASEURO.\nAssured.\nCompliant.',
          copyright: '2026 ECASEURO Directorate',
        },
        seo: {
          title: 'Home | ECASEURO Certified Compliance Directorate',
          description: 'Leading international accredited inspection and certification services.',
          keywords: ['ISO 9001', 'ISO 27001', 'ECASEURO'],
        },
      };

      const updatedPage = await updatePageContent('home', modifiedContent, 'LEAD_AUDITOR');

      expect(updatedPage).toBeDefined();
      expect(updatedPage?.version).toBe(initialVersion + 1);
      expect(updatedPage?.updatedBy).toBe('LEAD_AUDITOR');

      // Verify DB persistence
      const persisted = await getPageByKey('home');
      expect(persisted?.version).toBe(initialVersion + 1);
      expect(persisted?.content.hero.headingLines).toEqual([
        'Global Assurance.',
        'Accredited Excellence.',
      ]);
      expect(persisted?.content.services.services[0].title).toBe('Advanced Management System Audits');
      expect(persisted?.content.process.steps.length).toBe(2);
      expect(persisted?.content.testimonials.testimonials[0].personName).toBe('Elena Rostova');
      expect(persisted?.content.consultingCta.buttonLabel).toBe('CONTACT EXPERTS');
      expect(persisted?.content.footer.brandHeading).toBe('ECASEURO.\nAssured.\nCompliant.');
    });

    it('should preserve empty string values without silently falling back to defaults', async () => {
      const pageWithEmptySubtitle: HomePageContent = {
        ...defaultHomePageContent,
        testimonials: {
          heading: 'Client Stories',
          description: '', // intentionally empty
          testimonials: [
            {
              id: 'test-1',
              quote: 'Great service.',
              personName: 'John Doe',
              organisation: '', // intentionally empty
            },
          ],
        },
      };

      await updatePageContent('home', pageWithEmptySubtitle, 'EDITOR');
      const persisted = await getPageByKey('home');
      expect(persisted?.content.testimonials.description).toBe('');
      expect(persisted?.content.testimonials.testimonials[0].organisation).toBe('');
    });
  });

  describe('3. Factory Reset Functionality', () => {
    it('should restore home page content to default static content', async () => {
      // Modify content first
      await updatePageContent(
        'home',
        {
          ...defaultHomePageContent,
          hero: {
            headingLines: ['Temporary Line'],
            description: 'Temporary description',
          },
        },
        'MODIFIER'
      );

      // Perform reset
      const resetPage = await resetPageToDefault('home', 'RESET_ADMIN');
      expect(resetPage).toBeDefined();
      expect(resetPage.content.hero.headingLines).toEqual([
        'Certification.',
        'Inspection.',
        'Training',
        'Compliance, Assured.',
      ]);
      expect(resetPage.content.hero.description).toBe(defaultHomePageContent.hero.description);
      expect(resetPage.content.services.services.length).toBe(3);
    });
  });
});
