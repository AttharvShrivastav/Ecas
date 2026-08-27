import React, { useEffect } from 'react';
import { ManagementSystemHero } from '../components/management-system/ManagementSystemHero';
import { ManagementStandardsSection } from '../components/management-system/ManagementStandardsSection';
import { FAQSection } from '../components/common/FAQSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getManagementSystemContent } from '../cms/queries';
import { defaultManagementSystemPageContent } from '../cms/managementSystemContent';
import { useCMSPage } from '../cms/useCMS';
import type { ManagementSystemPageContent } from '../cms/types';

export interface ManagementSystemPageProps {
  content?: ManagementSystemPageContent;
}

/**
 * ECASEURO Management System Certification Page (/services/management-system-certification)
 *
 * Structure:
 * 1. Shared Hero: Reused PageHero with temporary CMS fallback copy and single <h1>
 * 2. Standards Section: 3-column desktop grid matching approved layout reference with
 *    frontend search highlighting, See Detail trigger, and reusable accessible detail modal
 * 3. FAQ: Reused shared FAQ component with Management System Certification questions
 * 4. End-of-Page Coordinated Composition: ConsultingCTA -> Globe -> Footer
 */
export const ManagementSystemPage: React.FC<ManagementSystemPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getManagementSystemContent,
    defaultManagementSystemPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared Hero */}
      <ManagementSystemHero content={content.hero} />

      {/* 2. Management System Certification Standards Section with 3-Column Grid */}
      <ManagementStandardsSection content={content.standardsSection} />

      {/* 3. Commonly Asked Questions FAQ */}
      <FAQSection content={content.faq} />

      {/* 4. End-of-Page Coordinated Composition: Final CTA -> Globe -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA
          content={content.consultingCta}
          id="ms-consulting-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};
