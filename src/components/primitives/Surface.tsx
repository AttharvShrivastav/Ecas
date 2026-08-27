import React from 'react';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  border?: boolean;
  className?: string;
  as?: React.ElementType;
}

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

/**
 * Clean White Surface primitive
 */
export const WhiteSurface: React.FC<SurfaceProps> = ({
  children,
  radius = 'xl',
  border = true,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`bg-white ${border ? 'border border-[#E2E8F0]' : ''} ${radiusClasses[radius]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Pale Neutral Surface primitive (Development scaffolding)
 */
export const NeutralSurface: React.FC<SurfaceProps> = ({
  children,
  radius = 'xl',
  border = false,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`bg-[#F1F4F7] ${border ? 'border border-[#E2E8F0]' : ''} ${radiusClasses[radius]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface HeroSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  radius?: 'none' | 'lg' | 'xl' | '2xl' | '3xl';
  decorativeSlot?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Hero-Specific Surface Utility
 * Encapsulates the confirmed hero-specific diagonal #00607A -> #032E64 gradient,
 * code-based noise overlay, rounded corners, overflow-hidden, and slot for future decorative assets.
 * Note: This gradient is strictly hero-specific and not a general brand background.
 */
export const HeroSurface: React.FC<HeroSurfaceProps> = ({
  children,
  radius = '2xl',
  decorativeSlot,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`relative bg-hero-gradient text-white overflow-hidden ${radiusClasses[radius]} ${className}`}
      {...props}
    >
      {/* Code-based Noise Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Decorative Assets Slot (for future globe/map/orbital motifs) */}
      {decorativeSlot && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {decorativeSlot}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};
