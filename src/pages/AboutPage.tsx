import React, { useEffect } from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutVisionMissionSection } from '../components/about/AboutVisionMissionSection';
import { AboutConfidenceSection } from '../components/about/AboutConfidenceSection';
import { AboutCertificationConfidenceSection } from '../components/about/AboutCertificationConfidenceSection';
import { AboutGlobalExpertiseSection } from '../components/about/AboutGlobalExpertiseSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getAboutPageContent } from '../cms/queries';
import { defaultAboutPageContent } from '../cms/aboutContent';
import { useCMSPage } from '../cms/useCMS';
import type { AboutPageContent } from '../cms/types';

export interface AboutPageProps {
  content?: AboutPageContent;
}

/**
 * ECASEURO Production About Us Page
 */
export const AboutPage: React.FC<AboutPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(getAboutPageContent, defaultAboutPageContent, initialContent);

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      <AboutHero content={content.hero} />
      <AboutVisionMissionSection content={content.visionMission} />
      <AboutConfidenceSection content={content.confidence} />
      <AboutCertificationConfidenceSection
        content={content.certificationConfidence}
      />
      <AboutGlobalExpertiseSection content={content.globalExpertise} />
      {/* End-of-Page Coordinated Composition: Final CTA -> Globe Background -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA content={content.consultingCta} id="about-consulting-cta" />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

