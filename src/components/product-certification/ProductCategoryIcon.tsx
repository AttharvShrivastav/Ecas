import React from 'react';
import {
  Buildings,
  Gear,
  Broadcast,
  Flame,
  Gauge,
  ShieldWarning,
  Lightning,
  Waveform,
  GameController,
  Package,
} from '@phosphor-icons/react';

export interface ProductCategoryIconProps {
  iconKey: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}

/**
 * Safe Icon Mapping for CMS-driven CE Marking Product Categories.
 * Maps clean icon keys to Phosphor Icons without raw SVG injection.
 */
export const ProductCategoryIcon: React.FC<ProductCategoryIconProps> = ({
  iconKey,
  size = 28,
  weight = 'regular',
  className = 'text-[#082046]',
}) => {
  const normalized = (iconKey || '').toLowerCase().replace(/[-_\s]/g, '');

  switch (normalized) {
    case 'buildings':
    case 'construction':
    case 'building':
      return <Buildings size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'gear':
    case 'machinery':
    case 'gears':
    case 'machine':
      return <Gear size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'broadcast':
    case 'telecom':
    case 'telecommunications':
    case 'antenna':
    case 'radio':
      return <Broadcast size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'flame':
    case 'gas':
    case 'gasappliances':
    case 'fire':
      return <Flame size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'gauge':
    case 'pressure':
    case 'pressureequipment':
    case 'speedometer':
      return <Gauge size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'shieldwarning':
    case 'atex':
    case 'atexequipment':
    case 'warning':
      return <ShieldWarning size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'lightning':
    case 'lowvoltage':
    case 'lowvoltageproducts':
    case 'electrical':
    case 'power':
      return <Lightning size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'waveform':
    case 'emc':
    case 'electromagnetic':
    case 'electromagneticcompatibility':
    case 'pulse':
    case 'activity':
      return <Waveform size={size} weight={weight} className={className} aria-hidden="true" />;

    case 'teddybear':
    case 'toys':
    case 'toy':
    case 'gamecontroller':
      return <GameController size={size} weight={weight} className={className} aria-hidden="true" />;

    default:
      return <Package size={size} weight={weight} className={className} aria-hidden="true" />;
  }
};

