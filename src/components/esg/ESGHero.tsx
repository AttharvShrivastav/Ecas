import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultESGHeroContent } from '../../cms/esgContent';
import type { ESGHeroContent } from '../../cms/types';

export interface ESGHeroProps {
  content?: ESGHeroContent;
}

/**
 * ESGHero Component
 *
 * Reuses the approved shared PageHero component with temporary CMS fallback copy.
 * Renders the single <h1> on the ESG page.
 * Keeps the decorative artwork area clean without fake placeholder graphics.
 */
export const ESGHero: React.FC<ESGHeroProps> = ({
  content = defaultESGHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO ESG Assurance and Support Hero"
      headingLines={content.headingLines}
      description={content.description}
      heroVariant = "compact"
    />
  );
};
