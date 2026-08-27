import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  ShieldPlus,
  ChatTeardropText,
  Desktop,
  Briefcase,
  Pill,
  MapPin,
  Flame,
  Lightning,
  HardHat,
  Gear,
  Flask,
  ForkKnife,
  FirstAid,
} from '@phosphor-icons/react';
import { defaultAboutGlobalExpertiseContent } from '../../cms/aboutContent';
import type {
  AboutGlobalExpertiseContent,
  IndustryItem,
} from '../../cms/types';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';

export interface AboutGlobalExpertiseSectionProps {
  content?: AboutGlobalExpertiseContent;
}

/**
 * Safe icon mapper for industry keys to Phosphor Icons
 */
const getIndustryIcon = (iconKey: string) => {
  switch (iconKey.toLowerCase()) {
    case 'oil-gas':
    case 'oil':
    case 'gas':
      return ShieldPlus;
    case 'power':
    case 'energy':
      return ChatTeardropText;
    case 'mining':
    case 'tech':
    case 'technology':
    case 'monitor':
    case 'desktop':
      return Desktop;
    case 'construction':
      return Briefcase;
    case 'chemical':
    case 'pharma':
    case 'pill':
      return Pill;
    case 'food':
    case 'agriculture':
      return MapPin;
    case 'engineering':
      return Gear;
    case 'flame':
      return Flame;
    case 'lightning':
      return Lightning;
    case 'hardhat':
      return HardHat;
    case 'flask':
      return Flask;
    case 'forkknife':
      return ForkKnife;
    case 'firstaid':
      return FirstAid;
    default:
      return ShieldCheck;
  }
};

/**
 * Approved ECASEURO About "Global Expertise, Local Understanding" Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Specifications
 * - Top Row:
 *   - Left: Semantic Display H2 ("Global Expertise,\nLocal Understanding")
 *   - Right: Supporting paragraph
 * - 2-Column Asymmetric Capability Collage:
 *   - Left Column:
 *     - Card 01: 10+ Countries (Headline, subtitle, copy + wireframe globe SVG + layered HTML country pills)
 *     - Card 02: Worldwide (Headline, subtitle, copy + bottom WebP photo)
 *   - Right Column:
 *     - Card 03: 15+ Offices (Upper orbit SVG diagram with assessor node + headline, subtitle, copy)
 *     - Card 04: Multiple (Upper blue horizontal industry icon strip with active/hover states + headline, subtitle, copy)
 * - Desktop-Only Scroll-Linked Alignment:
 *   - Right column begins approx 75px lower than its final aligned position
 *   - Smoothly translates upward tied to scroll progress via GSAP ScrollTrigger (scrub: 1)
 *   - Ends with both columns vertically aligned
 *   - No scroll offset or transform on tablet/mobile (< 1024px)
 *   - Opacity-only entrance sequence
 *   - Restrained 12px-16px card radii
 */
export const AboutGlobalExpertiseSection: React.FC<
  AboutGlobalExpertiseSectionProps
