import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  href?: string;
  isExternal?: boolean;
  arrowHover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable Button primitive adhering to ECASEURO's confirmed design system.
 * - Primary: Default state is the confirmed #0B1642 -> #3261BC linear gradient (--gradient-nav-cta).
 *   Features layered architecture so GSAP animates the hover layer opacity (#E8EEF3) and arrow slide-in,
 *   reversing smoothly back to the exact gradient without fragile string interpolation.
 * - Secondary: Clean white surface with neutral border and navy text.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  href,
  isExternal = false,
  arrowHover = true,
  className = '',
  children,
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const hoverBgRef = useRef<HTMLSpanElement | null>(null);
  const arrowRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const isPrimary = variant === 'primary';
  const shouldAnimate = isPrimary && arrowHover;

  useEffect(() => {
    if (!shouldAnimate || !buttonRef.current || !hoverBgRef.current || !arrowRef.current || !labelRef.current) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    // Initialize arrow state
    gsap.set(arrowRef.current, {
      width: 0,
      opacity: 0,
      x: -8,
      marginRight: 0,
    });

    // Create a dedicated, paused timeline for this button instance
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      tl.to(
        hoverBgRef.current,
        {
          opacity: 1,
          duration: 0.24,
          ease: 'power2.out',
        },
        0
      )
        .to(
          buttonRef.current,
          {
            borderColor: '#CBD5E1',
            duration: 0.24,
            ease: 'power2.out',
          },
          0
        )
        .to(
          labelRef.current,
          {
            color: '#032E64',
            x: 2,
            duration: 0.24,
            ease: 'power2.out',
          },
          0
        )
        .to(
          arrowRef.current,
          {
            width: 14,
            opacity: 1,
            x: 0,
            marginRight: 6,
            color: '#032E64',
            duration: 0.24,
            ease: 'power2.out',
          },
          0
        );

      timelineRef.current = tl;
    }, buttonRef);

    return () => {
      ctx.revert();
    };
  }, [shouldAnimate]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (disabled) return;
    if (timelineRef.current && !prefersReducedMotion()) {
      timelineRef.current.play();
    }
    props.onPointerEnter?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (timelineRef.current && !prefersReducedMotion()) {
      timelineRef.current.reverse();
    }
    props.onPointerLeave?.(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 focus-ring cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variantStyles = isPrimary
    ? 'text-white border border-[#0B1642]/40 shadow-xs'
    : 'bg-white text-[#032E64] border border-[#CBD5E1] hover:bg-[#F1F4F7] hover:border-[#94A3B8] active:bg-[#E2E8F0]';

  const combinedClasses = `${baseStyles} ${variantStyles} ${className}`;

  const content = (
    <>
      {/* Primary Button Layered Backgrounds */}
      {isPrimary && (
        <>
          {/* Confirmed Default Gradient Layer: #0B1642 -> #3261BC */}
          <span className="absolute inset-0 bg-nav-cta-gradient pointer-events-none" aria-hidden="true" />
          {/* Hover Surface Layer (#E8EEF3) animated via GSAP opacity */}
          <span
            ref={hoverBgRef}
            className="absolute inset-0 bg-[#E8EEF3] opacity-0 pointer-events-none transition-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* Button Content Layer */}
      <span className="relative z-10 inline-flex items-center justify-center">
        {shouldAnimate && (
          <span
            ref={arrowRef}
            className="inline-flex items-center justify-center overflow-hidden shrink-0 pointer-events-none text-white"
            aria-hidden="true"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
        <span
          ref={labelRef}
          className={`inline-block whitespace-nowrap transition-none ${isPrimary ? 'text-white' : 'text-[#032E64]'}`}
        >
          {children}
        </span>
      </span>
    </>
  );

  if (href) {
    if (isExternal || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className={combinedClasses}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        to={href}
        className={combinedClasses}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={combinedClasses}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * Reusable Text Link primitive with accessible focus state and restrained hover behavior.
 */
export const TextLink: React.FC<TextLinkProps> = ({
  href,
  isExternal = false,
  className = '',
  children,
  ...props
}) => {
  const linkClasses = `inline-flex items-center text-sm font-semibold text-[#00607A] hover:text-[#032E64] underline underline-offset-4 focus-ring rounded-xs transition-colors duration-150 ${className}`;

  if (isExternal || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={linkClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={linkClasses} {...props}>
      {children}
    </Link>
  );
};
