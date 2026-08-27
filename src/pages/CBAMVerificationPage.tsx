import React, { useEffect } from 'react';
import { CbamHero } from '../components/cbam/CbamHero';
import { CbamWhatDoesSection } from '../components/cbam/CbamWhatDoesSection';
import { CbamVerifierRoleSection } from '../components/cbam/CbamVerifierRoleSection';
import { CbamVerifierStatusSection } from '../components/cbam/CbamVerifierStatusSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getCBAMVerificationContent } from '../cms/queries';
import { defaultCbamVerificationPageContent } from '../cms/cbamVerificationContent';
import { useCMSPage } from '../cms/useCMS';
import type { CbamVerificationPageContent } from '../cms/types';

export interface CBAMVerificationPageProps {
  content?: CbamVerificationPageContent;
}

/**
 * ECASEURO CBAM Verification Service Page (/services/cbam-verification)
 *
 * Implemented strictly according to approved design:
 * 1. Shared CBAM Hero: Reuses PageHero with DM Sans display typography
 * 2. What CBAM Verification Does: 2-column layout with 4-step interactive process flow
 * 3. Role of a CBAM Verifier: 4 horizontal rows with subtle after-hover gradient emphasis
 * 4. Verifier Status: Restrained and factual editorial status panel
 * 5. Shared Consulting CTA: Approved CTA gradient banner
 * 6. Coordinated Footer: Existing globe + global footer component
 */
export const CBAMVerificationPage: React.FC<CBAMVerificationPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getCBAMVerificationContent,
    defaultCbamVerificationPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col font-sans">
      {/* 1. Shared CBAM Hero */}
      <CbamHero content={content.hero} />

      {/* 2. What CBAM Verification Does */}
      <CbamWhatDoesSection content={content.overview} />

      {/* 3. Role of a CBAM Verifier */}
      <CbamVerifierRoleSection content={content.roles} />

      {/* 4. Verifier Status */}
      <CbamVerifierStatusSection content={content.status} />

      {/* 5. Shared Consulting CTA + 6. Global Globe and Footer */}
      <div className="relative w-full overflow-hidden mt-auto pt-6 sm:pt-8 lg:pt-10">
        <ConsultingCTA
          content={content.consultingCta}
          id="cbam-consulting-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

export const CbamVerificationPage = CBAMVerificationPage;
