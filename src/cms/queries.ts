/**
 * CMS Query Functions
 *
 * Provides a resilient, strongly-typed query layer connecting public React
 * components to the controlled CMS API (/api/cms/*) with deterministic fallback
 * to approved static content in src/cms/*Content.ts.
 */

import type {
  HomePageContent,
  AboutPageContent,
  ProductCertificationPageContent,
  ManagementSystemPageContent,
  InspectionPageContent,
  CbamVerificationPageContent,
  ESGPageContent,
  TrainingPageContent,
  AssociationsPageContent,
  ContactPageContent,
  NewsPageContent,
  NewsArticle,
  NewsCategory,
  PageHeroContent,
  Service,
  Accreditation,
  Association,
  FAQItem,
  ContactDetails,
  SiteSettingsContent,
} from './types';

import { defaultHomePageContent } from './homeContent';
import { defaultAboutPageContent } from './aboutContent';
import { defaultProductCertificationContent } from './productCertificationContent';
import { defaultManagementSystemPageContent } from './managementSystemContent';
import { defaultInspectionPageContent } from './inspectionContent';
import { defaultCbamVerificationPageContent } from './cbamVerificationContent';
import { defaultESGPageContent } from './esgContent';
import { defaultTrainingPageContent } from './trainingContent';
import { defaultAssociationsPageContent, defaultAssociationPartners } from './associationsContent';
import { defaultContactPageContent } from './contactContent';
import { defaultSiteSettingsContent } from './siteSettingsContent';
import { defaultNewsPageContent, sampleNewsArticles } from './newsContent';
import { cmsClient } from './client';

// ---------------------------------------------------------------------------
// Page Content Queries
// ---------------------------------------------------------------------------

/**
 * Retrieve homepage content from CMS with static fallback
 */
export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const data = await cmsClient.getPage<HomePageContent>('home');
    if (data && typeof data === 'object' && data.hero && data.services) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getHomePageContent fallback activated:', err);
  }
  return defaultHomePageContent;
}

/**
 * Retrieve about page content from CMS with static fallback
 */
export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const data = await cmsClient.getPage<AboutPageContent>('about');
    if (data && typeof data === 'object' && data.hero && data.visionMission) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getAboutPageContent fallback activated:', err);
  }
  return defaultAboutPageContent;
}

/**
 * Retrieve product certification page content from CMS with static fallback
 */
export async function getProductCertificationContent(): Promise<ProductCertificationPageContent> {
  try {
    const data = await cmsClient.getPage<ProductCertificationPageContent>('product-certification');
    if (data && typeof data === 'object' && data.hero && data.explorer) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getProductCertificationContent fallback activated:', err);
  }
  return defaultProductCertificationContent;
}

/**
 * Retrieve management system certification page content from CMS with static fallback
 */
export async function getManagementSystemContent(): Promise<ManagementSystemPageContent> {
  try {
    const data = await cmsClient.getPage<ManagementSystemPageContent>('management-system');
    if (data && typeof data === 'object' && data.hero && data.standardsSection) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getManagementSystemContent fallback activated:', err);
  }
  return defaultManagementSystemPageContent;
}

/**
 * Retrieve inspection page content from CMS with static fallback
 */
export async function getInspectionContent(): Promise<InspectionPageContent> {
  try {
    const data = await cmsClient.getPage<InspectionPageContent>('inspection');
    if (data && typeof data === 'object' && data.hero && data.thirdParty) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getInspectionContent fallback activated:', err);
  }
  return defaultInspectionPageContent;
}

/**
 * Retrieve CBAM verification page content from CMS with static fallback
 */
export async function getCBAMVerificationContent(): Promise<CbamVerificationPageContent> {
  try {
    const data = await cmsClient.getPage<CbamVerificationPageContent>('cbam-verification');
    if (data && typeof data === 'object' && data.hero && data.overview) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getCBAMVerificationContent fallback activated:', err);
  }
  return defaultCbamVerificationPageContent;
}

