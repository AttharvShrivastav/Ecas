import React, { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';
import { TestimonialCard } from './TestimonialCard';
import { defaultTestimonialsContent } from '../../cms/homeContent';
import type { HomeTestimonialsContent } from '../../cms/types';

export interface HomeTestimonialsSectionProps {
  content?: HomeTestimonialsContent;
}

/**
 * HomeTestimonialsSection Component
 *
 * "See what our clients say about us" Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Testimonial Prototype
 * - Top Row: Semantic <h2> heading on left, supporting <p> description on right
 * - Bottom Row: 4 equal-width tall testimonial cards in a responsive grid
 * - GSAP Entrance: Strict OPACITY ONLY (no positional movement, scaling, or parallax)
 * - Semantic markup: <section>, <h2>, <p>, <blockquote>, <cite>
 * - Fully CMS-ready and responsive
 */
export const HomeTestimonialsSection: React.FC<HomeTestimonialsSectionProps> = ({
  content = defaultTestimonialsContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const cards = gridRef.current?.querySelectorAll('.testimonial-grid-card');

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
        // 2. Right supporting paragraph fades in shortly after
        .to(
          desc,
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.15'
        );

      // 3. Four testimonial cards fade in sequentially
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
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-20 sm:pb-28 lg:pb-36"
    >
      {/* Top Row: Heading (Left) and Supporting Copy (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-10 sm:mb-12 lg:mb-14">
        {/* Left Column: Semantic <h2> Heading */}
        <div className="lg:col-span-6 xl:col-span-6">
          <h2
            ref={headingRef}
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.16] tracking-[-0.02em] text-[#0B1642] whitespace-pre-line"
          >
            {content.heading}
          </h2>
        </div>

        {/* Right Column: Supporting Description */}
        <div className="lg:col-span-6 xl:col-span-6 flex justify-start lg:justify-end">
          <p
            ref={descRef}
            className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl font-normal"
          >
            {content.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: 4 Equal-Width Testimonial Cards */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch"
      >
        {content.testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};
