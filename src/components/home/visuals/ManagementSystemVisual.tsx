import React from 'react';

export interface ManagementSystemVisualProps {
  statusText?: string;
  statNumber?: string;
  statUnit?: string;
  chips?: string[];
}

/**
 * Coded Management System Certification Information Card Visual
 *
 * Faithfully recreates the visual hierarchy and design from approved reference in clean code:
 * - Title + "Compliance on track" status indicator
 * - 84% SVG circular progress indicator
 * - ISO 9001, ISO 14001, ISO 45001 status chips
 */
export const ManagementSystemVisual: React.FC<ManagementSystemVisualProps> = ({
  statusText = 'Compliance on track',
  statNumber = '84',
  statUnit = '%',
  chips = ['ISO 9001', 'ISO 14001', 'ISO 45001'],
}) => {
  // 84% of circle (radius 52 => circumference ~326.7)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 84;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 xs:p-4.5 sm:p-5 xl:p-5.5 text-left select-none">
      {/* Header */}
      <div className="shrink-0">
        <h3 className="text-base xs:text-[17px] sm:text-lg font-bold text-[#0F172A] leading-tight tracking-tight">
          Management System
          <span className="block">Certification</span>
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
          <span className="w-2 h-2 rounded-full bg-[#4B7E58]" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-medium text-[#4B7E58] tracking-normal">
            {statusText}
          </span>
        </div>
      </div>

      {/* Center 84% Circular Progress Ring */}
      <div className="my-auto py-1.5 sm:py-2 flex items-center justify-center">
        <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-34 sm:h-34 xl:w-36 xl:h-36 flex items-center justify-center">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 128 128"
            fill="none"
          >
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#EDF2F7"
              strokeWidth="11"
            />
            {/* Active Olive/Sage Progress Arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#6B8E55"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Centered Percentage Stat */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="inline-flex items-baseline justify-center text-[#0F172A]">
              <span className="text-3xl xs:text-[34px] sm:text-[38px] xl:text-[40px] font-bold tracking-tight leading-none">
                {statNumber}
              </span>
              <span className="text-lg sm:text-xl font-bold ml-0.5 leading-none">
                {statUnit}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom ISO Chips */}
      <div className="shrink-0 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 pb-0.5">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#F4F5F1] border border-[#E5E7EB]/60 text-[10px] sm:text-[11px] font-medium text-[#1E293B]"
          >
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#6B8E55]/15 text-[#6B8E55] flex items-center justify-center text-[8.5px] sm:text-[9px] font-bold">
              ✓
            </span>
            <span>{chip}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
