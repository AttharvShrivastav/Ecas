import React, { useState, useRef, useLayoutEffect } from 'react';
import { CaretRight, Plus } from '@phosphor-icons/react';
import { Button } from '../primitives/Button';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type {
  ProductCertificationExplorerContent,
  ProductCertificationScheme,
} from '../../cms/types';

export interface CertificationExplorerSectionProps {
  content: ProductCertificationExplorerContent;
  activeSchemeId?: string;
  onActiveSchemeChange?: (schemeId: string) => void;
}

/**
 * Tab-based Product Certification Route Explorer
 *
 * Source of Truth: Approved ECASEURO Architecture & Reference Layout
 * - Desktop: Asymmetric 2-column composition (Left Tab Selector | Right Active Panel)
 * - Mobile: Horizontally scrollable tab pills with visible active state
 * - Tab switching: Restrained GSAP opacity fade
 * - Active Scheme: Clean, static, non-collapsible numbered groups for frictionless reading
 * - Contextual CTA at the bottom routing to /contact with query parameters
 */
export const CertificationExplorerSection: React.FC<CertificationExplorerSectionProps> = ({
  content,
  activeSchemeId: controlledActiveId,
  onActiveSchemeChange,
}) => {
  const schemes = content.schemes;
  const defaultScheme = schemes[0];

  const [internalActiveId, setInternalActiveId] = useState<string>(
    controlledActiveId || defaultScheme?.id || 'ce-marking'
  );

  const activeId = controlledActiveId || internalActiveId;
  const activeScheme = schemes.find((s) => s.id === activeId || s.slug === activeId) || defaultScheme;

  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);

  // Handle Tab Switch with restrained GSAP fade & scroll to top of explorer if scrolled past
  const handleSchemeSelect = (schemeId: string) => {
    if (schemeId === activeId) return;

    // Check if user has scrolled past the top of the explorer panel
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      // If the top of the section is above the visible navbar offset (e.g. < 80px), scroll back smoothly
      if (rect.top < 60) {
        const targetTop = window.scrollY + rect.top - 90;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      }
    }

    if (panelRef.current && !prefersReducedMotion()) {
      gsap.to(panelRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: 'power1.out',
        onComplete: () => {
          if (onActiveSchemeChange) {
            onActiveSchemeChange(schemeId);
          } else {
            setInternalActiveId(schemeId);
          }
          gsap.to(panelRef.current, {
            opacity: 1,
            duration: 0.25,
            ease: 'power1.in',
          });
        },
      });
    } else {
      if (onActiveSchemeChange) {
        onActiveSchemeChange(schemeId);
      } else {
        setInternalActiveId(schemeId);
      }
    }
  };

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % schemes.length;
      handleSchemeSelect(schemes[nextIndex].id);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + schemes.length) % schemes.length;
      handleSchemeSelect(schemes[nextIndex].id);
    }
  };

  // Entrance motion: Opacity only
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      const headingBlock = section.querySelector('.explorer-header-block');
      const tabs = section.querySelector('.explorer-tab-list');
      const panel = panelRef.current;

      gsap.set([headingBlock, tabs, panel].filter(Boolean), { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });

      tl.to(headingBlock, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(tabs, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15')
        .to(panel, { opacity: 1, duration: 0.35, ease: 'power1.out' }, '-=0.15');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certification-explorer"
      aria-labelledby="explorer-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-12 sm:py-16 lg:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column (5 cols on lg): Sticky Route Selector Column */}
        <div className="lg:col-span-5 w-full flex flex-col lg:sticky lg:top-28">
          {/* Header block */}
          <div className="explorer-header-block">
            <h2
              id="explorer-heading"
              className="text-2xl sm:text-3xl lg:text-[34px] font-normal leading-[1.15] tracking-tight text-[#082046] whitespace-pre-line"
            >
              {content.heading}
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed font-normal max-w-xl">
              {content.description}
            </p>
          </div>

          {/* Desktop & Mobile Tab Selector */}
          <div className="explorer-tab-list mt-8 sm:mt-10">
            {/* Mobile / Tablet Horizontal Scroll Tabs (< lg screens) */}
            <div className="lg:hidden w-full overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none flex gap-2.5">
              <div role="tablist" aria-orientation="horizontal" className="flex gap-2.5 min-w-max">
                {schemes.map((scheme, index) => {
                  const isActive = scheme.id === activeScheme.id || scheme.slug === activeScheme.slug;
                  return (
                    <button
                      key={scheme.id}
                      role="tab"
                      id={`tab-mobile-${scheme.slug || scheme.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${scheme.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleSchemeSelect(scheme.slug || scheme.id)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0F1B4A] to-[#6B96CC] text-white shadow-xs'
                          : 'bg-white border border-[#E2E8F0] text-[#082046] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {scheme.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Vertical Tab List (>= lg screens) */}
            <div
              ref={tabListRef}
              role="tablist"
              aria-orientation="vertical"
              className="hidden lg:flex flex-col space-y-3 w-full"
            >
              {schemes.map((scheme, index) => {
                const isActive = scheme.id === activeScheme.id || scheme.slug === activeScheme.slug;
                return (
                  <button
                    key={scheme.id}
                    role="tab"
                    id={`tab-desktop-${scheme.slug || scheme.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${scheme.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleSchemeSelect(scheme.slug || scheme.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0F1B4A] to-[#6B96CC] text-white shadow-xs'
                        : 'bg-white border border-[#E2E8F0] text-[#082046] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-medium tracking-tight pr-3">
                      {scheme.name}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-[#64748B] group-hover:text-[#082046]'
                      }`}
                    >
                      {isActive ? (
                        <CaretRight size={16} weight="bold" aria-hidden="true" />
                      ) : (
                        <Plus size={16} weight="bold" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols on lg): Active Scheme Panel */}
        <div className="lg:col-span-7 w-full">
          <div
            ref={panelRef}
            id={`panel-${activeScheme.id}`}
            role="tabpanel"
            aria-labelledby={`tab-desktop-${activeScheme.id}`}
            className="bg-white rounded-2xl sm:rounded-[20px] p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-xs relative"
          >
            {/* Scheme Header */}
            <div className="flex items-start gap-4 sm:gap-5 pb-6 border-b border-[#E2E8F0]">
              {/* Scheme Monogram Badge */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#082046] text-white font-bold flex items-center justify-center text-sm sm:text-base tracking-tight shrink-0 shadow-xs"
                aria-hidden="true"
              >
                {activeScheme.badgeLabel || activeScheme.name.slice(0, 3)}
              </div>

              {/* Title & Region */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-normal text-[#082046] tracking-tight">
                  {activeScheme.name}
                </h3>
                {activeScheme.region && (
                  <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                    {activeScheme.region}
                  </p>
                )}
              </div>
            </div>

            {/* Scheme Summary */}
            <p className="mt-5 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed">
              {activeScheme.summary}
            </p>

            {/* Static Content Groups (Visible by default, no accordions) */}
            <div className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4">
              {activeScheme.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="border border-[#E2E8F0] rounded-xl sm:rounded-2xl bg-[#F8FAFC]/70 p-4 sm:p-5 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    {topic.number && (
                      <span
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-[#0B1642] bg-[#E2E8F0]/80"
                        aria-hidden="true"
                      >
                        {topic.number}
                      </span>
                    )}
                    <h4 className="text-sm sm:text-base font-medium text-[#082046] tracking-tight">
                      {topic.title}
                    </h4>
                  </div>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {topic.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Contextual CTA */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button
                variant="primary"
                href={
                  activeScheme.ctaUrl ||
                  `/contact?service=product-certification&scheme=${activeScheme.slug}`
                }
              >
                {activeScheme.ctaLabel || `DISCUSS ${activeScheme.name.toUpperCase()}`}
              </Button>
            </div>
          </div>

          {/* Hidden semantic content of inactive schemes for crawlers / SEO */}
          <div className="sr-only" aria-hidden="true">
            {schemes
              .filter((s) => s.id !== activeScheme.id)
              .map((s) => (
                <article key={s.id}>
                  <h3>{s.name}</h3>
                  <p>{s.region}</p>
                  <p>{s.summary}</p>
                  <div>
                    {s.topics.map((t) => (
                      <div key={t.id}>
                        <h4>{t.title}</h4>
                        <p>{t.content}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
