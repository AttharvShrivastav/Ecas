import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { InternationalMarketsSectionContent } from '../../cms/types';

export interface InternationalMarketSummarySectionProps {
  content: InternationalMarketsSectionContent;
  onSelectScheme: (schemeSlug: string) => void;
}

/**
 * Supporting Product Access Across International Markets Summary Section
 *
 * Source of Truth: Approved Layout & Secondary Explorer Navigation
 * - 5 compact summary cards (EQM, ECAS, G Mark, SASO, UKCA) linking to real scheme URLs
 * - Click activates tab in the Certification Route Explorer + smoothly scrolls up
 * - Restrained GSAP entrance: Opacity only
 */
export const InternationalMarketSummarySection: React.FC<
  InternationalMarketSummarySectionProps
> = ({ content, onSelectScheme }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = gridRef.current?.querySelectorAll('.market-summary-card');

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
            stagger: 0.06,
            ease: 'power1.out',
          },
          '-=0.15'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleClick = (e: React.MouseEvent, schemeSlug: string) => {
    // Let router link navigate, also trigger handler and smooth scroll to explorer panel
    onSelectScheme(schemeSlug);

    const explorerEl = document.getElementById('certification-explorer');
    if (explorerEl) {
      const rect = explorerEl.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top - 80;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });

      // Focus active tab for keyboard and assistive tech
      setTimeout(() => {
        const desktopTab = document.getElementById(`tab-desktop-${schemeSlug}`);
        const mobileTab = document.getElementById(`tab-mobile-${schemeSlug}`);
        if (desktopTab && window.innerWidth >= 1024) {
          desktopTab.focus();
        } else if (mobileTab) {
          mobileTab.focus();
        }
      }, 400);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="international-markets-summary"
      aria-labelledby="intl-markets-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-10 sm:py-14 lg:py-16"
    >
      <div className="flex flex-col">
        {/* Section Heading */}
        <h2
          ref={headingRef}
          id="intl-markets-heading"
          className="text-2xl sm:text-3xl lg:text-[32px] font-normal leading-[1.15] tracking-tight text-[#082046] max-w-2xl"
        >
          {content.heading}
        </h2>

        {/* 5-Column Responsive Grid with Real URLs */}
        <div
          ref={gridRef}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          {content.items.map((item) => (
            <Link
              key={item.id}
              to={`/services/product-certification/${item.schemeSlug}`}
              onClick={(e) => handleClick(e, item.schemeSlug)}
              className="market-summary-card group bg-white border border-[#E2E8F0] hover:border-[#032E64]/40 hover:shadow-xs rounded-xl sm:rounded-2xl p-5 sm:p-6 text-left flex flex-col justify-between transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64]"
              aria-label={`View ${item.name} certification details`}
            >
              <div>
                {/* Top Row: Monogram Badge & Action Icon */}
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#082046] text-white font-bold text-xs flex items-center justify-center tracking-tight shrink-0 shadow-2xs group-hover:bg-[#032E64] transition-colors">
                    {item.badgeLabel || item.name.slice(0, 3)}
                  </div>
                  <div className="text-[#94A3B8] group-hover:text-[#032E64] transition-colors">
                    <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                  </div>
                </div>

                {/* Scheme Title */}
                <h3 className="text-base sm:text-lg font-medium text-[#082046] mt-4 tracking-tight leading-snug">
                  {item.name}
                </h3>

                {/* Market Label */}
                <p className="text-xs font-medium text-[#64748B] mt-1.5 leading-snug">
                  {item.marketLabel}
                </p>

                {/* Summary */}
                <p className="text-xs text-[#475569] mt-3 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>

              {/* Bottom cue */}
              <div className="mt-5 pt-3 border-t border-[#F1F5F9] text-xs font-semibold text-[#032E64] flex items-center gap-1">
                <span>Explore Route</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
