import React from 'react';

export interface ProductCertificationVisualProps {
  statusText?: string;
  chips?: string[];
}

/**
 * Coded Product Certification Information Card Visual
 *
 * Faithfully recreates the visual hierarchy and design from approved reference in clean code:
 * - Centered Title + "Approval in progress" status indicator
 * - Layered Shield with checkmark + circular "Quality Assured" seal motif
 * - 3-step connected workflow: 1 Application -> 2 Review -> 3 Approval
 */
export const ProductCertificationVisual: React.FC<ProductCertificationVisualProps> = ({
  statusText = 'Approval in progress',
  chips = ['Application', 'Review', 'Approval'],
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 xs:p-4.5 sm:p-5 xl:p-5.5 text-center select-none">
      {/* Header */}
      <div className="shrink-0">
        <h3 className="text-base xs:text-[17px] sm:text-lg font-bold text-[#0F172A] leading-tight tracking-tight">
          Product Certification
        </h3>
        <div className="flex items-center justify-center gap-1.5 mt-1.5 sm:mt-2">
          <span className="w-2 h-2 rounded-full bg-[#4B7E58]" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-medium text-[#4B7E58] tracking-normal">
            {statusText}
          </span>
        </div>
      </div>

      {/* Center Shield Graphic & Certified Seal */}
      <div className="my-auto py-1 sm:py-1.5 flex flex-col items-center justify-center gap-1.5 sm:gap-2">
        {/* Layered Clean Shield */}
        <div className="relative w-20 h-24 xs:w-22 xs:h-26 sm:w-24 sm:h-28 xl:w-26 xl:h-30 flex items-center justify-center">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-xs"
            fill="none"
          >
            {/* Outer Soft Frosted Shield Border */}
            <path
              d="M50 8C74 8 88 18 90 42C90 78 50 110 50 110C50 110 10 78 10 42C12 18 26 8 50 8Z"
              fill="url(#shieldGrad)"
              stroke="#D1E2F4"
              strokeWidth="2"
            />
            {/* Inner Refined Border */}
            <path
              d="M50 16C70 16 80 24 82 44C82 74 50 98 50 98C50 98 18 74 18 44C20 24 30 16 50 16Z"
              fill="#FFFFFF"
              fillOpacity="0.8"
              stroke="#E2EBF6"
              strokeWidth="1.5"
            />
            {/* Center Forest/Sage Green Checkmark */}
            <path
              d="M36 52L46 62L66 40"
              stroke="#2E6B48"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="shieldGrad" x1="50" y1="8" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4F8FC" stopOpacity="0.9" />
                <stop stopColor="#E2EDF8" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Circular Certification Seal Motif */}
        <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 rounded-full border border-[#2E6B48]/40 p-0.5 sm:p-1 flex flex-col items-center justify-center text-[#2E6B48] select-none bg-white/70 shadow-xs">
          <div className="w-full h-full rounded-full border border-dashed border-[#2E6B48]/50 flex flex-col items-center justify-center p-0.5">
            <span className="text-[6.5px] sm:text-[7px] font-bold tracking-widest uppercase leading-none text-[#2E6B48]">
              CERTIFIED
            </span>
            <div className="my-0.5 text-[#2E6B48] flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[5px] sm:text-[5.5px] font-semibold tracking-wider uppercase leading-none text-[#2E6B48]/90">
              QUALITY ASSURED
            </span>
          </div>
        </div>
      </div>

      {/* 3-Step Connected Stepper Timeline */}
      <div className="shrink-0 pt-1 pb-0.5 w-full">
        <div className="relative flex items-center justify-between max-w-[215px] xs:max-w-[230px] sm:max-w-[240px] mx-auto">
          {/* Connector Line */}
          <div className="absolute top-2.5 sm:top-3 left-4 right-4 h-0.5 bg-[#CBD5E1] -z-0" aria-hidden="true" />

          {chips.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-white border border-[#6B8E55] text-[#2E6B48] text-[10px] sm:text-xs font-semibold flex items-center justify-center shadow-xs">
                {idx + 1}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#475569] mt-0.5 sm:mt-1 leading-tight">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
