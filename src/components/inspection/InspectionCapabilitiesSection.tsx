import React from 'react';
import {
  ClockCountdown,
  ClipboardText,
  Factory,
  Timer,
  Clipboard,
  Gear,
} from '@phosphor-icons/react';
import type { InspectionCapabilitiesContent } from '../../cms/types';
import { defaultInspectionCapabilitiesContent } from '../../cms/inspectionContent';

export interface InspectionCapabilitiesSectionProps {
  content?: InspectionCapabilitiesContent;
}

/**
 * InspectionCapabilitiesSection Component
 *
 * Source of Truth: Approved Inspection & Surveillance Capabilities Design Reference
 *
 * Visual Structure:
 * - One unified, horizontal rounded strip using the soft light gradient established
 *   in the Training page informational strip (from-[#DCDEFA]/85 via-[#E6EBF9] to-[#F2F5FB]).
 * - Left Column (~30-35% width on desktop):
 *   - Bold Navy DM Sans H2 heading: "Inspection & Surveillance Capabilities"
 *   - Supporting paragraph explaining capability selection.
 * - Right Side (3 equal informational columns with thin vertical separators):
 *   - 1. Vendor Expediting (ClockCountdown)
 *   - 2. Vendor Audits (ClipboardText)
 *   - 3. Mill Inspection & Surveillance (Factory)
 * - Restrained white circular icon containers, pure DM Sans typography, no cards or shadow clutter.
 */
export const InspectionCapabilitiesSection: React.FC<InspectionCapabilitiesSectionProps> = ({
  content = defaultInspectionCapabilitiesContent,
}) => {
  // Safe Phosphor icon mapper for capability columns
  const renderCapabilityIcon = (iconKey: string) => {
    const iconProps = { size: 26, weight: 'regular' as const };
    switch (iconKey.toLowerCase()) {
      case 'clock-countdown':
      case 'countdown':
        return <ClockCountdown {...iconProps} />;
      case 'timer':
      case 'clock':
        return <Timer {...iconProps} />;
      case 'clipboard-text':
      case 'clipboard':
      case 'audit':
        return <ClipboardText {...iconProps} />;
      case 'clipboard-simple':
        return <Clipboard {...iconProps} />;
      case 'factory':
      case 'mill':
      case 'manufacturing':
        return <Factory {...iconProps} />;
      case 'gear':
      default:
        return <Gear {...iconProps} />;
    }
  };

  return (
    <div className="w-full pt-4 sm:pt-6 lg:pt-8 pb-14 sm:pb-18 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10">
      <section
        id="inspection-capabilities"
        aria-labelledby="capabilities-heading"
        className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto bg-gradient-to-r from-[#DCDEFA]/85 via-[#E6EBF9] to-[#F2F5FB] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 border border-slate-200/70 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Heading & Explanatory Narrative (~30-35% on desktop) */}
          <div className="lg:col-span-4 xl:col-span-4">
            <h2
              id="capabilities-heading"
              className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-normal leading-[1.15] tracking-[-0.02em] text-[#082046]"
            >
              {content.heading}
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-[15px] lg:text-[15.5px] text-[#475569] leading-relaxed max-w-sm font-normal">
              {content.description}
            </p>
          </div>

          {/* Right Column: Three Equal Capability Columns with Thin Separators */}
          <div className="lg:col-span-8 xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            {content.capabilities.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center border-t border-slate-300/50 pt-6 md:pt-0 md:border-t-0 md:border-l md:border-slate-300/60 first:pt-0 first:border-t-0 first:md:border-l-0 md:px-3.5 lg:px-5 xl:px-7"
              >
                {/* Circular White Icon Badge */}
                <div
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center text-[#082046] shadow-xs mb-3.5 sm:mb-4 border border-white/90 shrink-0"
                  aria-hidden="true"
                >
                  {renderCapabilityIcon(item.iconKey)}
                </div>

                {/* Capability Title */}
                <h3 className="text-base sm:text-lg font-semibold text-[#082046] leading-snug">
                  {item.title}
                </h3>

                {/* Capability Description */}
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-2 max-w-[240px] font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
