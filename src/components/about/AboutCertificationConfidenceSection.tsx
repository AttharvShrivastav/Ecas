import React, { useEffect, useRef, useState } from 'react';
import {
  Buildings,
  Certificate,
  Barricade,
  Scales,
  PersonArmsSpread,
  GlobeHemisphereWest,
  GraduationCap,
  ShieldCheck,
} from '@phosphor-icons/react';
import { getPhosphorIconByKey } from '../admin/cms/CMSIconSelect';
import { defaultAboutCertificationConfidenceContent } from '../../cms/aboutContent';
import type {
  AboutCertificationConfidenceContent,
  AboutCertificationFeatureItem,
} from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface AboutCertificationConfidenceSectionProps {
  content?: AboutCertificationConfidenceContent;
}

const getFeatureIcon = (icon: AboutCertificationFeatureItem['icon'] | string, id?: string) => {
  if (id === 'accredited-certification') return Buildings;
  if (id === 'impartial-objective') return Barricade;
  if (id === 'beyond-certification') return PersonArmsSpread;

  switch (icon) {
    case 'certificate':
      return Buildings;
    case 'scales':
      return Barricade;
    case 'globe':
      return PersonArmsSpread;
    case 'graduation-cap':
      return GraduationCap;
    case 'shield':
      return ShieldCheck;
    default:
      return getPhosphorIconByKey(icon);
  }
};

/**
 * Compact Interactive Feature Item
 * - Default: Transparent lightweight column with icon badge + title side by side, short description below
 * - Hover / Focus: Compact darker navy rounded rectangle (#08163B) hugs the item closely
 * - Icon transitions to solid white badge with dark icon on hover
 * - GSAP reversible opacity transition only (no translation, scale, or layout jumps)
 * - Restrained 12px-16px corner radius (rounded-xl sm:rounded-2xl)
 */
interface FeatureItemProps {
  feature: AboutCertificationFeatureItem;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const darkOverlayRef = useRef<HTMLDivElement | null>(null);
  const iconBadgeDefaultRef = useRef<HTMLDivElement | null>(null);
  const iconBadgeHoverRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!itemRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out', duration: 0.2 },
      });

      if (darkOverlayRef.current) {
        tl.to(darkOverlayRef.current, { opacity: 1 }, 0);
      }
      if (iconBadgeHoverRef.current) {
        tl.to(iconBadgeHoverRef.current, { opacity: 1 }, 0);
      }
      if (iconBadgeDefaultRef.current) {
        tl.to(iconBadgeDefaultRef.current, { opacity: 0 }, 0);
      }

      tlRef.current = tl;
    }, itemRef);

    return () => ctx.revert();
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (prefersReducedMotion()) {
      if (darkOverlayRef.current) darkOverlayRef.current.style.opacity = '1';
      if (iconBadgeHoverRef.current) iconBadgeHoverRef.current.style.opacity = '1';
      if (iconBadgeDefaultRef.current) iconBadgeDefaultRef.current.style.opacity = '0';
      return;
    }
    tlRef.current?.play();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (prefersReducedMotion()) {
      if (darkOverlayRef.current) darkOverlayRef.current.style.opacity = '0';
      if (iconBadgeHoverRef.current) iconBadgeHoverRef.current.style.opacity = '0';
      if (iconBadgeDefaultRef.current) iconBadgeDefaultRef.current.style.opacity = '1';
      return;
    }
    tlRef.current?.reverse();
  };

  const IconComp = getFeatureIcon(feature.icon, feature.id);

  return (
    <article
      ref={itemRef}
      tabIndex={0}
      role="region"
      aria-label={feature.title}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      className="feature-item relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-start transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1B4A] select-none"
    >
      {/* Darker Navy Surface Overlay (#08163B / #0A1637) triggered on hover/focus */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#08163B]/95 rounded-xl sm:rounded-2xl pointer-events-none opacity-0 transition-opacity"
      />

      {/* Top row: Icon Badge + Uppercase Title side by side */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 mb-3 sm:mb-3.5">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
          {/* Default Dark Translucent Icon Badge */}
          <div
            ref={iconBadgeDefaultRef}
            className="absolute inset-0 rounded-full bg-[#0D1C44]/80 border border-white/20 flex items-center justify-center text-white shadow-xs"
          >
            <IconComp size={20} weight="regular" aria-hidden="true" />
          </div>

          {/* Hover Solid White Icon Badge */}
          <div
            ref={iconBadgeHoverRef}
            className="absolute inset-0 rounded-full bg-white flex items-center justify-center text-[#08163B] shadow-xs opacity-0"
          >
            <IconComp size={20} weight="bold" aria-hidden="true" />
          </div>
        </div>

        {/* Feature Title (compact uppercase) */}
        <h3 className="text-xs sm:text-[13px] lg:text-[13.5px] font-bold tracking-wider uppercase text-white leading-tight">
          {feature.title}
        </h3>
      </div>

      {/* Description below */}
      <div className="relative z-10">
        <p className="text-xs sm:text-[12.5px] lg:text-[13px] text-white/75 font-normal leading-relaxed">
          {feature.description}
        </p>
      </div>
    </article>
  );
};

/**
 * Approved ECASEURO About "Certification built on confidence." Compact Strip
 *
 * Source of Truth: Approved Figma Desktop Composition & Specifications
 * - Compact horizontal break / filler strip across the page
 * - Full-width section with confirmed CTA gradient (#0F1B4A -> #6B96CC)
 * - Single row layout on desktop:
 *   [ LEFT CONTENT (Heading + Paragraph) ]  [ FEATURE 01 ]  [ FEATURE 02 ]  [ FEATURE 03 ]
 * - Lightweight default state with transparent background
 * - Hover / Focus state: compact dark navy rounded rectangle (#08163B) hugs the feature closely
 * - Restrained radius (12px-16px) and GSAP opacity-only transitions
 */
export const AboutCertificationConfidenceSection: React.FC<
  AboutCertificationConfidenceSectionProps
> = ({ content = defaultAboutCertificationConfidenceContent }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      });

      if (leftColRef.current) {
        tl.fromTo(leftColRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 });
      }

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('.feature-item');
        tl.fromTo(
          items,
          { opacity: 0 },
          { opacity: 1, duration: 0.45, stagger: 0.08 },
          '-=0.25'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Certification built on confidence"
      className="w-full py-10 sm:py-12 md:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-cta-gradient text-white relative overflow-hidden"
    >
      <div className="w-full max-w-[1380px] xl:max-w-[1560px] 2xl:max-w-[1680px] mx-auto">
        {/* Compact Horizontal Layout: Left Intro + 3 Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
          {/* Left Content: Compact Display Heading + Paragraph */}
          <div
            ref={leftColRef}
            className="lg:col-span-4 xl:col-span-3.5 flex flex-col justify-center pr-0 lg:pr-2"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-normal leading-[1.12] tracking-[-0.02em] text-white">
              {content.heading}
            </h2>
            <p className="mt-4 sm:mt-5 text-xs sm:text-[13px] lg:text-[13.5px] text-white/80 font-normal leading-relaxed max-w-[320px]">
              {content.description}
            </p>
          </div>

          {/* Right Features: 3-Column Compact Flow */}
          <div
            ref={featuresRef}
            className="lg:col-span-8 xl:col-span-8.5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 lg:gap-4 xl:gap-5 items-stretch"
          >
            {content.features.map((feature) => (
              <FeatureItem key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

