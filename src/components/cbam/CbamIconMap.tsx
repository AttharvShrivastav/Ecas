import React from 'react';
import {
  Factory,
  FileText,
  ShieldCheck,
  GlobeHemisphereWest,
  MagnifyingGlass,
  Buildings,
  Certificate,
  ClipboardText,
} from '@phosphor-icons/react';

export interface CbamIconProps {
  iconKey: string;
  size?: number;
  weight?: 'regular' | 'bold' | 'fill' | 'light' | 'thin' | 'duotone';
  className?: string;
}

export const CbamIcon: React.FC<CbamIconProps> = ({
  iconKey,
  size = 24,
  weight = 'regular',
  className = '',
}) => {
  const normalizedKey = iconKey.toLowerCase().trim();

  const props = {
    size,
    weight,
    className,
    'aria-hidden': true,
  };

  switch (normalizedKey) {
    // Process step icons
    case 'factory':
    case 'producer':
      return <Factory {...props} />;

    case 'emissions-data':
    case 'emissions':
    case 'data':
      return <FileText {...props} />;

    case 'independent-verification':
    case 'verification':
    case 'shield-check':
      return <ShieldCheck {...props} />;

    case 'declaration':
    case 'eu-cbam-declaration':
    case 'globe':
      return <GlobeHemisphereWest {...props} />;

    // Role row icons
    case 'data-review':
    case 'review':
    case 'magnifying-glass':
      return <MagnifyingGlass {...props} />;

    case 'site-visits':
    case 'visits':
    case 'buildings':
      return <Buildings {...props} />;

    case 'verification-reports':
    case 'reports':
    case 'certificate':
      return <Certificate {...props} />;

    case 'pre-verification-visits':
    case 'pre-verification':
    case 'clipboard':
    case 'checklist':
      return <ClipboardText {...props} />;

    // Status icon
    case 'verifier-status':
    case 'status':
    case 'seal':
      return <Certificate {...props} />;

    default:
      return <FileText {...props} />;
  }
};
