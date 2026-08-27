import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CMSClient, cmsClient } from '../../cms/client';
import {
  getHomePageContent,
  getAboutPageContent,
  getProductCertificationContent,
  getManagementSystemContent,
  getInspectionContent,
  getCBAMVerificationContent,
  getESGContent,
  getTrainingContent,
  getAssociationsContent,
  getContactPageContent,
  getAllNewsArticles,
  getNewsPageContent,
  getNewsArticleBySlug,
  getNewsArticlesByCategory,
  getHeroByPage,
  getAllServices,
  getServiceBySlug,
  getAllAccreditations,
  getAllAssociations,
  getFAQs,
  getContactDetails,
} from '../../cms/queries';

import { defaultHomePageContent } from '../../cms/homeContent';
import { defaultAboutPageContent } from '../../cms/aboutContent';
import { defaultProductCertificationContent } from '../../cms/productCertificationContent';
import { defaultManagementSystemPageContent } from '../../cms/managementSystemContent';
import { defaultInspectionPageContent } from '../../cms/inspectionContent';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import { defaultESGPageContent } from '../../cms/esgContent';
import { defaultTrainingPageContent } from '../../cms/trainingContent';
import { defaultAssociationsPageContent } from '../../cms/associationsContent';
import { defaultContactPageContent } from '../../cms/contactContent';
import { sampleNewsArticles } from '../../cms/newsContent';
import { getDatabase } from '../db/database';