/**
 * Retrieve ESG page content from CMS with static fallback
 */
export async function getESGContent(): Promise<ESGPageContent> {
  try {
    const data = await cmsClient.getPage<ESGPageContent>('esg');
    if (data && typeof data === 'object' && data.hero && data.esgSection) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getESGContent fallback activated:', err);
  }
  return defaultESGPageContent;
}

/**
 * Retrieve training page content from CMS with static fallback
 */
export async function getTrainingContent(): Promise<TrainingPageContent> {
  try {
    const data = await cmsClient.getPage<TrainingPageContent>('training');
    if (data && typeof data === 'object' && data.hero && data.courses) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getTrainingContent fallback activated:', err);
  }
  return defaultTrainingPageContent;
}

/**
 * Retrieve associations page content from CMS with static fallback
 */
export async function getAssociationsContent(): Promise<AssociationsPageContent> {
  try {
    const data = await cmsClient.getPage<AssociationsPageContent>('associations');
    if (data && typeof data === 'object' && data.hero && Array.isArray(data.partners)) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getAssociationsContent fallback activated:', err);
  }
  return defaultAssociationsPageContent;
}

/**
 * Retrieve site settings and global contact information with static fallback
 */
export async function getSiteSettings(): Promise<SiteSettingsContent> {
  try {
    const data = await cmsClient.getPage<SiteSettingsContent>('settings');
    if (data && typeof data === 'object' && data.company && Array.isArray(data.offices)) {
      return data;
    }
  } catch (err) {
    console.warn('[CMS Query] getSiteSettings fallback activated:', err);
  }
  return defaultSiteSettingsContent;
}

/**
 * Retrieve contact page content from CMS with static fallback and site-settings synchronization
 */
export async function getContactPageContent(): Promise<ContactPageContent> {
  let baseContact = defaultContactPageContent;
  try {
    const data = await cmsClient.getPage<ContactPageContent>('contact');
    if (data && typeof data === 'object' && data.hero) {
      baseContact = data;
    }
  } catch (err) {
    console.warn('[CMS Query] getContactPageContent fallback activated:', err);
  }

  // Synchronize offices from Site Settings (Single source of truth for contact details)
  try {
    const settings = await getSiteSettings();
    if (settings && Array.isArray(settings.offices) && settings.offices.length > 0) {
      return {
        ...baseContact,
        offices: settings.offices,
      };
    }
  } catch (err) {
    console.warn('[CMS Query] getContactPageContent site-settings sync fallback:', err);
  }

  return baseContact;
}

// ---------------------------------------------------------------------------
// News & Insights Queries
// ---------------------------------------------------------------------------

/**
 * Retrieve all published news articles for public listing
 */
export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  try {
    const articles = await cmsClient.getNews();
    if (articles && Array.isArray(articles) && articles.length > 0) {
      return articles;
    }
  } catch (err) {
    console.warn('[CMS Query] getAllNewsArticles fallback activated:', err);
  }
  return sampleNewsArticles;
}

/**
 * Retrieve complete news page content including articles feed
 */
export async function getNewsPageContent(): Promise<NewsPageContent> {
  const articles = await getAllNewsArticles();
  return {
    ...defaultNewsPageContent,
    articles: articles.length > 0 ? articles : sampleNewsArticles,
  };
}

/**
 * Retrieve a single published news article by slug
 */
export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;
  try {
    const article = await cmsClient.getNewsArticle(slug);
    if (article && article.slug) {
      return article;
    }
  } catch (err) {
    console.warn(`[CMS Query] getNewsArticleBySlug("${slug}") fallback activated:`, err);
  }
  return sampleNewsArticles.find((a) => a.slug === slug) || null;
}

/**
 * Retrieve published news articles filtered by category
 */
