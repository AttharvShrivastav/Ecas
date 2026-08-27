import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { FeaturedServiceItem } from '../../cms/types';
import { ManagementSystemVisual } from './visuals/ManagementSystemVisual';
import { ProductCertificationVisual } from './visuals/ProductCertificationVisual';
import { TrainingVisual } from './visuals/TrainingVisual';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface ServiceCardProps {
  service: FeaturedServiceItem;
  index: number;
}

/**
 * ServiceCard Component
 *
 * Implements the approved Figma service card structure:
 * 1. Square-ish coded visual panel with layered Blue -> Beige gradient transformation
 * 2. Subtle pointer-responsive light highlight
 * 3. Inner floating white information card with tiny restrained hover motion
 * 4. Title and description positioned cleanly below the visual artwork
 * 5. Full-card semantic navigation and keyboard accessibility
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const beigeLayerRef = useRef<HTMLDivElement | null>(null);
  const pointerLightRef = useRef<HTMLDivElement | null>(null);
  const innerCardRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup scoped reversible GSAP hover timeline
  useEffect(() => {
    if (
      !cardContainerRef.current ||
      !beigeLayerRef.current ||
      !innerCardRef.current ||
      prefersReducedMotion()
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // 1. Beige gradient layer fades in smoothly
      tl.to(
        beigeLayerRef.current,
        {
          opacity: 1,
          duration: 0.38,
          ease: 'power2.out',
        },
        0
      );

      // 2. Pointer light layer opacity intensifies slightly
      if (pointerLightRef.current) {
        tl.to(
          pointerLightRef.current,
          {
            opacity: 0.85,
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        );
      }

      // 3. Inner white card shifts up slightly (~3-4px) and scales subtly (~1.01)
      tl.to(
        innerCardRef.current,
        {
          y: -4,
          scale: 1.01,
          duration: 0.38,
          ease: 'power2.out',
        },
        0
      );

      timelineRef.current = tl;
    }, cardContainerRef);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardContainerRef.current.style.setProperty('--pointer-x', `${x}px`);
    cardContainerRef.current.style.setProperty('--pointer-y', `${y}px`);
  };

  const handlePointerEnter = () => {
    if (timelineRef.current && !prefersReducedMotion()) {
      timelineRef.current.play();
    }
  };

  const handlePointerLeave = () => {
    if (timelineRef.current && !prefersReducedMotion()) {
      timelineRef.current.reverse();
    }
    // Settle pointer light smoothly back toward center
    if (cardContainerRef.current) {
      cardContainerRef.current.style.setProperty('--pointer-x', '50%');
      cardContainerRef.current.style.setProperty('--pointer-y', '50%');
    }
  };

  const renderVisual = () => {
    switch (service.visualType) {
      case 'management-system':
        return (
          <ManagementSystemVisual
            statusText={service.metadata?.statusText}
            statNumber={service.metadata?.statNumber}
            statUnit={service.metadata?.statUnit}
            chips={service.metadata?.chips}
          />
        );
      case 'product-certification':
        return (
          <ProductCertificationVisual
            statusText={service.metadata?.statusText}
            chips={service.metadata?.chips}
          />
        );
      case 'training':
        return (
          <TrainingVisual
            statusText={service.metadata?.statusText}
            chips={service.metadata?.chips}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Link
      to={service.href}
      id={`service-card-${service.id}`}
      className="group block focus-ring rounded-[28px] text-left select-none transition-transform duration-200"
      aria-label={`View ${service.title}`}
    >
      {/* 1. Large Coded Visual Artwork Panel */}
      <div
        ref={cardContainerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="relative w-full min-h-[375px] sm:min-h-[405px] lg:min-h-[420px] xl:min-h-[440px] rounded-[24px] sm:rounded-[28px] overflow-hidden p-4 sm:p-5 lg:p-6 flex items-center justify-center shadow-xs border border-white/60"
        style={{
          ['--pointer-x' as string]: '50%',
          ['--pointer-y' as string]: '50%',
        }}
      >
        {/* Layer A: Default Cool Blue Cloud Gradient Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 25% 18%, rgba(255, 255, 255, 0.72), transparent 38%), radial-gradient(circle at 80% 76%, rgba(155, 188, 236, 0.45), transparent 42%), linear-gradient(135deg, #A9C8F2 0%, #EEF3FB 52%, #C7D8F1 100%)',
          }}
          aria-hidden="true"
        />

        {/* Layer B: Warm Beige Gradient Layer (Fades in on GSAP hover) */}
        <div
          ref={beigeLayerRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 72% 18%, rgba(255, 239, 216, 0.72), transparent 40%), radial-gradient(circle at 18% 78%, rgba(145, 155, 165, 0.36), transparent 44%), linear-gradient(135deg, #AEB7BF 0%, #EEE1CB 52%, #D8BEA2 100%)',
          }}
          aria-hidden="true"
        />

        {/* Layer C: Pointer-Responsive Radial Light Highlight */}
        <div
          ref={pointerLightRef}
          className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(420px circle at var(--pointer-x) var(--pointer-y), rgba(255, 255, 255, 0.45), transparent 50%)',
          }}
          aria-hidden="true"
        />

        {/* Layer D: Floating White Information Card */}
        <div
          ref={innerCardRef}
          className="relative z-10 w-full max-w-[285px] xs:max-w-[300px] sm:max-w-[315px] md:max-w-[310px] lg:max-w-[305px] xl:max-w-[325px] 2xl:max-w-[335px] min-h-[320px] sm:min-h-[335px] xl:min-h-[350px] bg-white rounded-2xl sm:rounded-[22px] shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] border border-white/80 overflow-hidden flex flex-col justify-between"
        >
          {renderVisual()}
        </div>
      </div>

      {/* 2. Service Title & Description Below Visual Panel */}
      <div className="mt-4 sm:mt-5 px-1">
        <h3 className="text-base sm:text-[17px] font-semibold text-[#032E64] group-hover:text-[#00607A] transition-colors leading-snug tracking-tight">
          {service.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-[13px] text-[#475569] leading-relaxed line-clamp-3">
          {service.description}
        </p>
      </div>
    </Link>
  );
};
