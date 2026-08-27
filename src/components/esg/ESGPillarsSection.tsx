import React, { useRef, useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import { ESGCard } from './ESGCard';
import { defaultESGSectionContent } from '../../cms/esgContent';
import type { ESGSectionContent } from '../../cms/types';

export interface ESGPillarsSectionProps {
  content?: ESGSectionContent;
}

/**
 * ESGPillarsSection Component
 *
 * Source of Truth: Approved ESG Figma reference layout
 * - Top Row:
 *   - Left: <h2> section heading ("Simple Steps to Access\nTrusted Care Anytime")
 *   - Right: Explanatory copy block with constrained width and relaxed line height
 * - Bottom Row:
 *   - 3 tall equal-width editorial cards (Environmental, Social, Governance)
 * - Entrance motion: Opacity only (heading -> copy -> cards staggered)
 * - Respects prefers-reduced-motion
 */
export const ESGPillarsSection: React.FC<ESGPillarsSectionProps> = ({
  content = defaultESGSectionContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const cards = gridRef.current?.querySelectorAll('.esg-card');

    const ctx = gsap.context(() => {
      gsap.set([heading, desc], { opacity: 0 });
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(desc, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15');

      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
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
      id="esg-pillars"
      aria-labelledby="esg-pillars-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-12 sm:py-16 lg:py-24"
    >
      {/* Top Row: Heading on Left & Explanatory Copy on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start justify-between">
        {/* Left Column: Section Heading */}
        <div className="lg:col-span-5">
          <h2
            ref={headingRef}
            id="esg-pillars-heading"
            className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.14] tracking-[-0.02em] text-[#082046] whitespace-pre-line"
          >
            {content.heading}
          </h2>
        </div>

        {/* Right Column: Explanatory Copy */}
        <div className="lg:col-span-7 flex lg:justify-end">
          <p
            ref={descRef}
            className="text-xs sm:text-sm lg:text-[15px] text-[#334155] leading-relaxed font-normal max-w-2xl"
          >
            {content.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: 3 Equal-Width ESG Pillar Cards */}
      <div
        ref={gridRef}
        role="list"
        aria-label="Environmental, Social, and Governance pillars"
        className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
      >
        {content.pillars.map((pillar) => (
          <ESGCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </section>
  );
};
