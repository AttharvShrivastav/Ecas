import React, { useRef, useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { TestimonialItem } from '../../cms/types';

export interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

/**
 * TestimonialCard Component
 *
 * Source of Truth: Approved Figma Desktop Composition & Prototype Sequence
 * - Confirmed Default Gradient: #F2F5FB -> #F0F1FC
 * - Confirmed Hover Gradient: #F2F5FB -> #DCDEFA
 * - Layered gradient architecture with two absolutely positioned surfaces
 * - Reversible GSAP Timeline:
 *   1. Smoothly reveal hover gradient
 *   2. Testimonial copy slides downward (~40px)
 *   3. Outlined pale blue quotation mark reveals into newly created space
 * - Author block (avatar, name, organisation) remains firmly anchored at bottom
 * - Accessible, responsive, and prefers-reduced-motion compliant
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverLayerRef = useRef<HTMLDivElement | null>(null);
  const quoteTextRef = useRef<HTMLDivElement | null>(null);
  const quoteMarkRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) {
      return;
    }

    const hoverLayer = hoverLayerRef.current;
    const quoteText = quoteTextRef.current;
    const quoteMark = quoteMarkRef.current;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(hoverLayer, { opacity: 0 });
      gsap.set(quoteText, { y: 0 });
      gsap.set(quoteMark, { opacity: 0 });

      // Create paused, reversible timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      });

      // Step 1: Smoothly reveal hover gradient
      tl.to(
        hoverLayer,
        {
          opacity: 1,
          duration: 0.3,
        },
        0
      )
        // Step 2: Testimonial copy slides downward
        .to(
          quoteText,
          {
            y: 40,
            duration: 0.35,
          },
          0.08
        )
        // Step 3: Outlined quotation mark appears in top-left space
        .to(
          quoteMark,
          {
            opacity: 1,
            duration: 0.22,
          },
          0.22
        );

      tlRef.current = tl;
    }, cardRef);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  const handlePointerEnter = () => {
    if (!prefersReducedMotion()) {
      tlRef.current?.play();
    }
  };

  const handlePointerLeave = () => {
    if (!prefersReducedMotion()) {
      tlRef.current?.reverse();
    }
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="testimonial-grid-card relative w-full rounded-2xl sm:rounded-[24px] overflow-hidden min-h-[340px] sm:min-h-[360px] flex flex-col justify-between shadow-2xs border border-[#E2E8F0]/80 transition-shadow duration-300 hover:shadow-md cursor-default"
    >
      {/* Layer 1: Default Gradient Surface (#F2F5FB -> #F0F1FC) */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{ background: 'var(--gradient-testimonial-default)' }}
        aria-hidden="true"
      />

      {/* Layer 2: Hover Gradient Surface (#F2F5FB -> #DCDEFA) */}
      <div
        ref={hoverLayerRef}
        className="absolute inset-0 pointer-events-none select-none z-0 opacity-0"
        style={{ background: 'var(--gradient-testimonial-hover)' }}
        aria-hidden="true"
      />

      {/* Layer 3: Card Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7 flex-1">
        {/* Top Area: Quotation Mark + Sliding Testimonial Copy */}
        <div className="relative">
          {/* Decorative DM Serif Display Outlined Double Quotation Mark */}
          <span
            ref={quoteMarkRef}
            aria-hidden="true"
            className="text-[64px] sm:text-[72px] font-['DM_Serif_Display',serif] italic leading-none pointer-events-none select-none absolute -top-3 left-0 opacity-0 tracking-tight"
            style={{
              WebkitTextStroke: '1.75px #90B3F0',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            “
          </span>

          {/* Testimonial Quote Text */}
          <div ref={quoteTextRef} className="will-change-transform">
            <blockquote className="m-0 p-0">
              <p className="text-base sm:text-[17px] font-normal leading-[1.38] text-[#0F172A] tracking-[-0.01em]">
                {testimonial.quote}
              </p>
            </blockquote>
          </div>
        </div>

        {/* Bottom Area: Author Attribution Block (Pinned near bottom) */}
        <div className="flex items-center gap-3 pt-6 mt-auto shrink-0 select-none">
          {/* Avatar (CMS image or neutral coded avatar placeholder) */}
          <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-[#CBD5E1] overflow-hidden flex items-center justify-center shrink-0">
            {testimonial.image?.src ? (
              <img
                src={testimonial.image.src}
                alt={testimonial.image.alt || testimonial.personName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#E2E8F0] to-[#F1F5F9] flex items-center justify-center text-[#475569]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Author Name and Organisation */}
          <div className="flex flex-col min-w-0">
            <cite className="not-italic text-sm font-normal text-[#1E293B] leading-tight truncate">
              {testimonial.personName}
            </cite>
            {testimonial.organisation && (
              <span className="text-xs font-bold text-[#0F172A] tracking-wide uppercase leading-tight mt-0.5 truncate">
                {testimonial.organisation}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
