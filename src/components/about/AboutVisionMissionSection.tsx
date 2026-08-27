import React, { useEffect, useRef } from 'react';
import { Eye, Target, ShieldCheck } from '@phosphor-icons/react';
import { getPhosphorIconByKey } from '../admin/cms/CMSIconSelect';
import { defaultAboutVisionMissionContent } from '../../cms/aboutContent';
import type { AboutVisionMissionContent, AboutValueItem } from '../../cms/types';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';

export interface AboutVisionMissionSectionProps {
  content?: AboutVisionMissionContent;
}

/**
 * Interactive Vision / Mission Value Card
 * - Default: Plain light surface, dark navy text, white icon badge, dark navy icon
 * - Hover / Focus: Smooth CTA gradient overlay (#0F1B4A -> #6B96CC), white text, crisp contrast
 * - GSAP reversible timeline: opacity and color transitions only (no motion/scale)
 */
interface ValueCardProps {
  item: AboutValueItem;
}

const ValueCard: React.FC<ValueCardProps> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const gradientOverlayRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });

      if (gradientOverlayRef.current) {
        tl.to(gradientOverlayRef.current, { opacity: 1 }, 0);
      }
      if (titleRef.current) {
        tl.to(titleRef.current, { color: '#FFFFFF' }, 0);
      }
      if (descRef.current) {
        tl.to(descRef.current, { color: 'rgba(255, 255, 255, 0.88)' }, 0);
      }
      if (numberRef.current) {
        tl.to(numberRef.current, { color: 'rgba(255, 255, 255, 0.7)' }, 0);
      }

      tlRef.current = tl;
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handlePointerEnter = () => {
    if (prefersReducedMotion()) {
      if (gradientOverlayRef.current) gradientOverlayRef.current.style.opacity = '1';
      if (titleRef.current) titleRef.current.style.color = '#FFFFFF';
      if (descRef.current) descRef.current.style.color = 'rgba(255, 255, 255, 0.88)';
      if (numberRef.current) numberRef.current.style.color = 'rgba(255, 255, 255, 0.7)';
      return;
    }
    tlRef.current?.play();
  };

  const handlePointerLeave = () => {
    if (prefersReducedMotion()) {
      if (gradientOverlayRef.current) gradientOverlayRef.current.style.opacity = '0';
      if (titleRef.current) titleRef.current.style.color = '#082046';
      if (descRef.current) descRef.current.style.color = '#475569';
      if (numberRef.current) numberRef.current.style.color = '#64748B';
      return;
    }
    tlRef.current?.reverse();
  };

  const IconComponent = item.icon === 'eye' ? Eye : item.icon === 'target' ? Target : getPhosphorIconByKey(item.icon);

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      role="region"
      aria-label={item.title}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      className="value-card relative overflow-hidden rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200/70 bg-white/50 backdrop-blur-xs transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] focus-visible:ring-offset-2 select-none"
    >
      {/* Reversible CTA Gradient Overlay (#0F1B4A -> #6B96CC) */}
      <div
        ref={gradientOverlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-cta-gradient pointer-events-none opacity-0 transition-opacity duration-150"
      />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-7">
        {/* White circular icon holder with dark navy icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[#0C1E48]">
          <IconComponent size={32} weight="regular" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span
              ref={numberRef}
              className="text-xs sm:text-sm font-medium tracking-wider text-slate-500 transition-colors"
            >
              {item.number}
            </span>
            <h3
              ref={titleRef}
              className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#082046] transition-colors"
            >
              {item.title}
            </h3>
          </div>
          <p
            ref={descRef}
            className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal transition-colors"
          >
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
};

/**
 * Approved ECASEURO About Vision & Mission Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshots
 * - Left column:
 *   - Semantic display H2: "Vision shapes our direction. Mission defines our purpose."
 *   - Supporting paragraph
 * - Right column:
 *   - Interactive 01 Vision Card & 02 Mission Card
 *   - Default: plain surface with dark navy text
 *   - Hover/Focus: smoothly transitions to CTA gradient (#0F1B4A -> #6B96CC) with white text
 *   - Only hovered card is gradient; reversible GSAP animation
 * - Bottom Support Strip:
 *   - Confirmed Figma gradient (#DCDEFA 2% -> #F2F5FB 100%)
 *   - White circular ShieldCheck icon holder
 *   - Statement copy
 *   - Decorative map cropped on right (/images/about/about-support-map.webp, alt="")
 */
export const AboutVisionMissionSection: React.FC<AboutVisionMissionSectionProps> = ({
  content = defaultAboutVisionMissionContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const supportStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      });

      // Opacity-only staggered entrance sequence
      if (headingRef.current) {
        tl.fromTo(headingRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }

      if (descRef.current) {
        tl.fromTo(descRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 }, '-=0.3');
      }

      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll('.value-card');
        tl.fromTo(
          cards,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.15 },
          '-=0.25'
        );
      }

      if (supportStripRef.current) {
        tl.fromTo(supportStripRef.current, { opacity: 0 }, { opacity: 1, duration: 0.55 }, '-=0.25');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mapSrc = content.supportMapAsset?.src || '/images/about/about-support-map.webp';

  return (
    <section
      ref={sectionRef}
      aria-label="Vision and Mission"
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-[#EEEEEE]"
    >
      <div className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
        {/* Two-Column Composition: Left Brand Statement, Right Interactive Value Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Heading & Supporting Copy */}
          <div className="lg:col-span-5 xl:col-span-5">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-normal leading-[1.12] tracking-[-0.025em] text-[#082046] whitespace-pre-line"
            >
              {content.heading}
            </h2>
            <p
              ref={descRef}
              className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-[16px] text-slate-600 font-normal leading-relaxed max-w-lg"
            >
              {content.description}
            </p>
          </div>

          {/* Right Column: Interactive Vision & Mission Cards */}
          <div
            ref={cardsContainerRef}
            className="lg:col-span-7 xl:col-span-7 space-y-5 sm:space-y-6"
          >
            {content.items.map((item) => (
              <ValueCard key={item.id || item.title} item={item} />
            ))}
          </div>
        </div>

        {/* Bottom Support Strip: Wide Pale Blue Banner (#DCDEFA 2% -> #F2F5FB 100%) */}
        <div
          ref={supportStripRef}
          className="mt-10 sm:mt-14 lg:mt-16 relative overflow-hidden rounded-xl sm:rounded-2xl bg-about-support-gradient p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          {/* Left statement with ShieldCheck icon badge */}
          <div className="flex items-center gap-5 sm:gap-6 z-10 max-w-2xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[#0C1E48]">
              <ShieldCheck size={28} weight="regular" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base lg:text-[17px] font-medium text-[#082046] leading-relaxed">
              {content.supportStatement}
            </p>
          </div>

          {/* Right decorative map asset (WebP, alt="", anchored to right edge, cropped) */}
          <div
            aria-hidden="true"
            className="absolute -right-4 -bottom-6 md:top-1/2 md:-translate-y-1/2 w-[180px] sm:w-[240px] md:w-[300px] lg:w-[360px] pointer-events-none select-none opacity-60 md:opacity-75 mix-blend-multiply flex items-center justify-end"
          >
            <img
              src={mapSrc}
              alt=""
              className="w-full h-auto object-contain"
              onError={(e) => {
                // Keep quiet if missing
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

