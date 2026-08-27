import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';
import { FAQAccordionItem } from './FAQAccordionItem';
import { defaultFAQContent } from '../../cms/homeContent';
import type { HomeFAQContent } from '../../cms/types';

export interface HomeFAQSectionProps {
  content?: HomeFAQContent;
}

/**
 * HomeFAQSection Component
 *
 * "Commonly Asked Questions" Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshot
 * - Left Column: Semantic <h2> heading + supporting copy aligned top with whitespace below
 * - Right Column: Stacked accordion items with confirmed #90B3F0 @ 21% number badges
 * - Initial state: First item expanded by default, remaining collapsed
 * - Single active accordion behavior (switching items smoothly)
 * - Restrained GSAP entrance: OPACITY ONLY (heading -> description -> items stagger)
 * - Full accessibility (<button>, aria-expanded, aria-controls, keyboard navigation)
 * - SEO/AEO crawlable DOM markup
 */
export const HomeFAQSection: React.FC<HomeFAQSectionProps> = ({
  content = defaultFAQContent,
}) => {
  const [activeId, setActiveId] = useState<string | null>(
    content.items[0]?.id || null
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const cards = listRef.current?.querySelectorAll('.faq-accordion-card');

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
        // 2. Supporting paragraph fades in shortly after
        .to(
          desc,
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.15'
        );

      // 3. FAQ items fade in sequentially from top to bottom
      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.28,
            stagger: 0.07,
            ease: 'power1.out',
          },
          '-=0.1'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-20 sm:pb-28 lg:pb-36"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Heading and Supporting Copy */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28">
          <h2
            ref={headingRef}
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.15] tracking-[-0.02em] text-[#0B1642] whitespace-pre-line mb-4 sm:mb-6"
          >
            {content.heading}
          </h2>

          <p
            ref={descRef}
            className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-md font-normal"
          >
            {content.description}
          </p>
        </div>

        {/* Right Column: Vertically Stacked Accordion Items */}
        <div
          ref={listRef}
          className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3.5 sm:gap-4"
        >
          {content.items.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={activeId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
