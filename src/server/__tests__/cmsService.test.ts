import { describe, it, expect, beforeAll } from 'vitest';
import {
  getPageByKey,
  listAllPages,
  updatePageContent,
  resetPageToDefault,
  listPublicNewsArticles,
  getPublicNewsArticleBySlug,
  listAdminNewsArticles,
  getAdminNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from '../services/cmsService';
import { getSqliteDatabase } from '../db/database';

describe('CMS Backend Service & Persistence Foundation', () => {
  beforeAll(() => {
    // Ensure database and schema are initialized
    getSqliteDatabase();
  });

  describe('1. CMS Page Management & Singleton Content Persistence', () => {
    it('should seed and list all 10 predefined CMS pages', async () => {
      const pages = await listAllPages();
      expect(pages).toBeDefined();
      expect(pages.length).toBeGreaterThanOrEqual(10);

      const pageKeys = pages.map((p) => p.pageKey);
      const expectedKeys = [
        'home',
        'about',
        'product-certification',
        'management-system',
        'inspection',
        'cbam-verification',
        'esg',
        'training',
        'associations',
        'contact',
      ];

      for (const expected of expectedKeys) {
        expect(pageKeys).toContain(expected);
      }
    });

    it('should retrieve structured page content for "home"', async () => {
      const homePage = await getPageByKey('home');
      expect(homePage).toBeDefined();
      expect(homePage?.pageKey).toBe('home');
      expect(homePage?.content).toBeDefined();
      expect(homePage?.content.hero).toBeDefined();
      expect(homePage?.content.services).toBeDefined();
      expect(homePage?.content.process).toBeDefined();
      expect(homePage?.content.faq).toBeDefined();
    });

    it('should retrieve structured page content for "cbam-verification"', async () => {
      const cbamPage = await getPageByKey('cbam-verification');
      expect(cbamPage).toBeDefined();
      expect(cbamPage?.pageKey).toBe('cbam-verification');
      expect(cbamPage?.content.hero).toBeDefined();
      expect(cbamPage?.content.overview).toBeDefined();
    });

    it('should return null for non-existent page key', async () => {
      const nonExistent = await getPageByKey('non-existent-page-xyz');
      expect(nonExistent).toBeNull();
    });

    it('should update page content, bump version, and persist changes', async () => {
      const initial = await getPageByKey('about');
      expect(initial).toBeDefined();
      const originalVersion = initial!.version;

      const modifiedContent = {
        ...initial!.content,
        hero: {
          ...initial!.content.hero,
          headingLines: ['Tested Assurance', 'Made Clear'],
        },
      };

      const updated = await updatePageContent('about', modifiedContent, 'TEST_ADMIN');
      expect(updated.version).toBe(originalVersion + 1);
      expect(updated.updatedBy).toBe('TEST_ADMIN');
      expect(updated.content.hero.headingLines).toEqual(['Tested Assurance', 'Made Clear']);

      // Verify read-back
      const fetched = await getPageByKey('about');
      expect(fetched?.content.hero.headingLines).toEqual(['Tested Assurance', 'Made Clear']);
    });

    it('should reset page content back to original default', async () => {
      const reset = await resetPageToDefault('about', 'TEST_RESET');
      expect(reset).toBeDefined();
      expect(reset.updatedBy).toBe('TEST_RESET');
      expect(reset.content.hero.headingLines).toEqual(['Independent', 'Assurance,', 'Made Clear']);
    });

    it('should reject updating non-existent page', async () => {
      await expect(
        updatePageContent('ghost-page', { title: 'Ghost' }, 'TEST')
      ).rejects.toThrow('Page not found');
    });
  });

  describe('2. Public News Articles Service', () => {
    it('should list only published news articles for public queries', async () => {
      const result = await listPublicNewsArticles();
      expect(result).toBeDefined();
      expect(result.articles.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);

      // Verify all returned articles have status 'published'
      for (const art of result.articles) {
        expect(art.status).toBe('published');
        expect(art.title).toBeDefined();
        expect(art.slug).toBeDefined();
        expect(Array.isArray(art.content)).toBe(true);
      }
    });

    it('should filter public articles by category', async () => {
      const cbamArticles = await listPublicNewsArticles({ category: 'CBAM & ESG' });
      expect(cbamArticles.articles.length).toBeGreaterThan(0);
      for (const art of cbamArticles.articles) {
        expect(art.category).toBe('CBAM & ESG');
      }
    });

    it('should search public articles by keyword', async () => {
      const searchResult = await listPublicNewsArticles({ search: 'CBAM' });
      expect(searchResult.articles.length).toBeGreaterThan(0);
    });

    it('should retrieve a published article by slug', async () => {
      const article = await getPublicNewsArticleBySlug('eu-cbam-definitive-regime-preparation');
      expect(article).toBeDefined();
      expect(article?.slug).toBe('eu-cbam-definitive-regime-preparation');
      expect(article?.title).toContain('EU CBAM Definitive Regime');
      expect(article?.status).toBe('published');
    });

    it('should return null for non-existent public article slug', async () => {
      const article = await getPublicNewsArticleBySlug('non-existent-article-slug-999');
      expect(article).toBeNull();
    });
  });

  describe('3. Admin News Articles CRUD & Publishing Control', () => {
    let createdArticleId: number;
    const testSlug = 'test-audit-standards-2026';

    it('should create a new draft news article with validated fields', async () => {
      const newArticle = await createNewsArticle({
        slug: testSlug,
        title: 'New Audit Standards for High-Risk Machinery in 2026',
        category: 'Regulatory Updates',
        publishedAt: '2026-03-01',
        excerpt: 'An authoritative overview of upcoming requirements for EU Notified Body conformity assessments.',
        readTime: '4 min read',
        featured: false,
        author: {
          name: 'Technical Directorate',
          role: 'Compliance Director',
          organization: 'ECASEURO',
        },
        tags: ['Machinery', 'Auditing', 'CE Marking'],
        content: [
          {
            type: 'paragraph',
            text: 'European safety harmonisation introduces mandatory third-party verification for autonomous controls.',
          },
        ],
        seo: {
          title: 'New Audit Standards for High-Risk Machinery | ECASEURO',
          description: 'Comprehensive guidance on 2026 European conformity assessment rules.',
        },
        status: 'draft',
      });

      expect(newArticle).toBeDefined();
      expect(newArticle.id).toBeGreaterThan(0);
      expect(newArticle.slug).toBe(testSlug);
      expect(newArticle.status).toBe('draft');
      expect(newArticle.author?.name).toBe('Technical Directorate');
      expect(newArticle.tags).toContain('Machinery');

      createdArticleId = newArticle.id;
    });

    it('should prevent creating an article with a duplicate slug', async () => {
      await expect(
        createNewsArticle({
          slug: testSlug,
          title: 'Duplicate Slug Article',
          category: 'Company News',
          excerpt: 'Duplicate test.',
          content: [],
        })
      ).rejects.toThrow('already exists');
    });

    it('draft article should NOT be visible via public API', async () => {
      const publicArt = await getPublicNewsArticleBySlug(testSlug);
      expect(publicArt).toBeNull();

      const publicList = await listPublicNewsArticles({ search: 'High-Risk Machinery' });
      const foundInPublic = publicList.articles.some((a) => a.id === createdArticleId);
      expect(foundInPublic).toBe(false);
    });

    it('draft article SHOULD be visible via Admin API', async () => {
      const adminArt = await getAdminNewsArticleById(createdArticleId);
      expect(adminArt).toBeDefined();
      expect(adminArt?.status).toBe('draft');

      const adminList = await listAdminNewsArticles({ status: 'draft' });
      const foundInAdmin = adminList.articles.some((a) => a.id === createdArticleId);
      expect(foundInAdmin).toBe(true);
    });

    it('should update article fields and publish the article', async () => {
      const updated = await updateNewsArticle(createdArticleId, {
        title: 'Updated Audit Standards for High-Risk Machinery in 2026',
        status: 'published',
        featured: true,
      });

      expect(updated.title).toBe('Updated Audit Standards for High-Risk Machinery in 2026');
      expect(updated.status).toBe('published');
      expect(updated.featured).toBe(true);

      // Now it should be visible publicly
      const publicArt = await getPublicNewsArticleBySlug(testSlug);
      expect(publicArt).toBeDefined();
      expect(publicArt?.title).toBe('Updated Audit Standards for High-Risk Machinery in 2026');
    });

    it('should delete an article and verify removal', async () => {
      const deleted = await deleteNewsArticle(createdArticleId);
      expect(deleted).toBe(true);

      const check = await getAdminNewsArticleById(createdArticleId);
      expect(check).toBeNull();
    });
  });
});
