import React, { useState } from 'react';
import {
  UserFocus,
  HardHat,
  Barbell,
  ClipboardText,
  Certificate,
  Anchor,
  Boat,
  Waves,
  Circle,
} from '@phosphor-icons/react';
import type { LiftingEquipmentContent } from '../../cms/types';
import { defaultLiftingEquipmentContent } from '../../cms/inspectionContent';

export interface LiftingEquipmentSectionProps {
  content?: LiftingEquipmentContent;
}

/**
 * LiftingEquipmentSection Component
 *
 * Source of Truth: Approved "Lifting Equipment Inspection" Design Reference
 *
 * Visual Structure:
 * - Clean two-column editorial block on #EEEEEE canvas:
 *   - Left Side (40-45%): Large industrial photography asset featuring crane hook & rigging tackle
 *   - Right Side (55-60%):
 *     - Editorial DM Sans H2 title
 *     - Supporting narrative description
 *     - Two-column divided list of 6 specialized lifting inspection services
 * - Restrained styling, consistent navy typography, Phosphor icons, and clean responsive collapse.
 */
export const LiftingEquipmentSection: React.FC<LiftingEquipmentSectionProps> = ({
  content = defaultLiftingEquipmentContent,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    content.image || '/images/inspection/lifting-equipment.webp'
  );

  // Safe Phosphor icon mapper for lifting services
  const renderServiceIcon = (iconKey: string) => {
    const iconProps = { size: 24, weight: 'regular' as const };
    switch (iconKey.toLowerCase()) {
      case 'user-focus':
      case 'witnessing':
      case 'commissioning':
        return <UserFocus {...iconProps} />;
      case 'hard-hat':
      case 'helmet':
        return <HardHat {...iconProps} />;
      case 'barbell':
      case 'load-testing':
      case 'weight':
      case 'load':
        return <Barbell {...iconProps} />;
      case 'clipboard-text':
      case 'periodic-inspections':
      case 'periodic':
      case 'inspection':
        return <ClipboardText {...iconProps} />;
      case 'certificate':
      case 'recertification':
      case 'cert':
        return <Certificate {...iconProps} />;
      case 'anchor':
      case 'tackles':
      case 'crane':
      case 'hook':
      case 'lifting-tackles':
        return <Anchor {...iconProps} />;
      case 'boat':
      case 'marine':
      case 'onshore-offshore':
      case 'offshore':
        return <Boat {...iconProps} />;
      case 'waves':
        return <Waves {...iconProps} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  // Divide the ordered service array into two columns for desktop presentational layout
  const halfwayIndex = Math.ceil(content.services.length / 2);
  const leftColumnServices = content.services.slice(0, halfwayIndex);
  const rightColumnServices = content.services.slice(halfwayIndex);

  return (
    <section
      id="lifting-equipment-inspection"
      aria-labelledby="lifting-equipment-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10"
    >
      {/* Main Unified Editorial Panel */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Industrial Lifting Image */}
          <div className="lg:col-span-5 xl:col-span-5 relative w-full h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/70 shadow-2xs bg-slate-100">
            <img
              src={imgSrc}
              alt={content.imageAlt}
              className="w-full h-full object-cover object-center"
              onError={() => {
                // Graceful fallback to vector asset if webp isn't present
                if (imgSrc !== '/images/inspection/lifting-equipment.svg') {
                  setImgSrc('/images/inspection/lifting-equipment.svg');
                }
              }}
              loading="lazy"
            />
          </div>

          {/* Right Column: Heading, Narrative, and Divided Service List */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            <h2
              id="lifting-equipment-heading"
              className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046]"
            >
              {content.heading}
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[15.5px] text-[#475569] leading-relaxed font-normal max-w-2xl">
              {content.description}
            </p>

            {/* Structured Divided Service List */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-0">
              {/* Left Service Column */}
              <div className="flex flex-col divide-y divide-slate-200/80">
                {leftColumnServices.map((service) => (
                  <div
                    key={service.id}
                    className="py-4 first:pt-0 last:pb-4 sm:last:pb-0 flex items-center gap-3.5 sm:gap-4 group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 text-[#082046] flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-slate-100"
                      aria-hidden="true"
                    >
                      {renderServiceIcon(service.iconKey)}
                    </div>
                    <h3 className="text-sm sm:text-[15px] font-semibold text-[#082046] tracking-tight leading-snug">
                      {service.title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Right Service Column */}
              <div className="flex flex-col divide-y divide-slate-200/80">
                {rightColumnServices.map((service) => (
                  <div
                    key={service.id}
                    className="py-4 first:pt-4 sm:first:pt-0 last:pb-0 flex items-center gap-3.5 sm:gap-4 group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 text-[#082046] flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-slate-100"
                      aria-hidden="true"
                    >
                      {renderServiceIcon(service.iconKey)}
                    </div>
                    <h3 className="text-sm sm:text-[15px] font-semibold text-[#082046] tracking-tight leading-snug">
                      {service.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
