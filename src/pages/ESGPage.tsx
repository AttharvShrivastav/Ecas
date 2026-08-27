import React, { useEffect } from 'react';
import { ESGHero } from '../components/esg/ESGHero';
import { ESGPillarsSection } from '../components/esg/ESGPillarsSection';
import { FAQSection } from '../components/common/FAQSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getESGContent } from '../cms/queries';
import { defaultESGPageContent } from '../cms/esgContent';
import { useCMSPage } from '../cms/useCMS';
import type { ESGPageContent } from '../cms/types';

export interface ESGPageProps {
  content?: ESGPageContent;
}

/**
 * ECASEURO ESG Service Page (/services/esg)
 *
 * Structure:
 * 1. Shared Hero: Reused PageHero with temporary CMS fallback copy and single <h1>
 * 2. ESG Overview & Pillars Section: Top row (heading + paragraph) and bottom row (3 equal-width cards)
 * 3. FAQ: Reused shared FAQ component with ESG-specific questions
 * 4. End-of-Page Coordinated Composition: ConsultingCTA -> Globe -> White Footer Card
 */
export const ESGPage: React.FC<ESGPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getESGContent,
    defaultESGPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared Hero */}
      <ESGHero content={content.hero} />

      {/* 2. ESG Main Pillars Section */}
      <ESGPillarsSection content={content.esgSection} />

      {/* 3. Commonly Asked Questions FAQ */}
      <FAQSection content={content.faq} />

      {/* 4. End-of-Page Coordinated Composition: Final CTA -> Globe -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA
          content={content.consultingCta}
          id="esg-consulting-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};
