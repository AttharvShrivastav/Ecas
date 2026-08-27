import React, { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';
import { TrainingIcon } from './TrainingIconMap';
import { defaultFlexibleLearningSectionContent } from '../../cms/trainingContent';
import type { FlexibleLearningSectionContent } from '../../cms/types';

export interface TrainingFlexibleLearningSectionProps {
  content?: FlexibleLearningSectionContent;
}

/**
 * TrainingFlexibleLearningSection Component
 *
 * "Flexible learning, designed around your needs." Information Strip
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshot
 * - Inset rounded panel with subtle pale gradient (#DCDEFA -> #F2F5FB)
 * - Left side: <h2> heading + supporting copy
 * - Right side: 3-column delivery formats with white circular icon holders and vertical dividers
 * - Restrained GSAP entrance: OPACITY ONLY (heading -> description -> format items stagger)
 * - Safe Phosphor Icon mapping
 */
export const TrainingFlexibleLearningSection: React.FC<TrainingFlexibleLearningSectionProps> = ({
  content = defaultFlexibleLearningSectionContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const cards = itemsContainerRef.current?.querySelectorAll('.format-column');

    const ctx = gsap.context(() => {
      // Set initial state (OPACITY ONLY)
      gsap.set([heading, desc], { opacity: 0 });
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
      }

      // Restrained section entrance timeline triggered once on scroll
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
        // 2. Supporting copy fades in
        .to(
          desc,
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.15'
        );

      // 3. Format items fade in sequentially (OPACITY ONLY)
      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.28,
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
    <div className="w-full pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-12 md:pb-14 lg:pb-16 xl:pb-20 px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10">
      <section
        ref={sectionRef}
        id="flexible-learning"
        aria-labelledby="flexible-learning-heading"
        className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto bg-gradient-to-r from-[#DCDEFA]/85 via-[#E6EBF9] to-[#F2F5FB] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 border border-slate-200/70 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-4 xl:col-span-4">
            <h2
              ref={headingRef}
              id="flexible-learning-heading"
              className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-normal leading-[1.15] tracking-[-0.02em] text-[#082046] whitespace-pre-line"
            >
              {content.heading}
            </h2>
            <p
              ref={descRef}
              className="mt-4 sm:mt-6 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed max-w-sm font-normal"
            >
              {content.description}
            </p>
          </div>

          {/* Right Column: 3 Format Columns with Dividers */}
          <div
            ref={itemsContainerRef}
            className="lg:col-span-8 xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0"
          >
            {content.formats.map((format, idx) => (
              <div
                key={format.id}
                className="format-column flex flex-col items-center text-center md:border-l md:border-slate-300/60 first:md:border-l-0 md:px-3.5 lg:px-5 xl:px-7"
              >
                {/* Circular White Icon Badge */}
                <div
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center text-[#082046] shadow-xs mb-3.5 sm:mb-4.5 border border-white/90"
                  aria-hidden="true"
                >
                  <TrainingIcon iconKey={format.iconKey} size={24} weight="regular" />
                </div>

                {/* Format Title */}
                <h3 className="text-sm sm:text-base font-semibold text-[#082046] leading-snug whitespace-pre-line">
                  {format.title}
                </h3>

                {/* Format Description */}
                <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed mt-1.5 sm:mt-2 max-w-[210px] font-normal">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
