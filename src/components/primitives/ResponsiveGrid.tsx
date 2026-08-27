import React from 'react';

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: '1' | '2' | '3' | '4' | '1-2' | '2-1' | 'auto-fit';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: React.ElementType;
}

const columnClasses = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '1-2': 'grid-cols-1 lg:grid-cols-3 [&>*:nth-child(2)]:lg:col-span-2',
  '2-1': 'grid-cols-1 lg:grid-cols-3 [&>*:nth-child(1)]:lg:col-span-2',
  'auto-fit': 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
};

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-4 md:gap-6',
  md: 'gap-6 md:gap-8',
  lg: 'gap-8 md:gap-10',
  xl: 'gap-10 md:gap-12',
};

/**
 * Reusable Responsive Grid primitive supporting standard symmetric and asymmetric compositions.
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = '3',
  gap = 'md',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
