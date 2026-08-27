import React, { useState, useRef, useLayoutEffect } from 'react';
import { CbamIcon } from './CbamIconMap';
import { defaultCbamVerificationPageContent } from '../../cms/cbamVerificationContent';
import type { CbamOverviewContent } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface CbamWhatDoesSectionProps {
  content?: CbamOverviewContent;
}

/**
 * CbamWhatDoesSection Component
 *
 * Source of Truth: Approved CBAM Verification Desktop Reference
 *
 * Layout:
 * - Two-column desktop grid:
 *   - Left: Semantic <h2> "What CBAM Verification does." + Two descriptive paragraphs
 *   - Right: Interactive 4-step horizontal process relationship:
 *     Producer -> Emissions Data -> Independent Verification -> EU CBAM Declaration
 *
 * Interaction:
 * - Default active step: "step-independent-verification" (matches approved design)
 * - Restrained hover/focus interaction: Applying the approved after-hover / navy gradient
 *   with white icon and readable contrast
 * - No scale bounce, no aggressive lift
 * - Fully responsive with clean mobile/tablet wrap
 */
export const CbamWhatDoesSection: React.FC<CbamWhatDoesSectionProps> = ({
  content = defaultCbamVerificationPageContent.overview,
}) => {
  const [activeStepId, setActiveStepId] = useState<string>('step-independent-verification');

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const processRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const textBlock = textBlockRef.current;
    const process = processRef.current;

    const ctx = gsap.context(() => {
      gsap.set([heading, textBlock, process], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(textBlock, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15')
        .to(process, { opacity: 1, duration: 0.35, ease: 'power1.out' }, '-=0.15');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cbam-overview"
      aria-labelledby="cbam-overview-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-10 sm:py-14 lg:py-18"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
        {/* Left Column: Heading + Narrative Paragraphs */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
          <h2
            ref={headingRef}
            id="cbam-overview-heading"
            className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[46px] font-normal leading-[1.14] tracking-[-0.02em] text-[#082046]"
          >
            {content.heading}
          </h2>

          <div ref={textBlockRef} className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
            {content.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base lg:text-[16px] text-[#475569] leading-relaxed font-normal max-w-xl"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Right Column: 4-Step Horizontal Process Flow */}
        <div
          ref={processRef}
          className="lg:col-span-7 xl:col-span-7 flex justify-center lg:justify-end w-full"
        >
          <div className="w-full max-w-[620px] xl:max-w-[680px]">
            {/* Desktop / Tablet Horizontal Stepper */}
            <div className="hidden sm:flex items-start justify-between relative w-full">
              {content.processSteps.map((step, idx) => {
                const isActive = activeStepId === step.id;
                const isLast = idx === content.processSteps.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Node */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${step.title} process step`}
                      aria-pressed={isActive}
                      onMouseEnter={() => setActiveStepId(step.id)}
                      onFocus={() => setActiveStepId(step.id)}
                      className="flex flex-col items-center group cursor-pointer focus:outline-none z-10 select-none"
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-18 h-18 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs relative ${
                          isActive
                            ? 'bg-gradient-to-br from-[#0B1642] via-[#0F2256] to-[#1F3D78] text-white shadow-md'
                            : 'bg-white border border-slate-200/90 text-[#082046] hover:bg-[#F4F7FD] hover:border-slate-300'
                        }`}
                      >
                        <CbamIcon
                          iconKey={step.iconKey}
                          size={32}
                          weight={isActive ? 'bold' : 'regular'}
                          className={`transition-transform duration-200 ${
                            isActive ? 'text-white' : 'text-[#082046]'
                          }`}
                        />
                      </div>

                      {/* Step Title Label */}
                      <span
                        className={`text-xs sm:text-[13.5px] lg:text-[14px] text-center font-medium mt-3.5 max-w-[105px] sm:max-w-[125px] leading-tight transition-colors duration-200 ${
                          isActive ? 'text-[#082046] font-semibold' : 'text-[#475569]'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    {/* Step Connector Line (Between Nodes) */}
                    {!isLast && (
                      <div
                        className="flex-1 flex items-center justify-center px-1.5 sm:px-2 pt-9 sm:pt-10 lg:pt-11"
                        aria-hidden="true"
                      >
                        <div className="w-full flex items-center justify-center relative">
                          <div className="w-full h-[1px] bg-slate-300/80" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile Adaptive 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-4 sm:hidden w-full">
              {content.processSteps.map((step) => {
                const isActive = activeStepId === step.id;

                return (
                  <div
                    key={step.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveStepId(step.id)}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#0B1642] via-[#0F2256] to-[#1F3D78] text-white border-[#1F3D78] shadow-sm'
                        : 'bg-white border-slate-200/90 text-[#082046]'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-[#F4F7FD] text-[#082046]'
                      }`}
                    >
                      <CbamIcon
                        iconKey={step.iconKey}
                        size={24}
                        weight={isActive ? 'bold' : 'regular'}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium leading-tight ${
                        isActive ? 'text-white' : 'text-[#082046]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