> = ({ content = defaultAboutGlobalExpertiseContent }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  // Industry strip active item state
  const industryItems = content.industries.items;
  const defaultActiveIndustryId = industryItems[2]?.id || industryItems[0]?.id || 'mining';
  const [activeIndustryId, setActiveIndustryId] = useState<string>(defaultActiveIndustryId);

  // Coordinate mapping for the 4 country pills over the globe SVG
  const countryPositions = [
    { top: '16%', left: '8%' },
    { top: '14%', right: '10%' },
    { bottom: '34%', left: '15%' },
    { bottom: '20%', right: '10%' },
  ];

  // GSAP Entrance (opacity-only) + Desktop Scroll-Linked Right Column Alignment
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance animation (opacity-only)
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      });

      if (headingRef.current) {
        entranceTl.fromTo(headingRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }
      if (descRef.current) {
        entranceTl.fromTo(descRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 }, '-=0.3');
      }
      if (leftColRef.current) {
        entranceTl.fromTo(leftColRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.25');
      }
      if (rightColRef.current) {
        entranceTl.fromTo(rightColRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.35');
      }

      // 2. Desktop-Only Scroll-Linked Right Column Alignment Interaction
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        if (rightColRef.current && sectionRef.current) {
          gsap.fromTo(
            rightColRef.current,
            { y: 75 },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                end: 'center 45%',
                scrub: 1,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global-expertise"
      aria-label="Global Expertise, Local Understanding"
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-[#EEEEEE]"
    >
      <div className="w-full max-w-[1380px] xl:max-w-[1560px] 2xl:max-w-[1680px] mx-auto">
        {/* TOP ROW: Heading & Supporting Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-start mb-10 sm:mb-12 lg:mb-14">
          <div className="lg:col-span-6 xl:col-span-6">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-normal leading-[1.12] tracking-[-0.025em] text-[#082046] whitespace-pre-line"
            >
              {content.heading}
            </h2>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 lg:pt-2 flex justify-start lg:justify-end">
            <p
              ref={descRef}
              className="text-sm sm:text-base lg:text-[16px] text-slate-600 font-normal leading-relaxed max-w-lg lg:text-right"
            >
              {content.description}
            </p>
          </div>
        </div>

        {/* 2-COLUMN ASYMMETRIC COLLAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
          {/* LEFT COLUMN */}
          <div ref={leftColRef} className="flex flex-col gap-6 lg:gap-8">
            {/* CARD 01 — 10+ Countries (Shorter Left-Column Card ~46%) */}
            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.countries.headline} - ${content.countries.subtitle}`}
              className="group relative bg-gradient-to-r from-[#F2F5FB] to-[#DCDEFA] border border-slate-200/80 shadow-xs rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] lg:h-[480px] xl:h-[500px]"
            >
              {/* Top Text Content */}
              <div className="relative z-20 shrink-0">
                <h3 className="text-3xl sm:text-4xl lg:text-[38px] font-normal leading-tight text-[#082046] tracking-tight">
                  {content.countries.headline}
                </h3>
                <h4 className="text-base sm:text-lg font-medium text-[#082046] mt-3 sm:mt-4">
                  {content.countries.subtitle}
                </h4>
                <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed mt-2 max-w-md">
                  {content.countries.description}
                </p>
                {content.countries.subDescription && (
                  <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed">
                    {content.countries.subDescription}
                  </p>
                )}
              </div>

              {/* Lower Globe Wireframe Graphic + Layered Country Pills */}
              <div className="relative w-full flex-1 min-h-[200px] sm:min-h-[220px] lg:min-h-0 flex items-end justify-center pt-4">
                {/* Globe SVG Graphic */}
                <img
                  src="/images/about/global-countries.svg"
                  alt=""
                  className="w-full h-full max-h-[230px] xl:max-h-[250px] object-contain object-bottom pointer-events-none select-none opacity-85 group-hover:opacity-95 transition-opacity duration-300"
                />

                {/* Layered HTML Country Pills */}
                {content.countries.locations.map((location, idx) => {
                  const pos = countryPositions[idx] || { top: '50%', left: '50%' };
                  return (
                    <div
                      key={location}
                      tabIndex={0}
                      role="text"
                      className="absolute bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 sm:gap-2.5 transition-all duration-200 cursor-default hover:bg-white hover:shadow-md hover:border-slate-300 select-none z-10"
                      style={pos}
                    >
                      {/* Round indicator circle */}
                      <span
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-300/80 shrink-0 inline-block shadow-inner"
                        aria-hidden="true"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#082046] tracking-wide whitespace-nowrap">
                        {location}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* CARD 02 — Worldwide (Taller Left-Column Card ~54%) */}
            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.worldwide.headline} - ${content.worldwide.subtitle}`}
              className="group bg-white border border-slate-200/80 shadow-xs rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] lg:h-[560px] xl:h-[580px]"
            >
              {/* Top Text Content */}
              <div className="shrink-0">
                <h3 className="text-3xl sm:text-4xl lg:text-[38px] font-normal leading-tight text-[#082046] tracking-tight">
                  {content.worldwide.headline}
                </h3>
                <h4 className="text-base sm:text-lg font-medium text-[#082046] mt-3 sm:mt-4">
                  {content.worldwide.subtitle}
                </h4>
                <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed mt-2 max-w-md">
                  {content.worldwide.description}
                </p>
              </div>

              {/* Lower Image Graphic (Fills remaining vertical room cleanly) */}
              <div className="w-full flex-1 mt-6 sm:mt-7 overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 min-h-[220px] sm:min-h-[260px] lg:min-h-0">
                <img
                  src={
                    content.worldwide.image?.src ||
                    '/images/about/global-worldwide.webp'
                  }
                  alt={
                    content.worldwide.image?.alt ||
                    'Worldwide certification and global capability'
                  }
                  className="w-full h-full object-cover object-center rounded-xl sm:rounded-2xl transition-opacity duration-300 opacity-95 group-hover:opacity-100"
                />
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN (Desktop Scroll-Linked Upward Translation) */}
          <div ref={rightColRef} className="flex flex-col gap-6 lg:gap-8">
            {/* CARD 03 — 15+ Offices (Taller Right-Column Card ~60% — visibly taller than 10+ Countries) */}
            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.offices.headline} - ${content.offices.subtitle}`}
              className="group bg-white border border-slate-200/80 shadow-xs rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] lg:h-[630px] xl:h-[650px]"
            >
              {/* Upper Orbit Visual Graphic (Generous vertical space) */}
              <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-4 mb-4 sm:mb-6 min-h-[240px] sm:min-h-[280px] lg:min-h-0">
                <img
                  src="/images/about/global-offices.svg"
                  alt=""
                  className="w-full max-w-[360px] sm:max-w-[420px] xl:max-w-[460px] max-h-[360px] xl:max-h-[400px] h-auto object-contain pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              {/* Lower Text Content */}
              <div className="shrink-0">
                <h3 className="text-3xl sm:text-4xl lg:text-[38px] font-normal leading-tight text-[#082046] tracking-tight">
                  {content.offices.headline}
                </h3>
                <h4 className="text-base sm:text-lg font-medium text-[#082046] mt-3 sm:mt-4">
                  {content.offices.subtitle}
                </h4>
                <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed mt-2 max-w-md">
                  {content.offices.description}
                </p>
              </div>
            </article>

            {/* CARD 04 — Multiple Industries (Shorter Right-Column Card ~40% — shorter than 15+ Offices) */}
            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.industries.headline} - ${content.industries.subtitle}`}
              className="group bg-white border border-slate-200/80 shadow-xs rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] lg:h-[410px] xl:h-[430px]"
            >
              {/* Upper Horizontal Industry Icon Strip — Continuous Smooth Marquee */}
              <div
                role="toolbar"
                aria-label="Industries we serve"
                className="w-full bg-gradient-to-r from-[#1B3679] via-[#284E94] to-[#4572B8] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 mb-4 sm:mb-6 overflow-hidden shadow-xs shrink-0 relative select-none"
              >
                <div className="industry-marquee-track">
                  {/* Track 1 */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 pr-2 sm:pr-3">
                    {industryItems.map((industry) => {
                      const isActive = industry.id === activeIndustryId;
                      const IconComp = getIndustryIcon(industry.iconKey);

                      return (
                        <button
                          key={`track1-${industry.id}`}
                          type="button"
                          tabIndex={0}
                          aria-label={industry.label}
                          aria-pressed={isActive}
                          onPointerEnter={() => setActiveIndustryId(industry.id)}
                          onFocus={() => setActiveIndustryId(industry.id)}
                          onClick={() => setActiveIndustryId(industry.id)}
                          className={`relative flex items-center justify-center shrink-0 rounded-xl sm:rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white ${
                            isActive
                              ? 'w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#082046] shadow-sm scale-105'
                              : 'w-9 h-9 sm:w-11 sm:h-11 bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <IconComp
                            size={isActive ? 22 : 19}
                            weight={isActive ? 'bold' : 'regular'}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Track 2 for seamless, jump-free loop */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 pr-2 sm:pr-3" aria-hidden="true">
                    {industryItems.map((industry) => {
                      const isActive = industry.id === activeIndustryId;
                      const IconComp = getIndustryIcon(industry.iconKey);

                      return (
                        <button
                          key={`track2-${industry.id}`}
                          type="button"
                          tabIndex={-1}
                          aria-label={industry.label}
                          aria-pressed={isActive}
                          onPointerEnter={() => setActiveIndustryId(industry.id)}
                          onFocus={() => setActiveIndustryId(industry.id)}
                          onClick={() => setActiveIndustryId(industry.id)}
                          className={`relative flex items-center justify-center shrink-0 rounded-xl sm:rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white ${
                            isActive
                              ? 'w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#082046] shadow-sm scale-105'
                              : 'w-9 h-9 sm:w-11 sm:h-11 bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <IconComp
                            size={isActive ? 22 : 19}
                            weight={isActive ? 'bold' : 'regular'}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lower Text Content */}
              <div className="shrink-0">
                <h3 className="text-3xl sm:text-4xl lg:text-[38px] font-normal leading-tight text-[#082046] tracking-tight">
                  {content.industries.headline}
                </h3>
                <h4 className="text-base sm:text-lg font-medium text-[#082046] mt-3 sm:mt-4">
                  {content.industries.subtitle}
                </h4>
                <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed mt-2 max-w-lg">
                  Serving{' '}
                  <strong className="font-bold text-[#082046]">
                    organisations across Oil &amp; Gas, Power, Mining, Construction, Engineering, Chemical, Food
                  </strong>{' '}
                  and other industries.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
