import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultInspectionHeroContent } from '../../cms/inspectionContent';
import type { InspectionHeroContent } from '../../cms/types';

export interface InspectionHeroProps {
  content?: InspectionHeroContent;
}

/**
 * InspectionHero Component
 *
 * Reuses the approved shared PageHero component.
 * Displays:
 * - Eyebrow: "INSPECTION SERVICES"
 * - H1: Staggered display lines ("Independent inspection." / "Confidence at every stage.")
 * - Description: Authoritative supporting copy
 * - Clean visual area without decorative artwork
 */
export const InspectionHero: React.FC<InspectionHeroProps> = ({
  content = defaultInspectionHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO Inspection Services Hero"
      headingLines={content.headingLines}
      description={content.description}
      heroVariant = "compact"
    />
  );
};
