import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import type { ManagementStandard } from '../../cms/types';

export interface ManagementStandardCardProps {
  standard: ManagementStandard;
  isMatch: boolean;
  isSubdued: boolean;
}

/**
 * ManagementStandardCard Component
 *
 * Source of Truth: Approved standards card visual reference screenshot & styling guidelines
 * - Default card state: Neutral light card surface (white/clean off-white), subtle border, not highlighted
 * - Highlighted card state: Soft pale blue/lavender gradient (from-[#F2F6FE] to-[#E3ECFD]) with subtle border and focus ring applied ONLY when matching search query
 * - Non-matching card state (when searching): Neutral state with reduced emphasis (opacity-35)
 * - Taller card footprint (min-h-[360px] to min-h-[390px]) for ample breathing room
 * - Increased vertical spacing between the numbered circular badge and the card heading (mb-10 sm:mb-12)
 * - See Detail is a real Link to `/services/management-system-certification/:slug` with route-backed modal state
 */
export const ManagementStandardCard: React.FC<ManagementStandardCardProps> = ({
  standard,
  isMatch,
  isSubdued,
}) => {
  const location = useLocation();

  return (
    <article
      role="listitem"
      className={`standard-card relative w-full rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 border cursor-default select-none min-h-[350px] sm:min-h-[380px] lg:min-h-[400px] ${
        isMatch
          ? 'bg-gradient-to-b from-[#F2F6FE] to-[#E3ECFD] border-[#BED4F8] shadow-sm ring-2 ring-[#BED4F8]/80'
          : isSubdued
          ? 'bg-white/80 border-slate-200/60 opacity-35'
          : 'bg-white border-slate-200/90 hover:bg-[#F9FBFF] hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex flex-col">
        {/* Top-Left: Small Numbered Circular Badge with generous bottom spacing */}
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#10214D] via-[#1E3A7E] to-[#4572B2] text-white flex items-center justify-center text-sm sm:text-base font-bold shadow-2xs shrink-0 select-none"
            aria-label={`Standard number ${standard.number}`}
          >
            {standard.number}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#081A44] leading-snug tracking-tight">
          {standard.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-[13.5px] text-[#475569] leading-relaxed mt-3 sm:mt-4 line-clamp-4 font-normal">
          {standard.shortDescription}
        </p>
      </div>

      {/* Bottom CTA Link: Wide Rounded Rectangle with Left-to-Right Blue Gradient */}
      <div className="mt-8 sm:mt-10 pt-2">
        <Link
          to={`/services/management-system-certification/${standard.slug}`}
          state={{ backgroundLocation: location }}
          aria-label={`See details for ${standard.title}`}
          className="group w-full flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#0F1B4A] via-[#1C3372] to-[#5983BD] hover:opacity-95 active:scale-[0.99] text-white transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0F1B4A]/30"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            See Detail
          </span>
          <ArrowRight
            size={17}
            weight="bold"
            className="text-white transform group-hover:translate-x-0.5 transition-transform duration-200 shrink-0"
          />
        </Link>
      </div>
    </article>
  );
};

