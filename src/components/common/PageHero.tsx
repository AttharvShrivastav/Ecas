import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from './Navbar';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface PageHeroProps {
  eyebrow?: string;
  headingLines: string[];
  description: string;
  visualSrc?: string;
  visualAlt?: string;
  visualPosition?: 'home-globe' | 'about-map' | 'custom';
  visualClassName?: string;
  visualFallbackLabel?: string;
  ariaLabel?: string;
  heroVariant?: 'default' | 'compact';
  children?: React.ReactNode;
}

/**
 * Reusable ECASEURO Shared Page Hero Component
 *
 * Source of Truth: Approved Figma Desktop Composition
 * - Rounded container inset inside global neutral page canvas (#EEEEEE)
 * - Confirmed diagonal hero gradient (#00607A -> #032E64) + procedural grain
 * - Inset production Navbar inside top region
 * - Left-aligned semantic display H1 with staggered lines
 * - Supporting secondary copy
 * - Independently positioned decorative visual with quiet fallback
 * - Restrained GSAP entrance motion (no parallax, no continuous loops)
 */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  headingLines,
  description,
  visualSrc,
  visualAlt = '',
  visualPosition = 'home-globe',
  visualClassName,
  visualFallbackLabel = 'HERO ASSET PENDING',
  ariaLabel = 'Page Hero',
  heroVariant = 'default',
  children,
}) => {
  const [assetError, setAssetError] = useState(false);

  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroContainerRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Hero panel subtle opacity settle
      tl.fromTo(
        heroContainerRef.current,
        { opacity: 0.85 },
        { opacity: 1, duration: 0.4 }
      );

      // 2. Eyebrow reveal (if present)
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        );
      }

      // 3. Heading lines stagger reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll('.hero-line');
        if (lines.length > 0) {
          tl.fromTo(
            lines,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
            },
            '-=0.2'
          );
        }
      }

      // 3. Supporting copy reveal
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.25'
        );
      }

      // 4. Decorative asset reveal
      if (visualRef.current) {
        tl.fromTo(
          visualRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.35'
        );
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // Determine visual position wrapper classes based on visualPosition preset or custom visualClassName
  let defaultVisualWrapperClass = '';
  if (visualPosition === 'home-globe') {
    defaultVisualWrapperClass =
      'absolute -bottom-14 -right-12 sm:-bottom-16 sm:-right-14 md:-bottom-18 md:-right-14 lg:-bottom-20 lg:-right-16 xl:-bottom-22 xl:-right-18 2xl:-bottom-26 2xl:-right-22 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px] xl:w-[680px] xl:h-[680px] 2xl:w-[740px] 2xl:h-[740px] pointer-events-none select-none z-10 flex items-center justify-center';
  } else if (visualPosition === 'about-map') {
    defaultVisualWrapperClass =
      'absolute -top-6 sm:-top-8 lg:-top-10 -right-8 sm:-right-12 lg:-right-14 xl:-right-16 w-[340px] sm:w-[480px] md:w-[600px] lg:w-[700px] xl:w-[780px] 2xl:w-[840px] pointer-events-none select-none z-10 flex items-center justify-end';
  }

  const finalVisualWrapperClass = visualClassName || defaultVisualWrapperClass;

  return (
    <div className="w-full py-3 sm:py-5 lg:py-6 px-3 sm:px-5 lg:px-6 xl:px-8 2xl:px-10">
      {/* Rounded Hero Panel Inset Inside Neutral Canvas */}
      <section
        ref={heroContainerRef}
        aria-label={ariaLabel}
        className={`relative w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto bg-hero-gradient rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden text-white pt-3 sm:pt-4 ${
          heroVariant === 'compact'
            ? 'pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 2xl:pb-32 min-h-[420px] sm:min-h-[470px] md:min-h-[520px] lg:min-h-[560px] xl:min-h-[600px] 2xl:min-h-[630px]'
            : 'pb-16 sm:pb-24 md:pb-32 lg:pb-40 xl:pb-48 2xl:pb-52 min-h-[520px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[700px] xl:min-h-[750px] 2xl:min-h-[790px]'
        }`}
      >
        {/* Confirmed Procedural Grain / Noise Overlay */}
        <div className="noise-overlay pointer-events-none" aria-hidden="true" />

        {/* Inset Production Navbar */}
        <div className="relative z-30">
          <Navbar />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 pt-8 sm:pt-14 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column (~58% on Desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 z-20">
              {/* Optional Eyebrow */}
              {eyebrow && (
                <span
                  ref={eyebrowRef}
                  className="block text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase text-white/80 mb-3 sm:mb-4"
                >
                  {eyebrow}
                </span>
              )}

              {/* Single Semantic Display H1 with Staggered Lines */}
              <h1
                ref={headingRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-normal leading-[1.08] tracking-[-0.025em] text-white space-y-0.5 sm:space-y-1"
              >
                {headingLines.map((line, index) => (
                  <span
                    key={index}
                    className="hero-line block whitespace-normal sm:whitespace-nowrap"
                  >
                    {line}
                  </span>
                ))}
              </h1>

              {/* Supporting Secondary Copy */}
              <p
                ref={descRef}
                className="mt-6 sm:mt-8 max-w-xl lg:max-w-[480px] xl:max-w-[560px] 2xl:max-w-[620px] text-sm sm:text-[15px] lg:text-base text-white/85 font-normal leading-relaxed tracking-normal"
              >
                {description}
              </p>

              {children}
            </div>

            {/* Right Visual Spacer for Grid Layout */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Decorative Visual Slot */}
        {visualSrc && (
          <div
            ref={visualRef}
            aria-hidden="true"
            className={finalVisualWrapperClass}
          >
            {!assetError ? (
              <img
                src={visualSrc}
                alt={visualAlt}
                className="w-full h-full object-contain object-right"
                onError={() => setAssetError(true)}
              />
            ) : (
              /* Quiet Development Fallback Placeholder */
              <div className="w-4/5 h-4/5 rounded-full border border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-white/30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  {visualFallbackLabel}
                </span>
                <span className="text-[9px] text-white/30 mt-1">
                  {visualSrc}
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};