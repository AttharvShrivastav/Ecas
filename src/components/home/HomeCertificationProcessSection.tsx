import React, { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';
import { defaultCertificationProcessContent } from '../../cms/homeContent';
import type { HomeCertificationProcessContent } from '../../cms/types';

export interface HomeCertificationProcessSectionProps {
  content?: HomeCertificationProcessContent;
}

/**
 * HomeCertificationProcessSection Component
 *
 * "A clear path from Enquiry to Certification" Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Gradient Spec
 * - Left column: Semantic <h2> heading + supporting <p> description with generous negative space
 * - Right column: Dominant rounded process panel with confirmed #F9F8FA (22%) -> #90B3F0 (100%) gradient
 * - 5 stacked process cards in semantic <ol> / <li> / <h3> structure
 * - GSAP Entrance: Strict OPACITY ONLY (no x/y translation, scale, or parallax)
 * - Accessibility: Semantic markup, WCAG AA contrast, and prefers-reduced-motion compliance
 */
export const HomeCertificationProcessSection: React.FC<HomeCertificationProcessSectionProps> = ({
  content = defaultCertificationProcessContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLOListElement | null>(null);

  useLayoutEffect(() => {
    // Respect prefers-reduced-motion
    if (prefersReducedMotion() || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const panel = panelRef.current;
    const cards = cardsRef.current?.querySelectorAll('.process-step-card');

    const ctx = gsap.context(() => {
      // Set initial states (OPACITY ONLY)
      gsap.set([heading, desc, panel], { opacity: 0 });
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
      }

      // Restrained opacity-only timeline triggered on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      // 1. Left heading fades in
      tl.to(heading, {
        opacity: 1,
        duration: 0.35,
        ease: 'power1.out',
      })
        // 2. Supporting paragraph fades in shortly after
        .to(
          desc,
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.15'
        )
        // 3. Gradient process panel container fades in
        .to(
          panel,
          {
            opacity: 1,
            duration: 0.35,
            ease: 'power1.out',
          },
          '-=0.15'
        );

      // 4. The 5 white cards fade in sequentially top-to-bottom
      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.25,
            stagger: 0.09,
            ease: 'power1.out',
          },
          '-=0.1'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certification-process"
      aria-labelledby="certification-process-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-16 sm:pb-24 lg:pb-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column: Heading + Description (Top-aligned naturally at the top-left) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <h2
            ref={headingRef}
            id="certification-process-heading"
            className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.16] tracking-[-0.02em] text-[#0B1642] whitespace-pre-line"
          >
            {content.heading}
          </h2>

          <p
            ref={descRef}
            className="mt-5 sm:mt-6 text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg font-normal"
          >
            {content.description}
          </p>
        </div>

        {/* Right Column: Dominant Rounded Gradient Process Panel */}
        <div className="lg:col-span-7 xl:col-span-7">
          <div
            ref={panelRef}
            className="relative w-full bg-process-panel-gradient rounded-2xl sm:rounded-3xl lg:rounded-[28px] p-5 sm:p-7 lg:p-9 shadow-xs"
          >
            {/* 5 Stacked Process Cards (Semantic Ordered List) */}
            <ol
              ref={cardsRef}
              className="space-y-3 sm:space-y-3.5 list-none m-0 p-0"
            >
              {content.steps.map((step) => (
                <li
                  key={step.number}
                  className="process-step-card bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:px-6 lg:py-5 flex items-start gap-4 sm:gap-6 shadow-2xs border border-white/60"
                >
                  {/* Step Number */}
                  <span
                    aria-hidden="true"
                    className="text-base sm:text-lg font-normal text-[#0F172A] w-7 sm:w-8 shrink-0 select-none pt-0.5 leading-snug"
                  >
                    {step.number}
                  </span>

                  {/* Step Content Column */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-[17px] font-semibold text-[#0F172A] tracking-[-0.01em] leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
