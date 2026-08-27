import React from 'react';
import {
  Cylinder,
  Flame,
  Equalizer,
  Vault,
  Engine,
  Fan,
  Cpu,
  Faders,
  Pipe,
  Nut,
  Lightning,
  Gauge,
  Circle,
} from '@phosphor-icons/react';
import type { EquipmentCoverageContent } from '../../cms/types';
import { defaultEquipmentCoverageContent } from '../../cms/inspectionContent';

export interface EquipmentCoverageSectionProps {
  content?: EquipmentCoverageContent;
}

/**
 * EquipmentCoverageSection Component
 *
 * Source of Truth: Approved "Coverage across critical industrial equipment" Screenshot
 *
 * Visual Structure:
 * - Two-Column Layout on Desktop:
 *   - Left Column: Editorial DM Sans H2 title + supporting descriptive paragraph
 *   - Right Column: Clean, systematic grid of equipment cards
 * - Card Structure:
 *   - White surface, subtle border, rounded rectangle
 *   - Light icon container with semantic Phosphor icon in navy tone
 *   - Bold DM Sans equipment category title
 * - Smooth responsive collapse across xl (3-4 cols), lg (3 cols), md (2 cols), sm (1 col).
 */
export const EquipmentCoverageSection: React.FC<EquipmentCoverageSectionProps> = ({
  content = defaultEquipmentCoverageContent,
}) => {
  // Safe Phosphor icon mapper for equipment categories
  const renderEquipmentIcon = (iconKey: string) => {
    const iconProps = { size: 24, weight: 'regular' as const };
    switch (iconKey.toLowerCase()) {
      case 'cylinder':
      case 'pressure-vessels':
      case 'pressure-vessel':
        return <Cylinder {...iconProps} />;
      case 'flame':
      case 'fire':
      case 'boiler':
      case 'boilers':
        return <Flame {...iconProps} />;
      case 'equalizer':
      case 'heat-exchanger':
      case 'heat-exchangers':
      case 'columns':
        return <Equalizer {...iconProps} />;
      case 'vault':
      case 'tank':
      case 'tanks':
        return <Vault {...iconProps} />;
      case 'engine':
      case 'pump':
      case 'pumps':
        return <Engine {...iconProps} />;
      case 'fan':
      case 'turbine':
      case 'turbines':
        return <Fan {...iconProps} />;
      case 'cpu':
      case 'compressor':
      case 'compressors':
        return <Cpu {...iconProps} />;
      case 'faders':
      case 'valve':
      case 'valves':
        return <Faders {...iconProps} />;
      case 'pipe':
      case 'pipes':
        return <Pipe {...iconProps} />;
      case 'nut':
      case 'piping-materials':
      case 'piping-material':
        return <Nut {...iconProps} />;
      case 'lightning':
      case 'power':
      case 'electrical':
      case 'electrical-equipment':
        return <Lightning {...iconProps} />;
      case 'gauge':
      case 'meter':
      case 'instruments':
      case 'instrument':
        return <Gauge {...iconProps} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  return (
    <section
      id="equipment-coverage"
      aria-labelledby="equipment-coverage-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column: Heading & Descriptive Narrative */}
        <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-28">
          <h2
            id="equipment-coverage-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046]"
          >
            {content.heading}
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-[16px] text-[#475569] leading-relaxed font-normal max-w-md">
            {content.description}
          </p>
        </div>

        {/* Right Column: Grid of Industrial Equipment Cards */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4">
            {content.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200/85 shadow-2xs flex items-center gap-3.5 sm:gap-4 transition-all duration-200 hover:border-slate-300 hover:shadow-xs group"
              >
                {/* Light Icon Container on Left */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-200/70 text-[#082046] flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-slate-100/80"
                  aria-hidden="true"
                >
                  {renderEquipmentIcon(item.iconKey)}
                </div>

                {/* Equipment Category Title on Right */}
                <h3 className="text-sm sm:text-[15px] font-semibold text-[#082046] tracking-tight leading-snug">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
