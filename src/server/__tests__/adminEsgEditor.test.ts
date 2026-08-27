import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
  getPageByKey,
  updatePageContent,
  resetPageToDefault,
} from '../services/cmsService';
import { getSqliteDatabase, queryOne } from '../db/database';
import { defaultESGPageContent } from '../../cms/esgContent';
import type { ESGPageContent } from '../../cms/types';
import { cmsClient } from '../../cms/client';

describe('Admin CMS ESG Page Editor (Phase 3A)', () => {
  beforeAll(() => {
    getSqliteDatabase();
  });

  beforeEach(async () => {
    cmsClient.clearCache();
    // Ensure clean state before each test
    await resetPageToDefault('esg', 'TEST_SETUP');
  });

  describe('1. ESG Page Model Fetching', () => {
    it('should retrieve structured ESG page content matching default schema', async () => {
      const page = await getPageByKey('esg');
      expect(page).toBeDefined();
      expect(page?.pageKey).toBe('esg');
      expect(page?.title).toBe('ESG Assurance and Support');
      expect(page?.content).toBeDefined();

      const content: ESGPageContent = page?.content;
      // 1. Hero
      expect(content.hero).toBeDefined();
      expect(content.hero.headingLines).toEqual(['ESG Assurance', 'and Support']);
      expect(content.hero.description).toContain('environmental, social and governance');

      // 2. ESG Section & Pillars
      expect(content.esgSection).toBeDefined();
      expect(content.esgSection.pillars).toBeInstanceOf(Array);
      expect(content.esgSection.pillars.length).toBe(3);
      expect(content.esgSection.pillars[0].title).toBe('ENVIRONMENTAL');
      expect(content.esgSection.pillars[0].iconKey).toBe('leaf');
      expect(content.esgSection.pillars[0].topics.length).toBeGreaterThan(0);
      expect(content.esgSection.pillars[1].title).toBe('SOCIAL');
      expect(content.esgSection.pillars[2].title).toBe('GOVERNANCE');

      // 3. FAQ
      expect(content.faq).toBeDefined();
      expect(content.faq.items.length).toBeGreaterThan(0);

      // 4. Consulting CTA
      expect(content.consultingCta).toBeDefined();
      expect(content.consultingCta.buttonLabel).toBe('VERIFY TODAY');
      expect(content.consultingCta.buttonHref).toBe('/verify-certificate');

      // 5. SEO
      expect(content.seo).toBeDefined();
      expect(content.seo.title).toContain('ESG Assurance');
    });
  });

  describe('2. Controlled ESG Page Updating (PUT /api/admin/cms/pages/esg)', () => {
    it('should update content fields, increment version, and track editor identity', async () => {
      const originalPage = await getPageByKey('esg');
      const initialVersion = originalPage?.version || 1;

      const modifiedContent: ESGPageContent = {
        ...defaultESGPageContent,
        hero: {
          headingLines: ['Leading ESG Assurance', '& Corporate Support'],
          description: 'Updated rigorous verification services for global environmental criteria.',
        },
        esgSection: {
          heading: 'Structured Sustainability Frameworks',
          description: 'Updated narrative describing ESG standards compliance.',
          pillars: [
            {
              id: 'env-updated',
              number: '01',
              title: 'ENVIRONMENTAL STEWARDSHIP',
              iconKey: 'leaf',
              order: 1,
              topics: ['Carbon Neutrality', 'Biodiversity', 'Circular Economy'],
            },
            {
              id: 'soc-updated',
              number: '02',
              title: 'SOCIAL IMPACT',
              iconKey: 'users',
              order: 2,
              topics: ['Workforce Wellbeing', 'Supply Chain Ethics'],
            },
          ],
        },
        consultingCta: {
          heading: 'Ready for ESG Verification?\nConsult Our Specialists',
          description: 'Contact our certified sustainability assurance team today.',
          buttonLabel: 'REQUEST AUDIT',
          buttonHref: '/contact',
        },
      };

      const updatedPage = await updatePageContent('esg', modifiedContent, 'admin@ecaseuro.com');

      expect(updatedPage).toBeDefined();
      expect(updatedPage.version).toBe(initialVersion + 1);
      expect(updatedPage.updatedBy).toBe('admin@ecaseuro.com');
      expect(updatedPage.content.hero.headingLines).toEqual([
        'Leading ESG Assurance',
        '& Corporate Support',
      ]);
      expect(updatedPage.content.esgSection.pillars.length).toBe(2);
      expect(updatedPage.content.esgSection.pillars[0].title).toBe('ENVIRONMENTAL STEWARDSHIP');
      expect(updatedPage.content.consultingCta.buttonLabel).toBe('REQUEST AUDIT');
      expect(updatedPage.content.consultingCta.buttonHref).toBe('/contact');

      // Verify persistence via subsequent read
      const reFetched = await getPageByKey('esg');
      expect(reFetched?.content.hero.headingLines[0]).toBe('Leading ESG Assurance');
      expect(reFetched?.version).toBe(initialVersion + 1);
    });
  });

  describe('3. Factory Reset Workflow (POST /api/admin/cms/pages/esg/reset)', () => {
    it('should revert custom edits cleanly back to system defaults', async () => {
      // 1. Apply a modification
      const customized: ESGPageContent = {
        ...defaultESGPageContent,
        hero: {
          headingLines: ['Customized ESG', 'Banner Title'],
          description: 'Custom text to test reset.',
        },
      };
      await updatePageContent('esg', customized, 'editor@ecaseuro.com');

      const modifiedCheck = await getPageByKey('esg');
      expect(modifiedCheck?.content.hero.headingLines[0]).toBe('Customized ESG');

      // 2. Perform Reset
      const resetResult = await resetPageToDefault('esg', 'admin-reset@ecaseuro.com');
      expect(resetResult.content.hero.headingLines).toEqual(['ESG Assurance', 'and Support']);
      expect(resetResult.content.esgSection.pillars.length).toBe(3);
      expect(resetResult.updatedBy).toBe('admin-reset@ecaseuro.com');

      // 3. Confirm through fresh query
      const freshRead = await getPageByKey('esg');
      expect(freshRead?.content.hero.headingLines).toEqual(['ESG Assurance', 'and Support']);
      expect(freshRead?.content.esgSection.pillars[0].title).toBe('ENVIRONMENTAL');
    });
  });

  describe('4. Data Safety & Non-Interference', () => {
    it('should ensure certificate registry and enquiries tables are completely unaffected', async () => {
      const db = getSqliteDatabase();
      // Verify certificates count is intact
      const certCountRow = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM certificates', []);
      expect(certCountRow?.count).toBeGreaterThanOrEqual(56);

      // Verify enquiries table exists and is accessible
      const enquiryCountRow = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM enquiries', []);
      expect(enquiryCountRow).toBeDefined();
      expect(typeof enquiryCountRow?.count).toBe('number');
    });
  });
});
