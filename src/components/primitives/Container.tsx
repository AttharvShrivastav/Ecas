import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  as?: React.ElementType;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px]',
  full: 'max-w-none',
};

/**
 * Reusable Container layout primitive providing generous horizontal breathing room
 * and wide desktop composition constraints.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
