import React, { useRef, useLayoutEffect } from 'react';
import { ProductCategoryIcon } from './ProductCategoryIcon';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { ProductCategoriesSectionContent } from '../../cms/types';

export interface CEProductCategoriesSectionProps {
  content: ProductCategoriesSectionContent;
}

/**
 * CE Marking Product Categories Section
 *
 * Source of Truth: Approved Layout & 3x3 Grid Specification
 * - Clean 3x3 grid on desktop (responsive on tablet and mobile)
 * - Compact outlined/light rectangular cards
 * - Phosphor icon + Category label
 * - Informational only (no links, no modals, no buttons)
 * - Restrained GSAP entrance: Opacity only
 */
export const CEProductCategoriesSection: React.FC<CEProductCategoriesSectionProps> = ({
  content,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = gridRef.current?.querySelectorAll('.category-card');

    const ctx = gsap.context(() => {
      gsap.set([heading, cards].filter(Boolean), { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out' });

      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power1.out',
          },
          '-=0.15'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ce-product-categories"
      aria-labelledby="ce-categories-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-10 sm:py-14 lg:py-16"
    >
      <div className="flex flex-col">
        {/* Section Heading */}
        <h2
          ref={headingRef}
          id="ce-categories-heading"
          className="text-2xl sm:text-3xl lg:text-[32px] font-normal leading-[1.15] tracking-tight text-[#082046] max-w-2xl"
        >
          {content.heading}
        </h2>

        {/* 3x3 Desktop Grid */}
        <div
          ref={gridRef}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {content.items.map((category) => (
            <div
              key={category.id}
              className="category-card bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-[#CBD5E1] transition-colors shadow-2xs"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F1F5F9] text-[#082046] flex items-center justify-center shrink-0">
                <ProductCategoryIcon iconKey={category.iconKey} size={22} weight="regular" />
              </div>
              <span className="text-sm sm:text-[15px] font-medium text-[#082046] tracking-tight leading-snug">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
