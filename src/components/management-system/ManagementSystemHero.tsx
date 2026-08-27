import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultManagementSystemHeroContent } from '../../cms/managementSystemContent';
import type { ManagementSystemHeroContent } from '../../cms/types';

export interface ManagementSystemHeroProps {
  content?: ManagementSystemHeroContent;
}

/**
 * ManagementSystemHero Component
 *
 * Reuses the approved shared PageHero component with temporary CMS fallback copy.
 * Renders the single <h1> on the page.
 * Leaves the decorative area clean without fake placeholder graphics.
 */
export const ManagementSystemHero: React.FC<ManagementSystemHeroProps> = ({
  content = defaultManagementSystemHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO Management System Certification Hero"
      headingLines={content.headingLines}
      description={content.description}
      heroVariant = "compact"
      // No visualSrc provided - PageHero leaves the decorative area clean
    />
  );
};