describe('CMS Client & Query Layer Integration (Phase 2)', () => {
  beforeEach(() => {
    cmsClient.clearCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. CMSClient Network & Error Containment', () => {
    it('should return null on 404 response without throwing exceptions', async () => {
      const client = new CMSClient({ baseUrl: 'https://mock.test' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const page = await client.getPage('non-existent-page');
      expect(page).toBeNull();
    });

    it('should contain network fetch errors and return null safely', async () => {
      const client = new CMSClient({ baseUrl: 'https://mock.test' });
      global.fetch = vi.fn().mockRejectedValue(new Error('Network connection timeout'));

      const page = await client.getPage('home');
      expect(page).toBeNull();
    });

    it('should parse valid API response and return structured content', async () => {
      const client = new CMSClient({ baseUrl: 'https://mock.test' });
      const mockPayload = {
        success: true,
        data: {
          pageKey: 'about',
          content: { mockKey: 'test-value' },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      });

      const content = await client.getPage<{ mockKey: string }>('about');
      expect(content).toEqual({ mockKey: 'test-value' });
    });

    it('should deduplicate concurrent requests to the same endpoint', async () => {
      const client = new CMSClient({ baseUrl: 'https://mock.test' });
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { content: { val: 1 } } }),
      });
      global.fetch = mockFetch;

      const [res1, res2] = await Promise.all([
        client.getPage('home'),
        client.getPage('home'),
      ]);

      expect(res1).toEqual({ val: 1 });
      expect(res2).toEqual({ val: 1 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. CMS Query Fallback Determinism', () => {
    it('should return default static homepage content when API returns null or fails', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getHomePageContent();
      expect(content).toEqual(defaultHomePageContent);
      expect(content.hero.headingLines.length).toBeGreaterThan(0);
      expect(content.services.services.length).toBe(3);
    });

    it('should return default static about content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockRejectedValue(new Error('API Down'));
      const content = await getAboutPageContent();
      expect(content).toEqual(defaultAboutPageContent);
      expect(content.visionMission.items.length).toBe(2);
    });

    it('should return default static product certification content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getProductCertificationContent();
      expect(content).toEqual(defaultProductCertificationContent);
      expect(content.explorer.schemes.length).toBeGreaterThan(0);
    });

    it('should return default static management system content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getManagementSystemContent();
      expect(content).toEqual(defaultManagementSystemPageContent);
      expect(content.standardsSection.standards.length).toBeGreaterThan(0);
    });

    it('should return default static inspection content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getInspectionContent();
      expect(content).toEqual(defaultInspectionPageContent);
    });

    it('should return default static CBAM content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getCBAMVerificationContent();
      expect(content).toEqual(defaultCbamVerificationPageContent);
    });

    it('should return default static ESG content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getESGContent();
      expect(content).toEqual(defaultESGPageContent);
    });

    it('should return default static training content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getTrainingContent();
      expect(content).toEqual(defaultTrainingPageContent);
    });

    it('should return default static associations content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getAssociationsContent();
      expect(content).toEqual(defaultAssociationsPageContent);
      expect(content.partners.length).toBeGreaterThan(0);
    });

    it('should return default static contact content on API failure', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const content = await getContactPageContent();
      expect(content).toEqual(defaultContactPageContent);
      expect(content.offices.length).toBeGreaterThan(0);
    });
  });

  describe('3. News Query Layer & Filtering', () => {
    it('should return all news articles and fall back to sample articles if API is empty', async () => {
      vi.spyOn(cmsClient, 'getNews').mockResolvedValue(null);
      const articles = await getAllNewsArticles();
      expect(articles.length).toBe(sampleNewsArticles.length);
      expect(articles[0].slug).toBe(sampleNewsArticles[0].slug);
    });

    it('should return full NewsPageContent structure with articles', async () => {
      vi.spyOn(cmsClient, 'getNews').mockResolvedValue(null);
      const page = await getNewsPageContent();
      expect(page.articles.length).toBeGreaterThan(0);
      expect(page.categories.length).toBeGreaterThan(0);
    });

    it('should retrieve a news article by valid slug with fallback', async () => {
      vi.spyOn(cmsClient, 'getNewsArticle').mockResolvedValue(null);
      const targetSlug = sampleNewsArticles[0].slug;
      const article = await getNewsArticleBySlug(targetSlug);
      expect(article).not.toBeNull();
      expect(article?.slug).toBe(targetSlug);
    });

    it('should return null for non-existent slug', async () => {
      vi.spyOn(cmsClient, 'getNewsArticle').mockResolvedValue(null);
      const article = await getNewsArticleBySlug('completely-non-existent-article-slug-xyz');
      expect(article).toBeNull();
    });

    it('should filter articles by category with fallback', async () => {
      vi.spyOn(cmsClient, 'getNews').mockResolvedValue(null);
      const regulatoryArticles = await getNewsArticlesByCategory('Regulatory Updates');
      expect(regulatoryArticles.length).toBeGreaterThan(0);
      regulatoryArticles.forEach((a) => {
        expect(a.category).toBe('Regulatory Updates');
      });
    });
  });

  describe('4. Granular Component Queries', () => {
    it('should retrieve hero data for all supported pages', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const homeHero = await getHeroByPage('home');
      expect(homeHero?.title).toBeTruthy();
      expect(homeHero?.description).toBeTruthy();

      const aboutHero = await getHeroByPage('about');
      expect(aboutHero?.title).toBeTruthy();

      const unknownHero = await getHeroByPage('unknown-slug');
      expect(unknownHero).toBeNull();
    });

    it('should retrieve service list and single service by slug', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const services = await getAllServices();
      expect(services.length).toBe(3);

      const service = await getServiceBySlug('product-certification');
      expect(service).not.toBeNull();
      expect(service?.title).toBeTruthy();
    });

    it('should retrieve accreditations and associations', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const accreditations = await getAllAccreditations();
      expect(accreditations.length).toBeGreaterThan(0);

      const associations = await getAllAssociations();
      expect(associations.length).toBeGreaterThan(0);
    });

    it('should retrieve FAQs and contact details', async () => {
      vi.spyOn(cmsClient, 'getPage').mockResolvedValue(null);
      const faqs = await getFAQs();
      expect(faqs.length).toBeGreaterThan(0);

      const contact = await getContactDetails();
      expect(contact?.organizationName).toBe('ECASEURO Certification & Verification');
      expect(contact?.email).toBeTruthy();
    });
  });

  describe('5. Database Integrity & Certificates Count Verification', () => {
    it('should pass sqlite database PRAGMA integrity_check', async () => {
      const db = await getDatabase();
      const integrity = db.prepare('PRAGMA integrity_check;').get() as { integrity_check: string };
      expect(integrity.integrity_check).toBe('ok');
    });

    it('should verify all 56 certificates remain intact and uncorrupted', async () => {
      const db = await getDatabase();
      db.run("DELETE FROM certificates WHERE certificate_number LIKE 'TEST/%'");
      const count = db.prepare('SELECT COUNT(*) as count FROM certificates;').get() as { count: number };
      expect(count.count).toBe(56);
    });
  });
});
