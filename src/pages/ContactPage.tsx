import React, { useEffect } from 'react';
import { PageHero } from '../components/common/PageHero';
import { ContactSection } from '../components/contact/ContactSection';
import { Footer } from '../components/common/Footer';
import { getContactPageContent } from '../cms/queries';
import { defaultContactPageContent } from '../cms/contactContent';
import { useCMSPage } from '../cms/useCMS';
import type { ContactPageContent } from '../cms/types';

export interface ContactPageProps {
  content?: ContactPageContent;
}

/**
 * ECASEURO Contact Page (/contact)
 *
 * Structure:
 * 1. Shared Hero: Reused PageHero with single <h1>, temporary CMS fallback copy, and no decorative asset.
 * 2. Main Contact Section: Asymmetric 2-column layout (Editorial Offices List | Dominant Enquiry Form).
 * 3. Global Footer: Reused shared Footer with withGlobe={false} (no globe composition).
 */
export const ContactPage: React.FC<ContactPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getContactPageContent,
    defaultContactPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && content.seo.description) {
      metaDescription.setAttribute('content', content.seo.description);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared Hero */}
      <PageHero
        headingLines={content.hero.headingLines}
        description={content.hero.description}
        ariaLabel="Contact Hero"
      />

      {/* 2. Main Asymmetric Contact Section */}
      <ContactSection
        intro={content.intro}
        offices={content.offices}
        form={content.form}
      />

      {/* 3. Global Footer (strictly without Globe) */}
      <div className="relative w-full overflow-hidden mt-auto">
        <Footer withGlobe={false} />
      </div>
    </main>
  );
};
