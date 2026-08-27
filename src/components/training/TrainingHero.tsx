import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultTrainingHeroContent } from '../../cms/trainingContent';
import type { TrainingHeroContent } from '../../cms/types';

export interface TrainingHeroProps {
  content?: TrainingHeroContent;
}

/**
 * TrainingHero Component
 *
 * Reuses the approved shared PageHero component.
 * Supports a clean state with no decorative visual (visualSrc omitted),
 * leaving the visual region clean without fake placeholders or warnings.
 */
export const TrainingHero: React.FC<TrainingHeroProps> = ({
  content = defaultTrainingHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO Training Services Hero"
      headingLines={content.headingLines}
      description={content.description}
      heroVariant = "compact"
      // No visualSrc provided - PageHero leaves the decorative area clean
    />
  );
};
