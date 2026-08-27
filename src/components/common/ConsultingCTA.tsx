import React, { useRef, useLayoutEffect } from 'react';
import { Button } from '../primitives/Button';
import { defaultConsultingCTAContent } from '../../cms/homeContent';
import type { ConsultingCTAContent } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface ConsultingCTAProps {
  content?: ConsultingCTAContent;
  headingLevel?: 'h2' | 'h3';
  id?: string;
}

/**
 * Reusable ConsultingCTA Component
 *
 * "Need Expert Help? / Get free consulting" Banner
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshot
 * - Wide rounded banner inset within #EEEEEE page
 * - Semantic CTA gradient #0F1B4A -> #6B96CC (bg-cta-gradient / --gradient-cta)
 * - Left: Multi-line display heading ("Need Expert Help?\nGet free consulting")
 * - Right: Supporting certification copy + "VERIFY TODAY" button
 * - Reuses existing production Button component with preserved GSAP hover
 * - Restrained entrance animation: Opacity only (heading -> copy -> button)
 * - Fully CMS-driven content
 */
export const ConsultingCTA: React.FC<ConsultingCTAProps> = ({
  content = defaultConsultingCTAContent,
  headingLevel = 'h2',
  id = 'consulting-cta',
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const button = buttonRef.current;

    const ctx = gsap.context(() => {
      // Set initial opacity ONLY (no y, x, scale, blur, or rotation)
      gsap.set([heading, desc, button], { opacity: 0 });

      // Entrance timeline triggered once on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        },
      });

      // 1. Heading fades in
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
        )
        // 3. Button fades in
        .to(
          button,
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.1'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const HeadingTag = headingLevel;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 relative z-20"
    >
      {/* Banner Card Container with Confirmed CTA Gradient */}
      <div className="relative w-full bg-cta-gradient rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden text-white px-6 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-11 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-6 xl:col-span-6">
            <HeadingTag
              ref={headingRef}
              id={`${id}-heading`}
              className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal leading-[1.14] tracking-[-0.02em] text-white whitespace-pre-line"
            >
              {content.heading}
            </HeadingTag>
          </div>

          {/* Right Column: Supporting Copy & Button */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start space-y-5 sm:space-y-6">
            <p
              ref={descRef}
              className="text-xs sm:text-[14px] lg:text-[15px] text-white/90 font-normal leading-relaxed max-w-xl"
            >
              {content.description}
            </p>

            <div ref={buttonRef}>
              <Button
                variant="primary"
                href={content.buttonHref}
                className="!bg-[#0B1642] hover:!bg-[#060F30] text-white shadow-sm"
              >
                {content.buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
