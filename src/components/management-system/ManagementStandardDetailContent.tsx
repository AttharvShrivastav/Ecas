import React from 'react';
import type { ManagementStandard } from '../../cms/types';

export interface ManagementStandardDetailContentProps {
  standard: ManagementStandard;
  isStandalone?: boolean;
}

export const ManagementStandardDetailContent: React.FC<ManagementStandardDetailContentProps> = ({
  standard,
  isStandalone = false,
}) => {
  const modalData = standard.modal;
  const hasOverview = Boolean(modalData?.overview?.trim());
  const hasApplicability = Boolean(modalData?.applicability?.trim());
  const hasFocusAreas = Boolean(modalData?.focusAreas && modalData.focusAreas.length > 0);

  return (
    <div className={`flex flex-col text-[#082046] ${isStandalone ? 'w-full' : ''}`}>
      {/* Header bar */}
      <div className={`flex items-start justify-between gap-4 border-b border-slate-100 ${isStandalone ? 'pb-6 mb-6' : 'p-6 sm:p-8 pb-4 sm:pb-5'}`}>
        <div className="flex items-center gap-3.5 sm:gap-4 pr-8">
          {/* Number Marker */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#082046] text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0"
            aria-hidden="true"
          >
            {standard.number}
          </div>

          {/* Title: H1 for standalone page, H2 for modal */}
          {isStandalone ? (
            <h1
              id="standard-detail-title"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#082046] leading-snug"
            >
              {standard.title}
            </h1>
          ) : (
            <h2
              id="standard-modal-title"
              className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#082046] leading-snug"
            >
              {standard.title}
            </h2>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className={`space-y-6 ${isStandalone ? 'py-2' : 'p-6 sm:p-8 overflow-y-auto'}`}>
        {/* Summary Description */}
        <div>
          <p
            id={isStandalone ? 'standard-detail-summary' : 'standard-modal-summary'}
            className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal"
          >
            {standard.shortDescription}
          </p>
        </div>

        {/* Overview Section */}
        {hasOverview && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2">
              Overview
            </h3>
            <p className="text-sm sm:text-[15px] text-[#082046] leading-relaxed">
              {modalData?.overview}
            </p>
          </div>
        )}

        {/* Applicability Section */}
        {hasApplicability && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2">
              Applicability
            </h3>
            <p className="text-sm sm:text-[15px] text-[#082046] leading-relaxed">
              {modalData?.applicability}
            </p>
          </div>
        )}

        {/* Key Focus Areas */}
        {hasFocusAreas && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2.5">
              Key Focus Areas
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#082046]">
              {modalData?.focusAreas?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#032E64] mt-1.5 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
