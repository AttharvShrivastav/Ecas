import React from 'react';

export interface TrainingVisualProps {
  statusText?: string;
  chips?: string[];
}

/**
 * Coded Professional Training Information Card Visual
 *
 * Faithfully recreates the visual hierarchy and design from approved reference in clean code:
 * - Centered Title + "Learning pathways" status indicator
 * - Tree diagram with Mortarboard root node and 4 learning pathways:
 *   Lead Auditor, Internal Auditor, Awareness, Implementation
 * - Abstract coded avatar circles for professional cohort
 * - Bottom status chips
 */
export const TrainingVisual: React.FC<TrainingVisualProps> = ({
  statusText = 'Learning pathways',
  chips = ['Lead Auditor', 'Internal Auditor', 'Awareness', 'Implementation'],
}) => {
  const pathways = [
    {
      id: 'lead-auditor',
      label: 'Lead Auditor',
      icon: (
        <svg className="w-3 h-3 text-[#2E6B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'internal-auditor',
      label: 'Internal Auditor',
      icon: (
        <svg className="w-3 h-3 text-[#2E6B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'awareness',
      label: 'Awareness',
      icon: (
        <svg className="w-3 h-3 text-[#2E6B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'implementation',
      label: 'Implementation',
      icon: (
        <svg className="w-3 h-3 text-[#2E6B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 xs:p-4.5 sm:p-5 xl:p-5.5 text-center select-none">
      {/* Header */}
      <div className="shrink-0">
        <h3 className="text-base xs:text-[17px] sm:text-lg font-bold text-[#0F172A] leading-tight tracking-tight">
          Professional Training
        </h3>
        <div className="flex items-center justify-center gap-1.5 mt-1.5 sm:mt-2">
          <span className="w-2 h-2 rounded-full bg-[#4B7E58]" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-medium text-[#4B7E58] tracking-normal">
            {statusText}
          </span>
        </div>
      </div>

      {/* Pathway Tree Flowchart Diagram */}
      <div className="my-auto py-1 flex flex-col items-center w-full">
        {/* Central Graduation Cap Root Node */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EBF3EC] border border-[#2E6B48]/30 flex items-center justify-center shadow-xs z-10">
          <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2E6B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>

        {/* Crisp Flowchart SVG Connector Tree */}
        <div className="w-full max-w-[220px] xs:max-w-[235px] sm:max-w-[250px] h-5 my-[-2px] flex items-center justify-center pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 260 24"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Center Vertical Stem Down from Root */}
            <line x1="130" y1="0" x2="130" y2="12" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Horizontal Branching Bar */}
            <line x1="32.5" y1="12" x2="227.5" y2="12" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* 4 Vertical Drops Entering 4 Pathway Cards */}
            <line x1="32.5" y1="12" x2="32.5" y2="24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="97.5" y1="12" x2="97.5" y2="24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="162.5" y1="12" x2="162.5" y2="24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="227.5" y1="12" x2="227.5" y2="24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 4 Pathway Module Cards */}
        <div className="grid grid-cols-4 gap-1 xs:gap-1.5 w-full max-w-[225px] xs:max-w-[240px] sm:max-w-[255px] z-10">
          {pathways.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#E2E8F0] rounded-md sm:rounded-lg p-1 xs:p-1.5 flex flex-col items-center shadow-xs"
            >
              <div className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#EBF3EC] flex items-center justify-center mb-0.5 xs:mb-1">
                {p.icon}
              </div>
              <span className="text-[7px] xs:text-[7.5px] sm:text-[8.5px] font-semibold text-[#1E293B] leading-tight line-clamp-2">
                {p.label}
              </span>
              <div className="w-3 xs:w-3.5 sm:w-4 h-0.5 bg-[#CBD5E1] rounded-full mt-1 sm:mt-1.5" />
            </div>
          ))}
        </div>

        {/* Overlapping Abstract Coded Avatar Placeholders */}
        <div className="flex items-center justify-center -space-x-1.5 mt-1.5 sm:mt-2">
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#2C3E50] border-2 border-white flex items-center justify-center text-[7px] sm:text-[7.5px] font-bold text-white shadow-2xs">
            EA
          </div>
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#D4AC0D] border-2 border-white flex items-center justify-center text-[7px] sm:text-[7.5px] font-bold text-white shadow-2xs">
            MS
          </div>
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#34495E] border-2 border-white flex items-center justify-center text-[7px] sm:text-[7.5px] font-bold text-white shadow-2xs">
            JK
          </div>
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#7D3C98] border-2 border-white flex items-center justify-center text-[7px] sm:text-[7.5px] font-bold text-white shadow-2xs">
            RT
          </div>
        </div>
      </div>

      {/* Bottom Chips */}
      <div className="shrink-0 flex flex-wrap items-center justify-center gap-1 pt-1 pb-0.5">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#F4F5F1] border border-[#E5E7EB]/60 text-[8px] sm:text-[8.5px] font-medium text-[#1E293B]"
          >
            <span className="text-[#6B8E55] text-[7.5px] sm:text-[8px] font-bold">✓</span>
            <span>{chip}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
