import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Display: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h1',
  ...props
}) => {
  return (
    <Component className={`text-display tracking-tight ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Heading1: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h1',
  ...props
}) => {
  return (
    <Component className={`text-h1 tracking-tight ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Heading2: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  ...props
}) => {
  return (
    <Component className={`text-h2 tracking-tight ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Heading3: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component className={`text-h3 tracking-tight ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Body: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component className={`text-body text-[#475569] ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const SmallBody: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component className={`text-body-sm text-[#64748B] ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const Label: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component className={`text-label text-[#00607A] ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const ButtonText: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component className={`text-btn ${className}`} {...props}>
      {children}
    </Component>
  );
};
