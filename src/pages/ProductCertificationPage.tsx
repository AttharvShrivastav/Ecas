import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/common/PageHero';
import { CertificationExplorerSection } from '../components/product-certification/CertificationExplorerSection';
import { CEProductCategoriesSection } from '../components/product-certification/CEProductCategoriesSection';
import { InternationalMarketSummarySection } from '../components/product-certification/InternationalMarketSummarySection';
import { FAQSection } from '../components/common/FAQSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getProductCertificationContent } from '../cms/queries';
import { defaultProductCertificationContent } from '../cms/productCertificationContent';
import { useCMSPage } from '../cms/useCMS';
import type { ProductCertificationPageContent } from '../cms/types';

export interface ProductCertificationPageProps {
  content?: ProductCertificationPageContent;
}

/**
 * ECASEURO Product Certification Service Page (/services/product-certification & /services/product-certification/:schemeSlug)
 *
 * Structure:
 * 1. Shared Hero: Reused PageHero with single <h1>, CMS fallback copy, no decorative asset.
 * 2. Product Certification Route Explorer:
 *    - Left: Sticky route selector column on desktop (anchored below persistent navbar)
 *    - Right: Long active scheme content with all static groups visible by default
 *    - Synchronized with crawlable route parameters (/services/product-certification/:schemeSlug)
 *    - Restrained smooth scroll back to active scheme panel header on tab switch when scrolled
 * 3. CE Marking Product Categories: 3x3 grid of compact informational category cards with Phosphor icons.
 * 4. International Market Certification Summary: 5 cards linking directly to real scheme URLs.
 * 5. Shared FAQ: Reused FAQSection with product certification questions.
 * 6. Shared Consulting CTA: Reused ConsultingCTA banner with product certification context.
 * 7. Shared Globe + Footer: Globe composition seamlessly integrated with global white footer.
 */
export const ProductCertificationPage: React.FC<ProductCertificationPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getProductCertificationContent,
    defaultProductCertificationContent,
    initialContent
  );
  const { schemeSlug } = useParams<{ schemeSlug?: string }>();
  const navigate = useNavigate();

  // Find initial scheme from URL parameter or default to 'ce-marking'
  const defaultSlug = content.explorer.schemes[0]?.slug || 'ce-marking';
  const currentSlug = schemeSlug || defaultSlug;

  const activeScheme =
    content.explorer.schemes.find(
      (s) => s.slug.toLowerCase() === currentSlug.toLowerCase() || s.id.toLowerCase() === currentSlug.toLowerCase()
    ) || content.explorer.schemes[0];

  const [activeSchemeId, setActiveSchemeId] = useState<string>(activeScheme?.slug || 'ce-marking');

  // Sync state if URL changes (e.g. browser back/forward or direct link)
  useEffect(() => {
    if (activeScheme && activeScheme.slug !== activeSchemeId) {
      setActiveSchemeId(activeScheme.slug);
    }
  }, [schemeSlug, activeScheme?.slug]);

  // Update dynamic SEO Metadata and Self-referencing Canonical for active scheme
  useEffect(() => {
    const seoData = activeScheme?.seo || content.seo;
    document.title = seoData.title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (seoData.description) {
      metaDescription.setAttribute('content', seoData.description);
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const canonicalHref =
      seoData.canonicalUrl ||
      `https://ecaseuro.com/services/product-certification${schemeSlug ? `/${schemeSlug}` : ''}`;
    canonical.setAttribute('href', canonicalHref);
  }, [activeScheme, content.seo, schemeSlug]);

  // Handle scheme selection: update URL via router without full page reload
  const handleSelectScheme = (newSlug: string) => {
    setActiveSchemeId(newSlug);
    navigate(`/services/product-certification/${newSlug}`);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared Hero */}
      <PageHero
        headingLines={content.hero.headingLines}
        description={content.hero.description}
        ariaLabel="Product Certification Hero"
        heroVariant = "compact"
      />

      {/* 2. Primary Section — Certification Route Explorer with Sticky Left Navigation */}
      <CertificationExplorerSection
        content={content.explorer}
        activeSchemeId={activeSchemeId}
        onActiveSchemeChange={handleSelectScheme}
      />

      {/* 3. CE Marking Product Categories (3x3 Grid) */}
      <CEProductCategoriesSection content={content.categories} />

      {/* 4. International Market Certification Summary (linking to real scheme URLs) */}
      <InternationalMarketSummarySection
        content={content.internationalMarkets}
        onSelectScheme={handleSelectScheme}
      />

      {/* 5. Shared FAQ */}
      <FAQSection content={content.faq} />

      {/* 6 & 7. End-of-Page Coordinated Composition: Final CTA -> Globe -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA
          content={content.consultingCta}
          id="product-certification-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};
