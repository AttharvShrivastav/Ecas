import React, { useRef, useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { FAQItem } from '../../cms/types';

export interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * FAQAccordionItem Component
 *
 * Source of Truth: Approved Figma "Commonly Asked Questions" Accordion
 * - Number circle badge: #90B3F0 at 21% opacity (rgba(144, 179, 240, 0.21))
 * - Soft off-white / pale lavender surface (#F5F7FC)
 * - Accessible <button> trigger with aria-expanded & aria-controls
 * - Smooth GSAP height & opacity accordion animation
 * - Crawlable answer preserved in DOM
 */
export const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        gsap.set(contentRef.current, { height: 'auto', opacity: 1 });
      } else {
        gsap.set(contentRef.current, { height: 0, opacity: 0 });
      }
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(contentRef.current, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      });
      return;
    }

    if (isOpen) {
      gsap.fromTo(
        contentRef.current,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  const buttonId = `faq-btn-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className="faq-accordion-card w-full rounded-2xl sm:rounded-[20px] bg-[#F5F7FC] border border-[#E9EFF8] overflow-hidden transition-colors duration-200">
      {/* Accordion Trigger Button */}
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] focus-visible:ring-offset-2 select-none"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-3">
          {/* Number Circle Badge (#90B3F0 @ 21% opacity) */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 font-medium text-xs sm:text-sm text-[#0B1642]"
            style={{ backgroundColor: 'var(--faq-badge-bg, rgba(144, 179, 240, 0.21))' }}
            aria-hidden="true"
          >
            {item.number}
          </div>

          {/* Question Text */}
          <span className="text-[15px] sm:text-base lg:text-[17px] font-medium text-[#0B1642] leading-snug tracking-[-0.01em]">
            {item.question}
          </span>
        </div>

        {/* Plus / Minus Indicator */}
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-[#0B1642] transition-transform duration-200"
          aria-hidden="true"
        >
          {isOpen ? (
            <svg
              className="w-4 h-4 text-[#0B1642]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-[#0B1642]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="8" y1="3" x2="8" y2="13" />
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          )}
        </div>
      </button>

      {/* Answer Region (Crawlable in DOM, GSAP-animated height) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        ref={contentRef}
        className="overflow-hidden"
      >
        <div className="pl-[52px] sm:pl-[64px] lg:pl-[72px] pr-5 sm:pr-8 lg:pr-10 pb-5 sm:pb-6 pt-0">
          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed font-normal">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};
