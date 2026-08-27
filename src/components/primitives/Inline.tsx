import React from 'react';

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  className?: string;
  as?: React.ElementType;
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

/**
 * Reusable horizontal Flex Inline primitive.
 */
export const Inline: React.FC<InlineProps> = ({
  children,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = true,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`flex flex-row ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
