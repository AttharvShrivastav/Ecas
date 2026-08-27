import React, { useEffect } from 'react';
import { InspectionHero } from '../components/inspection/InspectionHero';
import { ThirdPartyInspectionsSection } from '../components/inspection/ThirdPartyInspectionsSection';
import { InspectionCapabilitiesSection } from '../components/inspection/InspectionCapabilitiesSection';
import { EquipmentCoverageSection } from '../components/inspection/EquipmentCoverageSection';
import { MillInspectionSection } from '../components/inspection/MillInspectionSection';
import { LiftingEquipmentSection } from '../components/inspection/LiftingEquipmentSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getInspectionContent } from '../cms/queries';
import { defaultInspectionPageContent } from '../cms/inspectionContent';
import { useCMSPage } from '../cms/useCMS';
import type { InspectionPageContent } from '../cms/types';

export interface InspectionPageProps {
  content?: InspectionPageContent;
}

/**
 * ECASEURO Inspection Services Page (/services/inspection)
 *
 * Rebuilt strictly to the approved design specification:
 * 1. Shared Service Hero: Reuses PageHero with top Navbar, display H1, and supporting description.
 * 2. Approved Third Party Inspections Section: Top heading row + Left industrial image with
 *    assurance overlay card + Right 4 vertically stacked inspection stages with blue gradient active state.
 * 3. Approved Inspection & Surveillance Capabilities: Unified horizontal rounded strip with 3 capability columns.
 * 4. Approved Coverage Across Critical Industrial Equipment: Two-column layout with 12 equipment category cards.
 * 5. Global Footer: Seamless globe integration and global footer component.
 */
export const InspectionPage: React.FC<InspectionPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getInspectionContent,
    defaultInspectionPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col font-sans">
      {/* 1. Shared Service Hero */}
      <InspectionHero content={content.hero} />

      {/* 2. Approved Third Party Inspections Section */}
      <ThirdPartyInspectionsSection content={content.thirdParty} />

      {/* 3. Approved Inspection & Surveillance Capabilities Strip */}
      <InspectionCapabilitiesSection content={content.capabilities} />

      {/* 4. Approved Coverage Across Critical Industrial Equipment */}
      <EquipmentCoverageSection content={content.equipmentCoverage} />

      {/* 5. Approved Mill Inspection & Surveillance */}
      <MillInspectionSection content={content.millInspection} />

      {/* 6. Approved Lifting Equipment Inspection */}
      <LiftingEquipmentSection content={content.liftingEquipment} />

      {/* 7. End-of-Page Coordinated Composition: Shared Consulting CTA -> Globe -> Global Footer */}
      <div className="relative w-full overflow-hidden mt-auto">
        <ConsultingCTA
          content={content.consultingCta}
          id="inspection-consulting-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};
