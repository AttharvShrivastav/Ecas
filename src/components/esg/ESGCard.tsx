import React, { useRef, useEffect } from 'react';
import {
  Leaf,
  GlobeHemisphereWest,
  UsersThree,
  Handshake,
  Scales,
  ShieldCheck,
} from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { ESGPillar, ESGPillarIconKey } from '../../cms/types';

export interface ESGCardProps {
  pillar: ESGPillar;
}

const renderIcon = (key: ESGPillarIconKey, className?: string) => {
  const iconProps = { size: 20, weight: 'bold' as const, className };
  switch (key) {
    case 'leaf':
      return <Leaf {...iconProps} />;
    case 'globe':
      return <GlobeHemisphereWest {...iconProps} />;
    case 'users':
      return <UsersThree {...iconProps} />;
    case 'handshake':
      return <Handshake {...iconProps} />;
    case 'scales':
      return <Scales {...iconProps} />;
    case 'shield':
      return <ShieldCheck {...iconProps} />;
    default:
      return <Leaf {...iconProps} />;
  }
};

/**
 * ESGCard Component
 *
 * Source of Truth: Approved ESG Figma reference layout
 *
 * Architecture:
 * esg-card
 * ├── base surface (pale neutral/lavender surface: #F4F7FD)
 * ├── gradient overlay (CTA gradient #0F1B4A → #6B96CC)
 * └── content:
 *     ├── top row: circular white icon holder (left) + large prominent number (right)
 *     ├── intentional open area (middle spacer)
 *     └── bottom block: uppercase pillar title + flowing pipe-separated topics paragraph
 *
 * Interaction:
 * - Default: Pale light surface, dark navy typography
 * - Hover / Focus: Smooth reversible GSAP timeline fading in the gradient layer & turning text/number white
 * - No y, x, scale, rotation, blur, or card lifting
 * - Respects prefers-reduced-motion
 */
export const ESGCard: React.FC<ESGCardProps> = ({ pillar }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const topicsRef = useRef<HTMLParagraphElement | null>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (
      !cardRef.current ||
      !gradientRef.current ||
      !numberRef.current ||
      !titleRef.current ||
      !topicsRef.current
    )
      return;

    const gradient = gradientRef.current;
    const numberEl = numberRef.current;
    const title = titleRef.current;
    const topics = topicsRef.current;

    // Initial values
    gsap.set(gradient, { opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(
      gradient,
      { opacity: 1, duration: 0.28, ease: 'power1.out' },
      0
    )
      .to(
        numberEl,
        { color: '#FFFFFF', duration: 0.25, ease: 'power1.out' },
        0
      )
      .to(
        title,
        { color: '#FFFFFF', duration: 0.25, ease: 'power1.out' },
        0
      )
      .to(
        topics,
        { color: '#E2E8F0', duration: 0.25, ease: 'power1.out' },
        0
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) {
      if (gradientRef.current) gradientRef.current.style.opacity = '1';
      if (numberRef.current) numberRef.current.style.color = '#FFFFFF';
      if (titleRef.current) titleRef.current.style.color = '#FFFFFF';
      if (topicsRef.current) topicsRef.current.style.color = '#E2E8F0';
      return;
    }
    tlRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) {
      if (gradientRef.current) gradientRef.current.style.opacity = '0';
      if (numberRef.current) numberRef.current.style.color = '#081A44';
      if (titleRef.current) titleRef.current.style.color = '#081A44';
      if (topicsRef.current) topicsRef.current.style.color = '#334155';
      return;
    }
    tlRef.current?.reverse();
  };

  const handleFocus = () => {
    handleMouseEnter();
  };

  const handleBlur = () => {
    handleMouseLeave();
  };

  return (
    <article
      ref={cardRef}
      role="listitem"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="esg-card group relative w-full rounded-2xl overflow-hidden border border-[#E2E8F4] shadow-2xs cursor-default select-none focus:outline-none focus:ring-2 focus:ring-[#0F1B4A]/30 flex flex-col justify-between min-h-[420px] sm:min-h-[450px] lg:min-h-[480px]"
    >
      {/* 1. Base light pale/lavender surface */}
      <div className="absolute inset-0 bg-[#F4F7FD]" />

      {/* 2. Gradient overlay for hover/focus (CTA gradient: #0F1B4A → #1F3D78 → #5F89C5) */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-[#0F1B4A] via-[#1F3D78] to-[#5F89C5] opacity-0 pointer-events-none transition-opacity duration-200"
      />

      {/* 3. Content container */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full">
        {/* Top Row: Upper-left circular white icon holder & Upper-right large prominent number */}
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xs border border-slate-100/90 flex items-center justify-center shrink-0">
            <div className="text-[#081A44]">
              {renderIcon(pillar.iconKey)}
            </div>
          </div>

          <span
            ref={numberRef}
            className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#081A44] select-none transition-colors"
            aria-label={`Pillar number ${pillar.number}`}
          >
            {pillar.number}
          </span>
        </div>

        {/* Intentional Middle Open Space */}
        <div className="flex-1 min-h-[80px] sm:min-h-[120px] lg:min-h-[140px]" />

        {/* Lower Portion: Title & Dense Flowing Pipe-Separated Topics Block */}
        <div className="mt-auto">
          <h3
            ref={titleRef}
            className="text-lg sm:text-xl lg:text-[22px] font-bold uppercase tracking-wider text-[#081A44] mb-3 sm:mb-3.5 transition-colors"
          >
            {pillar.title}
          </h3>

          <p
            ref={topicsRef}
            className="text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed text-[#334155] font-normal transition-colors"
          >
            {pillar.topics.join(' | ')}
          </p>
        </div>
      </div>
    </article>
  );
};
