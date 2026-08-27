import React from 'react';
import {
  GlobeHemisphereWest,
  Leaf,
  HardHat,
  Lifebuoy,
  Lock,
  LockKey,
  Lightning,
  Scales,
  SealCheck,
  Flask,
  ForkKnife,
  ShieldCheck,
  Presentation,
  Devices,
  SlidersHorizontal,
  GraduationCap,
  Certificate,
  FileText,
  BookOpen,
} from '@phosphor-icons/react';

export interface TrainingIconProps {
  iconKey: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}

/**
 * Safe Icon Mapping for CMS-driven Training courses and delivery formats.
 * Prevents raw HTML/SVG injection and guarantees consistent icon rendering.
 */
export const TrainingIcon: React.FC<TrainingIconProps> = ({
  iconKey,
  size = 24,
  weight = 'regular',
  className = '',
}) => {
  const normalizedKey = (iconKey || '').toLowerCase().replace(/[-_\s]/g, '');

  switch (normalizedKey) {
    // ESG / Global
    case 'globehemispherewest':
    case 'globe':
    case 'esg':
      return <GlobeHemisphereWest size={size} weight={weight} className={className} />;

    // Environmental (ISO 4001)
    case 'leaf':
    case 'plant':
    case 'eco':
      return <Leaf size={size} weight={weight} className={className} />;

    // Health & Safety (ISO 45001)
    case 'hardhat':
    case 'safety':
    case 'helmet':
      return <HardHat size={size} weight={weight} className={className} />;

    // Business Continuity (ISO 22301)
    case 'lifebuoy':
    case 'continuity':
    case 'rescue':
      return <Lifebuoy size={size} weight={weight} className={className} />;

    // Information Security (ISO 27001)
    case 'lock':
    case 'lockkey':
    case 'security':
    case 'cybersecurity':
      return <Lock size={size} weight={weight} className={className} />;

    // Energy Management (ISO 50001)
    case 'lightning':
    case 'bolt':
    case 'energy':
    case 'power':
      return <Lightning size={size} weight={weight} className={className} />;

    // Anti-bribery (ISO 37001)
    case 'scales':
    case 'law':
    case 'justice':
    case 'balance':
      return <Scales size={size} weight={weight} className={className} />;

    // Quality Management (ISO 9001)
    case 'sealcheck':
    case 'seal':
    case 'badge':
    case 'quality':
      return <SealCheck size={size} weight={weight} className={className} />;

    // Laboratory (ISO 17025)
    case 'flask':
    case 'lab':
    case 'science':
    case 'testing':
      return <Flask size={size} weight={weight} className={className} />;

    // Food Safety (ISO 22000)
    case 'forkknife':
    case 'food':
    case 'restaurant':
    case 'haccp':
      return <ForkKnife size={size} weight={weight} className={className} />;

    // FSSC 22000 / Shield
    case 'shieldcheck':
    case 'shield':
    case 'fssc':
      return <ShieldCheck size={size} weight={weight} className={className} />;

    // Flexible Learning Formats
    case 'presentation':
    case 'classroom':
    case 'instructor':
      return <Presentation size={size} weight={weight} className={className} />;

    case 'devices':
    case 'elearning':
    case 'blended':
    case 'online':
      return <Devices size={size} weight={weight} className={className} />;

    case 'slidershorizontal':
    case 'sliders':
    case 'inhouse':
    case 'custom':
    case 'bespoke':
      return <SlidersHorizontal size={size} weight={weight} className={className} />;

    // Generic / Fallback matches
    case 'graduationcap':
    case 'course':
      return <GraduationCap size={size} weight={weight} className={className} />;

    case 'certificate':
      return <Certificate size={size} weight={weight} className={className} />;

    case 'book':
    case 'bookopen':
      return <BookOpen size={size} weight={weight} className={className} />;

    default:
      return <FileText size={size} weight={weight} className={className} />;
  }
};
