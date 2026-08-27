import React, { useRef, useLayoutEffect } from 'react';
import { CbamIcon } from './CbamIconMap';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import type { CbamVerifierStatusContent } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface CbamVerifierStatusSectionProps {
  content?: CbamVerifierStatusContent;
}

/**
 * CbamVerifierStatusSection Component
 *
 * Source of Truth: Approved CBAM Verification Desktop Reference
 *
 * Requirements:
 * - Factual, restrained editorial status panel
 * - Clear and compliant wording without premature claims of granted accreditation
 * - Consistent with ECASEURO container sizing and DM Sans typography
 */
export const CbamVerifierStatusSection: React.FC<CbamVerifierStatusSectionProps> = ({
  content = defaultCbamVerificationPageContent.status,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !cardRef.current || !sectionRef.current) return;

    const card = cardRef.current;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      gsap.set(card, { opacity: 0 });

      gsap.to(card, {
        opacity: 1,
        duration: 0.35,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cbam-verifier-status"
      aria-labelledby="cbam-status-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10"
    >
      <div
        ref={cardRef}
        className="relative w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/70 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 lg:gap-8"
      >
        {/* Left Circular Icon Holder */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F4F7FD] flex items-center justify-center text-[#082046] shrink-0 border border-slate-200/50">
          <CbamIcon
            iconKey={content.iconKey}
            size={24}
            weight="regular"
            className="text-[#082046]"
          />
        </div>

        {/* Right Information Block */}
        <div className="flex-1 flex flex-col">
          <h2
            id="cbam-status-heading"
            className="text-lg sm:text-xl lg:text-[22px] font-semibold text-[#082046] tracking-[-0.01em]"
          >
            {content.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed mt-1 sm:mt-1.5">
            {content.description}
          </p>
          <span className="text-xs text-[#64748B] mt-2 font-normal">
            {content.supportingNote}
          </span>
        </div>
      </div>
    </section>
  );
};
