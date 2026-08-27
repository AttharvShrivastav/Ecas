import React from 'react';
import {
  Scroll,
  PenNib,
  MagnifyingGlass,
  ClipboardText,
  Stack,
  PaintRoller,
  Anchor,
  ShieldCheck,
  Shield,
  Circle,
} from '@phosphor-icons/react';
import type { MillInspectionContent } from '../../cms/types';
import { defaultMillInspectionContent } from '../../cms/inspectionContent';

export interface MillInspectionSectionProps {
  content?: MillInspectionContent;
}

/**
 * MillInspectionSection Component
 *
 * Source of Truth: Approved "Mill Inspection & Surveillance" Design Reference
 *
 * Visual Structure:
 * - Unified Large Editorial White Panel with subtle border & shadow-2xs on #EEEEEE canvas
 * - Left Column (35%):
 *   - Bold DM Sans H2 title
 *   - Two paragraphs of clear, technical narrative copy
 *   - Faint architectural/industrial line drawing in lower portion
 * - Right Column (65%):
 *   - 7-stage technical process timeline: 01 Forming, 02 Welding, 03 NDT, 04 Testing, 05 Threading, 06 Coatings, 07 Loading
 *   - Subtle connecting horizontal line with node indicators
 *   - Circular light icon containers with semantic Phosphor icons
 *   - Lower Information Strip with soft light gradient & assurance icon
 */
export const MillInspectionSection: React.FC<MillInspectionSectionProps> = ({
  content = defaultMillInspectionContent,
}) => {
  // Safe Phosphor icon mapper for mill process stages
  const renderStageIcon = (iconKey: string) => {
    const iconProps = { size: 22, weight: 'regular' as const };
    switch (iconKey.toLowerCase()) {
      case 'scroll':
      case 'forming':
      case 'material':
        return <Scroll {...iconProps} />;
      case 'pen-nib':
      case 'welding':
      case 'weld':
      case 'torch':
      case 'sparkle':
        return <PenNib {...iconProps} />;
      case 'magnifying-glass':
      case 'ndt':
      case 'inspection':
        return <MagnifyingGlass {...iconProps} />;
      case 'clipboard-text':
      case 'testing':
      case 'test':
        return <ClipboardText {...iconProps} />;
      case 'stack':
      case 'threading':
      case 'thread':
      case 'nut':
        return <Stack {...iconProps} />;
      case 'paint-roller':
      case 'coatings':
      case 'coating':
      case 'paint':
        return <PaintRoller {...iconProps} />;
      case 'anchor':
      case 'loading':
      case 'shipping':
      case 'crane':
      case 'hook':
        return <Anchor {...iconProps} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  const renderInfoIcon = (iconKey?: string) => {
    const iconProps = { size: 24, weight: 'regular' as const };
    if (iconKey === 'shield') return <Shield {...iconProps} />;
    return <ShieldCheck {...iconProps} />;
  };

  return (
    <section
      id="mill-inspection"
      aria-labelledby="mill-inspection-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10"
    >
      {/* Main Unified Editorial Panel */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-2xs relative overflow-hidden">
        {/* Subtle Industrial Background Vector Art (Faint linework) */}
        <div
          className="absolute left-4 bottom-2 w-96 h-48 pointer-events-none opacity-[0.05] text-[#082046]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 400 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="w-full h-full"
          >
            {/* Architectural structural framing lines */}
            <line x1="10" y1="190" x2="390" y2="190" />
            <line x1="30" y1="190" x2="30" y2="40" />
            <line x1="110" y1="190" x2="110" y2="20" />
            <line x1="190" y1="190" x2="190" y2="40" />
            <line x1="270" y1="190" x2="270" y2="20" />
            <line x1="350" y1="190" x2="350" y2="40" />
            <path d="M30 40 L110 20 L190 40 L270 20 L350 40" />
            <line x1="30" y1="90" x2="350" y2="90" />
            <line x1="30" y1="140" x2="350" y2="140" />
            <line x1="30" y1="90" x2="110" y2="140" />
            <line x1="110" y1="90" x2="190" y2="140" />
            <line x1="190" y1="90" x2="270" y2="140" />
            <line x1="270" y1="90" x2="350" y2="140" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start relative z-10">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-start">
            <h2
              id="mill-inspection-heading"
              className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046]"
            >
              {content.heading}
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[15.5px] text-[#475569] leading-relaxed font-normal">
              {content.paragraph1}
            </p>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-[15.5px] text-[#475569] leading-relaxed font-normal">
              {content.paragraph2}
            </p>
          </div>

          {/* Right Column: Process Timeline + Supporting Info Strip */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between h-full">
            {/* Desktop / Tablet Horizontal 7-Stage Process Timeline */}
            <div className="hidden md:block pt-2 pb-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-3 relative text-center items-start">
                {content.stages.map((stage, idx) => {
                  const stageNum = String(stage.order || idx + 1).padStart(2, '0');
                  return (
                    <div key={stage.id} className="flex flex-col items-center group relative z-10">
                      {/* Step Number in DM Sans */}
                      <span className="text-xs sm:text-sm font-semibold text-slate-400 tracking-normal mb-2.5">
                        {stageNum}
                      </span>

                      {/* Icon Circular Surface */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border border-slate-200/90 text-[#082046] flex items-center justify-center shadow-2xs transition-all duration-200 group-hover:border-slate-300 group-hover:bg-slate-100/80">
                        {renderStageIcon(stage.iconKey)}
                      </div>

                      {/* Small Indicator Dot on Baseline */}
                      <div className="w-2 h-2 rounded-full bg-[#082046] my-2.5 opacity-90 transition-transform duration-200 group-hover:scale-125" />

                      {/* Stage Title */}
                      <h3 className="text-xs sm:text-sm font-semibold text-[#082046] tracking-tight leading-snug">
                        {stage.title}
                      </h3>
                    </div>
                  );
                })}

                {/* Connecting Line running behind the dots */}
                <div
                  className="absolute top-[88px] sm:top-[98px] left-[7%] right-[7%] h-[1.5px] bg-slate-200 -z-0 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Mobile Vertical / 2-Column Responsive Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden gap-3.5 pt-2 pb-2">
              {content.stages.map((stage, idx) => {
                const stageNum = String(stage.order || idx + 1).padStart(2, '0');
                return (
                  <div
                    key={stage.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#082046] flex items-center justify-center shrink-0 shadow-2xs">
                      {renderStageIcon(stage.iconKey)}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold text-slate-400">
                        {stageNum}
                      </span>
                      <h3 className="text-xs font-semibold text-[#082046] truncate">
                        {stage.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Supporting Information Strip below the Timeline */}
            <div className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-r from-[#DCDEFA]/80 via-[#E6EBF9] to-[#F2F5FB] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/70 flex items-center gap-3.5 sm:gap-4.5">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/90 border border-slate-200/80 text-[#082046] flex items-center justify-center shrink-0 shadow-2xs"
                aria-hidden="true"
              >
                {renderInfoIcon(content.infoStripIconKey)}
              </div>
              <p className="text-xs sm:text-sm md:text-[14.5px] font-medium text-[#082046] leading-relaxed">
                {content.infoStripText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
