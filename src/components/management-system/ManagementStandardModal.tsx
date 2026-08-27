import React, { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { ManagementStandard } from '../../cms/types';

export interface ManagementStandardModalProps {
  isOpen: boolean;
  standard: ManagementStandard | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * ManagementStandardModal Component
 *
 * A single reusable, fully accessible modal component for standard details.
 * - Semantic dialog structure (role="dialog", aria-modal="true")
 * - Focus trap & returns focus to the triggering "See Detail" button on close
 * - Body scroll lock while open
 * - Escape key & backdrop click handling
 * - Phosphor Icons for close button
 * - Restrained GSAP opacity fade in/out animation (respects prefers-reduced-motion)
 * - CMS-driven content with clean hiding of empty sections
 */
export const ManagementStandardModal: React.FC<ManagementStandardModalProps> = ({
  isOpen,
  standard,
  onClose,
  triggerRef,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Save previous overflow style
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timeoutId = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Simple focus trap inside modal
      if (e.key === 'Tab' && modalBoxRef.current) {
        const focusableElements = modalBoxRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
      // Return focus to triggering button
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  // GSAP Opacity entrance/exit
  useEffect(() => {
    if (!overlayRef.current || !modalBoxRef.current) return;

    const overlay = overlayRef.current;
    const modalBox = modalBoxRef.current;

    if (isOpen) {
      if (prefersReducedMotion()) {
        overlay.style.opacity = '1';
        modalBox.style.opacity = '1';
      } else {
        gsap.killTweensOf([overlay, modalBox]);
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'power1.out' }
        );
        gsap.fromTo(
          modalBox,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power1.out', delay: 0.05 }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen || !standard) {
    return null;
  }

  const modalData = standard.modal;
  const hasOverview = Boolean(modalData?.overview?.trim());
  const hasApplicability = Boolean(modalData?.applicability?.trim());
  const hasFocusAreas = Boolean(modalData?.focusAreas && modalData.focusAreas.length > 0);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-slate-900/60 backdrop-blur-[2px] transition-opacity"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="standard-modal-title"
        aria-describedby="standard-modal-summary"
        className="relative w-full max-w-2xl max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-48px)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-[#082046] my-auto"
      >
        {/* Top Header Bar */}
        <div className="shrink-0 flex items-start justify-between gap-3 sm:gap-4 p-5 sm:p-7 md:p-8 pb-4 sm:pb-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Number Marker */}
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#082046] text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0"
              aria-hidden="true"
            >
              {standard.number}
            </div>

            {/* Standard Title */}
            <h2
              id="standard-modal-title"
              className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#082046] leading-snug"
            >
              {standard.title}
            </h2>
          </div>

          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${standard.title} details`}
            className="text-slate-400 hover:text-[#082046] p-1.5 sm:p-2 rounded-full hover:bg-slate-100/90 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#082046]/30"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain">
          {/* Summary */}
          <p
            id="standard-modal-summary"
            className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal"
          >
            {standard.shortDescription}
          </p>

          {/* Overview Section */}
          {hasOverview && (
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2">
                Overview
              </h3>
              <p className="text-sm sm:text-[15px] text-[#082046] leading-relaxed font-normal">
                {modalData?.overview}
              </p>
            </div>
          )}

          {/* Applicability Section */}
          {hasApplicability && (
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2">
                Applicability
              </h3>
              <p className="text-sm sm:text-[15px] text-[#082046] leading-relaxed font-normal">
                {modalData?.applicability}
              </p>
            </div>
          )}

          {/* Key Focus Areas */}
          {hasFocusAreas && (
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2.5">
                Key Focus Areas
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#082046]">
                {modalData?.focusAreas?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#032E64] mt-1.5 shrink-0" />
                    <span className="leading-snug font-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Close Action */}
        <div className="shrink-0 p-4 sm:p-5 sm:px-8 border-t border-slate-100 bg-slate-50/90 flex justify-end z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#082046] bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#082046]/30 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
