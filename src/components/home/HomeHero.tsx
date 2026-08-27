import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultHomeHeroContent } from '../../cms/homeContent';
import type { HomeHeroContent } from '../../cms/types';

export interface HomeHeroProps {
  content?: HomeHeroContent;
}

/**
 * Approved ECASEURO Homepage Hero
 * Wraps shared PageHero with Homepage specific content & visual asset logic
 */
export const HomeHero: React.FC<HomeHeroProps> = ({
  content = defaultHomeHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO Homepage Hero"
      headingLines={content.headingLines}
      description={content.description}
      visualSrc={content.globeAsset?.src || '/images/home/hero-globe.webp'}
      visualAlt={content.globeAsset?.alt || ''}
      visualPosition="home-globe"
      visualFallbackLabel="HERO GLOBE ASSET PENDING"
    />
  );
};

