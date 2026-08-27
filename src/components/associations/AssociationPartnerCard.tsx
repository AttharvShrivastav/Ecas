import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { AssociationPartner } from '../../cms/types';

export interface AssociationPartnerCardProps {
  partner: AssociationPartner;
}

/**
 * AssociationPartnerCard Component
 *
 * Source of Truth: Approved Associations Partner Reference Card
 *
 * Target Layout:
 * ┌─────────────────────────────┐
 * │ LOGO                        │
 * │                             │
 * │                             │
 * │ Partner Name                │
 * │ Location                    │
 * │                             │
 * │ [ View profile         → ]  │
 * │                             │
 * │ Visit website           ↗   │
 * └─────────────────────────────┘
 *
 * Visual & Interaction Rules:
 * - Default: Light neutral surface (#F4F7FD or white with subtle border), dark navy typography
 * - Hover / Focus: Smooth reversible GSAP timeline fading in CTA gradient (#0F1B4A → #6B96CC)
 *   and adjusting typography to light/white
 * - No card lift, tilt, scale, blur, or y movement
 * - View profile: Real route-backed Link with backgroundLocation
 * - Visit website: Real external anchor with target="_blank" rel="noopener noreferrer"
 * - Logo: Loaded from /images/associations/ with fallback text badge
 */
export const AssociationPartnerCard: React.FC<AssociationPartnerCardProps> = ({ partner }) => {
  const location = useLocation();
  const [imgError, setImgError] = useState(false);

  const isGrayscale = Boolean(partner.useGrayscaleLogo ?? partner.grayscaleOnHover);

  const cardRef = useRef<HTMLElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const locRef = useRef<HTMLParagraphElement | null>(null);
  const viewProfileBtnRef = useRef<HTMLDivElement | null>(null);
  const websiteLinkRef = useRef<HTMLAnchorElement | null>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (
      !cardRef.current ||
      !gradientRef.current ||
      !nameRef.current ||
      !viewProfileBtnRef.current
    )
      return;

    const gradient = gradientRef.current;
    const nameEl = nameRef.current;
    const locEl = locRef.current;
    const viewProfileBtn = viewProfileBtnRef.current;
    const websiteLink = websiteLinkRef.current;
    const logoEl = logoRef.current;

    gsap.set(gradient, { opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(gradient, { opacity: 1, duration: 0.28, ease: 'power1.out' }, 0)
      .to(nameEl, { color: '#FFFFFF', duration: 0.25, ease: 'power1.out' }, 0);

    if (locEl) {
      tl.to(locEl, { color: '#CBD5E1', duration: 0.25, ease: 'power1.out' }, 0);
    }

    if (logoEl && isGrayscale) {
      tl.to(
        logoEl,
        {
          filter: 'grayscale(1) brightness(0) invert(1)',
          duration: 0.25,
          ease: 'power1.out',
        },
        0
      );
    }

    tl.to(
      viewProfileBtn,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        color: '#FFFFFF',
        duration: 0.25,
        ease: 'power1.out',
      },
      0
    );

    if (websiteLink) {
      tl.to(websiteLink, { color: '#FFFFFF', duration: 0.25, ease: 'power1.out' }, 0);
    }

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [isGrayscale]);

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) {
      if (gradientRef.current) gradientRef.current.style.opacity = '1';
      if (nameRef.current) nameRef.current.style.color = '#FFFFFF';
      if (locRef.current) locRef.current.style.color = '#CBD5E1';
      if (logoRef.current && isGrayscale) {
        logoRef.current.style.filter = 'grayscale(1) brightness(0) invert(1)';
      }
      return;
    }
    tlRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) {
      if (gradientRef.current) gradientRef.current.style.opacity = '0';
      if (nameRef.current) nameRef.current.style.color = '#081A44';
      if (locRef.current) locRef.current.style.color = '#64748B';
      if (logoRef.current && isGrayscale) {
        logoRef.current.style.filter = 'none';
      }
      return;
    }
    tlRef.current?.reverse();
  };

  return (
    <article
      ref={cardRef}
      role="listitem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="partner-card group relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs cursor-default select-none flex flex-col justify-between min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] transition-all"
    >
      {/* 1. Base light pale/white surface */}
      <div className="absolute inset-0 bg-white" />

      {/* 2. Gradient overlay for hover/focus (CTA gradient: #0F1B4A → #1F3D78 → #6B96CC) */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-[#0F1B4A] via-[#1E3A7E] to-[#5B88C4] opacity-0 pointer-events-none transition-opacity duration-200"
      />

      {/* 3. Content layout container */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
        {/* Top Row: Partner Logo (left, 30-45% larger with natural aspect ratio) */}
        <div className="flex items-center">
          <div className="h-16 sm:h-18 lg:h-20 max-w-[200px] sm:max-w-[240px] flex items-center justify-start">
            {partner.logo && !imgError ? (
              <img
                ref={logoRef}
                src={partner.logo}
                alt={partner.logoAlt || `${partner.name} logo`}
                onError={() => setImgError(true)}
                className={`max-h-16 sm:max-h-18 lg:max-h-20 w-auto max-w-full object-contain object-left transition-[filter] duration-200 ${
                  isGrayscale ? 'group-hover:grayscale group-hover:brightness-0 group-hover:invert' : ''
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-12 px-4 rounded-xl bg-slate-100/90 border border-slate-200 text-[#081A44] flex items-center justify-center font-bold text-base tracking-wide shadow-2xs">
                {partner.name}
              </div>
            )}
          </div>
        </div>

        {/* Middle breathing spacer */}
        <div className="flex-1 min-h-[50px] sm:min-h-[70px]" />

        {/* Lower Portion: Name, Location, View Profile Link, Visit Website */}
        <div className="mt-auto flex flex-col gap-4 sm:gap-5">
          {/* Partner Name & Location */}
          <div>
            <h3
              ref={nameRef}
              className="text-lg sm:text-xl font-bold text-[#081A44] leading-snug tracking-tight transition-colors"
            >
              {partner.name}
            </h3>
            {partner.location && (
              <p
                ref={locRef}
                className="text-xs sm:text-sm text-[#64748B] font-medium mt-1 transition-colors"
              >
                {partner.location}
              </p>
            )}
          </div>

          {/* Action 1: View profile (Real route-backed link) */}
          <Link
            to={`/associations/${partner.slug}`}
            state={{ backgroundLocation: location }}
            aria-label={`View profile for ${partner.name}`}
            className="block focus:outline-none"
          >
            <div
              ref={viewProfileBtnRef}
              className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 text-[#081A44] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-2xs hover:border-slate-300"
            >
              <span>View profile</span>
              <ArrowRight
                size={17}
                weight="bold"
                className="transform group-hover:translate-x-0.5 transition-transform duration-200 shrink-0"
              />
            </div>
          </Link>

          {/* Action 2: Visit website (External link) */}
          {partner.websiteUrl && (
            <div className="pt-0.5">
              <a
                ref={websiteLinkRef}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${partner.name} external website (opens in new tab)`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#475569] hover:text-[#081A44] transition-colors focus:outline-none focus:underline"
              >
                <span>Visit website</span>
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
