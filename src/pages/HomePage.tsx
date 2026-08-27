import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { HomeServicesSection } from '../components/home/HomeServicesSection';
import { CertificateVerificationCTA } from '../components/home/CertificateVerificationCTA';
import { HomeCertificationProcessSection } from '../components/home/HomeCertificationProcessSection';
import { HomeTestimonialsSection } from '../components/home/HomeTestimonialsSection';
import { HomeFAQSection } from '../components/home/HomeFAQSection';
import { HomeConsultingCTA } from '../components/home/HomeConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getHomePageContent } from '../cms/queries';
import { defaultHomePageContent } from '../cms/homeContent';
import { useCMSPage } from '../cms/useCMS';
import type { HomePageContent } from '../cms/types';

export interface HomePageProps {
  content?: HomePageContent;
}

/**
 * ECASEURO Production Homepage
 *
 * Connected to controlled CMS Query layer with instant fallback to approved Figma static data.
 */
export const HomePage: React.FC<HomePageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(getHomePageContent, defaultHomePageContent, initialContent);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      <HomeHero content={content.hero} />
      <HomeServicesSection content={content.services} />
      <CertificateVerificationCTA content={content.certificateShortcut} />
      <HomeCertificationProcessSection content={content.process} />
      <HomeTestimonialsSection content={content.testimonials} />
      <HomeFAQSection content={content.faq} />
      {/* End-of-Page Coordinated Composition: Final CTA -> Globe Background -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <HomeConsultingCTA content={content.consultingCta} />
        <Footer content={content.footer} withGlobe={true} />
      </div>
    </main>
  );
};