export async function getNewsArticlesByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  if (category === 'All') {
    return getAllNewsArticles();
  }
  try {
    const articles = await cmsClient.getNews({ category });
    if (articles && Array.isArray(articles) && articles.length > 0) {
      return articles;
    }
  } catch (err) {
    console.warn(`[CMS Query] getNewsArticlesByCategory("${category}") fallback activated:`, err);
  }
  return sampleNewsArticles.filter((a) => a.category === category);
}

// ---------------------------------------------------------------------------
// Granular / Micro Component Queries
// ---------------------------------------------------------------------------

/**
 * Retrieve hero content for a specific page slug
 */
export async function getHeroByPage(pageSlug: string): Promise<PageHeroContent | null> {
  switch (pageSlug) {
    case 'home': {
      const page = await getHomePageContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'about': {
      const page = await getAboutPageContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'product-certification': {
      const page = await getProductCertificationContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'management-system': {
      const page = await getManagementSystemContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'inspection': {
      const page = await getInspectionContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'cbam-verification': {
      const page = await getCBAMVerificationContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'esg': {
      const page = await getESGContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'training': {
      const page = await getTrainingContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'associations': {
      const page = await getAssociationsContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    case 'contact': {
      const page = await getContactPageContent();
      return {
        title: page.hero.headingLines.join(' '),
        description: page.hero.description,
      };
    }
    default:
      return null;
  }
}

/**
 * Retrieve all featured services
 */
export async function getAllServices(): Promise<Service[]> {
  const home = await getHomePageContent();
  return home.services.services.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.href.replace('/services/', ''),
    shortDescription: s.description,
  }));
}

/**
 * Retrieve service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getAllServices();
  return services.find((s) => s.slug === slug || s.id === slug) || null;
}

/**
 * Retrieve accreditations list
 */
export async function getAllAccreditations(): Promise<Accreditation[]> {
  const about = await getAboutPageContent();
  return [
    {
      id: 'acc-1',
      name: 'eCAS Euro International Accreditation Directorate',
      scope: 'Management Systems, Product Certification, ESG and Verification',
    },
  ];
}

/**
 * Retrieve association partners
 */
export async function getAllAssociations(): Promise<Association[]> {
  const page = await getAssociationsContent();
  return page.partners.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.shortDescription,
    websiteUrl: p.websiteUrl,
  }));
}

/**
 * Retrieve FAQs with optional category filter
 */
export async function getFAQs(category?: string): Promise<FAQItem[]> {
  const home = await getHomePageContent();
  if (category) {
    return home.faq.items.filter((item) => item.category === category);
  }
  return home.faq.items;
}

/**
 * Retrieve contact details from Site Settings
 */
export async function getContactDetails(): Promise<ContactDetails | null> {
  try {
    const settings = await getSiteSettings();
    if (settings && settings.company) {
      return {
        organizationName: settings.company.organizationName || 'ECASEURO Certification & Verification',
        email: settings.company.email || 'info@ecaseuro.com',
        phone: settings.company.phone || '+32 2 808 12 34',
        address: settings.company.address
          ? {
              streetAddress: settings.company.address.street || '',
              city: settings.company.address.city || '',
              postalCode: settings.company.address.postalCode || '',
              country: settings.company.address.country || '',
            }
          : undefined,
        officeHours: settings.company.businessHours,
        emergencyContact: settings.company.emergencyContact,
      };
    }
  } catch (err) {
    console.warn('[CMS Query] getContactDetails fallback activated:', err);
  }
  return {
    organizationName: 'ECASEURO Certification & Verification',
    email: 'info@ecaseuro.com',
    phone: '+32 2 808 12 34',
  };
}

// ---------------------------------------------------------------------------
// Unified CMS Queries Object Export
// ---------------------------------------------------------------------------
export const cmsQueries = {
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
  getSiteSettings,
  getNewsPageContent,
  getAllNewsArticles,
  getNewsArticleBySlug,
  getNewsArticlesByCategory,
  getHeroByPage,
  getAllServices,
  getServiceBySlug,
  getAllAccreditations,
  getAllAssociations,
  getFAQs,
  getContactDetails,
};
