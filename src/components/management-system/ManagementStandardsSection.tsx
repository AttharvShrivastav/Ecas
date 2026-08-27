import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import { ManagementStandardCard } from './ManagementStandardCard';
import { defaultManagementStandardsSectionContent } from '../../cms/managementSystemContent';
import type { ManagementStandardsSectionContent } from '../../cms/types';

export interface ManagementStandardsSectionProps {
  content?: ManagementStandardsSectionContent;
}

/**
 * ManagementStandardsSection Component
 *
 * Source of Truth: Approved Management System Certification Figma Screenshot
 * - Top-left: Section <h2> heading + supporting copy (CMS placeholder)
 * - Top-right: Frontend search bar ("Search Courses or Standards")
 * - 3-Column desktop grid with numbered standard cards (1-13)
 * - See Detail links to route-backed detail modal (/services/management-system-certification/:slug)
 * - Search highlighting: Pale blue/lavender surface for matches, subdued for non-matches
 * - Restrained GSAP entrance: OPACITY ONLY (heading -> description -> search -> cards stagger)
 */
export const ManagementStandardsSection: React.FC<ManagementStandardsSectionProps> = ({
  content = defaultManagementStandardsSectionContent,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // GSAP animation refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  // Lightweight debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 120);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Entrance Motion (Opacity only)
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const searchBox = searchBoxRef.current;
    const cards = gridContainerRef.current?.querySelectorAll('.standard-card');

    const ctx = gsap.context(() => {
      gsap.set([heading, desc, searchBox], { opacity: 0 });
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(desc, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15')
        .to(searchBox, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.2');

      if (cards && cards.length > 0) {
        tl.to(
          cards,
          {
            opacity: 1,
            duration: 0.25,
            stagger: 0.04,
            ease: 'power1.out',
          },
          '-=0.1'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Evaluate matches
  const { matchingIds, isSearching, hasNoMatches } = useMemo(() => {
    if (!debouncedQuery) {
      return {
        matchingIds: new Set<string>(),
        isSearching: false,
        hasNoMatches: false,
      };
    }

    const matches = new Set<string>();
    content.standards.forEach((std) => {
      const titleMatch = std.title.toLowerCase().includes(debouncedQuery);
      const numberMatch = std.number.toLowerCase().includes(debouncedQuery);
      const descMatch = std.shortDescription.toLowerCase().includes(debouncedQuery);
      const keywordMatch = std.keywords?.some((k) => k.toLowerCase().includes(debouncedQuery));

      if (titleMatch || numberMatch || descMatch || keywordMatch) {
        matches.add(std.id);
      }
    });

    return {
      matchingIds: matches,
      isSearching: true,
      hasNoMatches: matches.size === 0,
    };
  }, [debouncedQuery, content.standards]);

  return (
    <section
      ref={sectionRef}
      id="management-standards"
      aria-labelledby="management-standards-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-12 sm:py-16 lg:py-20"
    >
      {/* Top Header Row: Heading, Description & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start justify-between">
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h2
            ref={headingRef}
            id="management-standards-heading"
            className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046] whitespace-pre-line"
          >
            {content.heading}
          </h2>
          <p
            ref={descRef}
            className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed max-w-2xl font-normal"
          >
            {content.description}
          </p>
        </div>

        {/* Right Column: Search Input */}
        <div
          ref={searchBoxRef}
          className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end w-full"
        >
          <div className="relative w-full max-w-md lg:max-w-[340px] xl:max-w-[380px]">
            <label htmlFor="standards-search-input" className="sr-only">
              {content.searchPlaceholder}
            </label>
            <input
              id="standards-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full bg-white border border-slate-200/90 rounded-lg sm:rounded-xl pl-3.5 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-[#082046] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 focus:border-[#032E64] transition-all shadow-2xs"
            />

            {/* Phosphor Clear or Search Icon */}
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label="Clear standards search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            ) : (
              <div
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              >
                <MagnifyingGlass size={18} />
              </div>
            )}
          </div>

          {/* Gentle No Results Label without removing cards from the DOM */}
          {hasNoMatches && (
            <p
              role="status"
              className="text-xs text-slate-500 mt-2 font-normal animate-fade-in"
            >
              {content.noResultsText || 'No matching standards found.'}
            </p>
          )}
        </div>
      </div>

      {/* 3-Column Desktop Grid for Standards Cards */}
      <div
        ref={gridContainerRef}
        role="list"
        aria-label="Management system certification standards list"
        className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
      >
        {content.standards.map((standard) => {
          const isMatch = isSearching && matchingIds.has(standard.id);
          const isSubdued = isSearching && !matchingIds.has(standard.id);

          return (
            <ManagementStandardCard
              key={standard.id}
              standard={standard}
              isMatch={isMatch}
              isSubdued={isSubdued}
            />
          );
        })}
      </div>
    </section>
  );
};
