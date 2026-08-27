import React from 'react';
import { PageHero } from '../common/PageHero';
import { defaultAboutHeroContent } from '../../cms/aboutContent';
import type { AboutHeroContent } from '../../cms/types';

export interface AboutHeroProps {
  content?: AboutHeroContent;
}

/**
 * Approved ECASEURO About Page Hero
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshots
 * - Inset rounded Blue Hero composition with inset Navbar
 * - Left-aligned 3-line heading: "Independent Assurance, Made Clear"
 * - Supporting secondary copy
 * - Upper/Right dotted world map asset (/images/about/about-hero-map.svg)
 * - Restrained GSAP entrance motion
 */
export const AboutHero: React.FC<AboutHeroProps> = ({
  content = defaultAboutHeroContent,
}) => {
  return (
    <PageHero
      ariaLabel="ECASEURO About Us Hero"
      headingLines={content.headingLines}
      description={content.description}
      visualSrc={content.visualAsset?.src || '/images/about/about-hero-map.svg'}
      visualAlt={content.visualAsset?.alt || ''}
      visualPosition="about-map"
      visualFallbackLabel="HERO MAP ASSET PENDING"
    />
  );
};
