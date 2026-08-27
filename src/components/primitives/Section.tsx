import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}

const spacingClasses = {
  none: 'py-0',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-20',
  lg: 'py-16 md:py-28',
  xl: 'py-20 md:py-36',
};

/**
 * Reusable Section layout primitive providing structured vertical whitespace.
 */
export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'lg',
  className = '',
  as: Component = 'section',
  ...props
}) => {
  return (
    <Component className={`w-full relative ${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
