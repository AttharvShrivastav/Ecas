import React, { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface RouteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  descId?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * RouteDetailModal Component
 *
 * Shared accessible route-backed modal overlay primitive.
 * - Semantic dialog attributes (role="dialog", aria-modal="true")
 * - Focus trapping & Escape key listener
 * - Body scroll lock on mount & cleanup on unmount
 * - Focus restoration to previously focused element
 * - Restrained GSAP opacity fade in/out (respects prefers-reduced-motion)
 * - Backdrop click to dismiss
 */
export const RouteDetailModal: React.FC<RouteDetailModalProps> = ({
  isOpen,
  onClose,
  titleId,
  descId,
  maxWidthClass = 'max-w-2xl',
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusedElement = useRef<HTMLElement | null>(null);

  // Capture previously focused element on mount
  useEffect(() => {
    prevFocusedElement.current = document.activeElement as HTMLElement | null;
  }, []);

  // Lock body scroll and handle Escape / Tab navigation
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap within modal
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
      clearTimeout(timer);
      prevFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  // Restrained GSAP opacity fade
  useEffect(() => {
    if (!isOpen || !overlayRef.current || !modalBoxRef.current) return;

    const overlay = overlayRef.current;
    const box = modalBoxRef.current;

    if (prefersReducedMotion()) {
      overlay.style.opacity = '1';
      box.style.opacity = '1';
    } else {
      gsap.killTweensOf([overlay, box]);
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.22, ease: 'power1.out' }
      );
      gsap.fromTo(
        box,
        { opacity: 0 },
        { opacity: 1, duration: 0.26, ease: 'power1.out', delay: 0.04 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="presentation"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-slate-900/60 backdrop-blur-[2px] transition-opacity"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative w-full ${maxWidthClass} max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-48px)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-[#082046] my-auto`}
      >
        {/* Top-Right Accessible Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close detail modal"
          className="absolute top-3.5 sm:top-5 right-3.5 sm:right-5 z-30 p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-[#082046] hover:bg-slate-100/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#082046]/30"
        >
          <X size={20} weight="bold" />
        </button>

        {children}
      </div>
    </div>
  );
};
