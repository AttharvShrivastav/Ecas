import React, { useState, useRef, useLayoutEffect } from 'react';
import { CbamIcon } from './CbamIconMap';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import type { CbamVerifierRoleContent } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface CbamVerifierRoleSectionProps {
  content?: CbamVerifierRoleContent;
}

/**
 * CbamVerifierRoleSection Component
 *
 * Source of Truth: Approved CBAM Verification Desktop Reference
 *
 * Layout:
 * - Inset wide white rounded container (#FFFFFF surface, rounded-[32px])
 * - Top Header: Semantic <h2> "Role of a CBAM verifier." + Subtitle description
 * - 4 Horizontal Service Rows:
 *   1. Data Review
 *   2. Site Visits
 *   3. Verification Reports
 *   4. Pre-Verification Visits
 *
 * Interaction:
 * - Clean white background by default with subtle dividers
 * - Hover / Focus: Applies the approved after-hover gradient / soft highlight
 * - Smooth transition, perfectly maintained typographic contrast
 */
export const CbamVerifierRoleSection: React.FC<CbamVerifierRoleSectionProps> = ({
  content = defaultCbamVerificationPageContent.roles,
}) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const container = containerRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const rows = rowsRef.current?.querySelectorAll('.cbam-role-row');

    const ctx = gsap.context(() => {
      gsap.set([heading, desc], { opacity: 0 });
      if (rows && rows.length > 0) {
        gsap.set(rows, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(desc, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15');

      if (rows && rows.length > 0) {
        tl.to(
          rows,
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: 'power1.out',
          },
          '-=0.1'
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cbam-verifier-role"
      aria-labelledby="cbam-roles-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10"
    >
      <div
        ref={containerRef}
        className="relative w-full bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-10 lg:p-12 xl:p-14 border border-slate-200/70 shadow-2xs"
      >
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2
            ref={headingRef}
            id="cbam-roles-heading"
            className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal leading-[1.14] tracking-[-0.02em] text-[#082046]"
          >
            {content.heading}
          </h2>
          <p
            ref={descRef}
            className="text-sm sm:text-base lg:text-[16px] text-[#475569] leading-relaxed font-normal mt-3 sm:mt-4 max-w-2xl"
          >
            {content.description}
          </p>
        </div>

        {/* 4 Horizontal Role Rows */}
        <div ref={rowsRef} className="space-y-1.5 sm:space-y-2">
          {content.items.map((item, index) => {
            const isHovered = hoveredRowId === item.id;
            const isLast = index === content.items.length - 1;

            return (
              <div
                key={item.id}
                role="listitem"
                tabIndex={0}
                onMouseEnter={() => setHoveredRowId(item.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onFocus={() => setHoveredRowId(item.id)}
                onBlur={() => setHoveredRowId(null)}
                className={`cbam-role-row group relative w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-colors duration-200 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00607A] ${
                  isHovered
                    ? 'bg-gradient-to-r from-[#F2F5FB] to-[#DCDEFA]'
                    : 'bg-white hover:bg-[#F8FAFC]'
                } ${!isLast && !isHovered ? 'border-b border-slate-100' : 'border-b border-transparent'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 items-center">
                  {/* Left Column: Icon + Title */}
                  <div className="md:col-span-4 lg:col-span-4 flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        isHovered
                          ? 'bg-white text-[#082046] shadow-xs'
                          : 'bg-[#F4F7FD] text-[#082046]'
                      }`}
                    >
                      <CbamIcon
                        iconKey={item.iconKey}
                        size={22}
                        weight={isHovered ? 'bold' : 'regular'}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#082046] tracking-[-0.01em]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right Column: Narrative Description */}
                  <div className="md:col-span-8 lg:col-span-8 md:pl-2">
                    <p className="text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
