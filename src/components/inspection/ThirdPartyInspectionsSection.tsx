import React, { useState } from 'react';
import {
  ArrowRight,
  Crane,
  FileText,
  Shield,
  ShieldCheck,
  Wrench,
} from '@phosphor-icons/react';
import type { ThirdPartyInspectionContent } from '../../cms/types';
import { defaultThirdPartyInspectionContent } from '../../cms/inspectionContent';

export interface ThirdPartyInspectionsSectionProps {
  content?: ThirdPartyInspectionContent;
}

/**
 * ThirdPartyInspectionsSection Component
 *
 * Source of Truth: Approved Third Party Inspections Design Reference
 *
 * Structure:
 * 1. Top Heading Row:
 *    - Left: Large editorial H2 heading ("Third Party Inspections") in DM Sans
 *    - Right: Supporting narrative paragraph aligned on the right
 * 2. Main Two-Column Composition:
 *    - Left Column: Large rounded industrial image panel with an integrated dark
 *      translucent assurance overlay card ("Independent. Impartial. Reliable.")
 *    - Right Column: Four vertically stacked project inspection stage cards
 *      (01 Design, 02 Construction, 03 Installation, 04 Commissioning)
 *    - Active/Hover State: Uses ECASEURO approved blue CTA gradient
 *      (from-[#0F1B4A] via-[#1C3372] to-[#4572B2]) with white typography,
 *      retaining contrast and pure DM Sans numbers.
 */
export const ThirdPartyInspectionsSection: React.FC<ThirdPartyInspectionsSectionProps> = ({
  content = defaultThirdPartyInspectionContent,
}) => {
  // Default to stage 03 (Installation) to match approved reference, while supporting interactive selection
  const [activeStageId, setActiveStageId] = useState<string>('stage-installation');
  const [imageError, setImageError] = useState<boolean>(false);

  // Safe Phosphor icon mapper for stage rows
  const renderStageIcon = (iconKey: string) => {
    const iconProps = { size: 26, weight: 'regular' as const };
    switch (iconKey.toLowerCase()) {
      case 'blueprint':
      case 'file-text':
      case 'design':
        return <FileText {...iconProps} />;
      case 'crane':
      case 'construction':
      case 'buildings':
        return <Crane {...iconProps} />;
      case 'wrench':
      case 'installation':
        return <Wrench {...iconProps} />;
      case 'shield-check':
      case 'seal-check':
      case 'commissioning':
      default:
        return <ShieldCheck {...iconProps} />;
    }
  };

  return (
    <section
      id="third-party-inspections"
      aria-labelledby="third-party-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-8 sm:py-12 lg:py-14"
    >
      {/* 1. Top Heading Row: Left Heading + Right Supporting Paragraph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-end mb-10 sm:mb-12 lg:mb-14">
        <div className="lg:col-span-6 xl:col-span-6">
          <h2
            id="third-party-heading"
            className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046]"
          >
            {content.heading}
          </h2>
        </div>
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="text-sm sm:text-base lg:text-[16.5px] text-[#475569] leading-relaxed font-normal">
            {content.description}
          </p>
        </div>
      </div>

      {/* 2. Main Two-Column Composition: Left Image + Right 4 Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
        {/* Left Column: Large Industrial Inspection Image with Integrated Assurance Overlay Card */}
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden bg-slate-900 shadow-xs border border-slate-200/80">
            {/* Industrial Plant / Inspection Scene Image */}
            <img
              src={
                !imageError && content.image?.src
                  ? content.image.src
                  : '/images/inspection/third-party-inspection.svg'
              }
              alt={content.image?.alt || 'Industrial third party inspection in progress'}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Subtle Gradient Vignette to Guarantee Overlay Legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B1642]/90 via-transparent to-black/10 pointer-events-none"
            />

            {/* Bottom Assurance Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#0B1736]/85 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white flex items-center gap-4 sm:gap-5 shadow-lg">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                <Shield size={24} weight="regular" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                  {content.overlay.heading}
                </h3>
                <p className="text-xs sm:text-[13px] text-white/80 mt-0.5 sm:mt-1 leading-relaxed font-normal">
                  {content.overlay.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Four Vertically Stacked Project Inspection Stages */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-3.5 sm:gap-4">
          {content.stages.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <div
                key={stage.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => setActiveStageId(stage.id)}
                onMouseEnter={() => setActiveStageId(stage.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStageId(stage.id);
                  }
                }}
                className={`group relative w-full text-left rounded-2xl sm:rounded-[20px] p-5 sm:p-6 transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0F1B4A] via-[#1C3372] to-[#4572B2] border-transparent text-white shadow-md'
                    : 'bg-white text-[#082046] border-slate-200/85 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Left Inner Group: Icon Holder + Number + Divider + Text */}
                <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Circular Icon Container */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border transition-colors duration-300 ${
                      isActive
                        ? 'bg-white/15 border-white/20 text-white'
                        : 'bg-slate-50 border-slate-200/80 text-[#082046]'
                    }`}
                  >
                    {renderStageIcon(stage.iconKey)}
                  </div>

                  {/* Stage Number in Pure DM Sans */}
                  <span
                    className={`text-lg sm:text-xl font-semibold shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-[#082046]'
                    }`}
                  >
                    {stage.number}
                  </span>

                  {/* Subtle Vertical Divider */}
                  <div
                    aria-hidden="true"
                    className={`w-[1px] h-10 sm:h-12 shrink-0 transition-colors duration-300 ${
                      isActive ? 'bg-white/20' : 'bg-slate-200'
                    }`}
                  />

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4
                      className={`text-base sm:text-lg font-semibold tracking-tight leading-snug transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#082046]'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    <p
                      className={`text-xs sm:text-[13.5px] mt-1 leading-relaxed font-normal line-clamp-2 transition-colors duration-300 ${
                        isActive ? 'text-white/85' : 'text-[#475569]'
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Right Edge Action Arrow (Visible on active stage) */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 text-white items-center justify-center shrink-0 ml-2 hidden sm:flex transition-transform duration-300"
                  >
                    <ArrowRight size={16} weight="bold" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
