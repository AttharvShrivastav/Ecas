import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import type { CbamHeroContent } from '../../cms/types';

export interface CbamHeroProps {
  content?: CbamHeroContent;
}

/**
 * CbamHero Component
 *
 * Reuses the approved shared ECASEURO PageHero component.
 * Displays:
 * - H1: Staggered display lines ("CBAM Verification." / "Emissions data, independently assured.")
 * - Description: Authoritative supporting copy
 * - Clean visual area without random decorations
 */
export const CbamHero: React.FC<CbamHeroProps> = ({
  content = defaultCbamVerificationPageContent.hero,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO CBAM Verification Service Hero"
      headingLines={content.headingLines}
      description={content.description}
      heroVariant = "compact"
    />
  );
};
