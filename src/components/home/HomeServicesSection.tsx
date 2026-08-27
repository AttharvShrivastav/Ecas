import React from 'react';
import { Button } from '../primitives/Button';
import { ServiceCard } from './ServiceCard';
import { defaultHomeServicesContent } from '../../cms/homeContent';
import type { HomeServicesSectionContent } from '../../cms/types';

export interface HomeServicesSectionProps {
  content?: HomeServicesSectionContent;
}

/**
 * HomeServicesSection Component
 *
 * "Certification and compliance support for your organisation"
 *
 * Source of Truth: Approved Figma Desktop Composition
 * - Top row:
 *   - Left: Large multi-line section display heading
 *   - Right: Supporting paragraph + "EXPLORE ALL SERVICES" CTA button
 * - Bottom row:
 *   - 3 equal service cards with layered coded artwork visuals and titles/descriptions below
 */
export const HomeServicesSection: React.FC<HomeServicesSectionProps> = ({
  content = defaultHomeServicesContent,
}) => {
  return (
    <section
      id="featured-services"
      aria-labelledby="featured-services-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pt-10 sm:pt-14 lg:pt-20 pb-16 sm:pb-24 lg:pb-28"
    >
      {/* Top Row: Heading (Left) + Supporting Copy & CTA (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start justify-between">
        {/* Left Column: Semantic Section Heading */}
        <div className="lg:col-span-6 xl:col-span-6">
          <h2
            id="featured-services-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] font-normal sm:font-medium text-[#0F172A] leading-[1.12] tracking-[-0.02em] whitespace-pre-line"
          >
            {content.heading}
          </h2>
        </div>

        {/* Right Column: Supporting Paragraph & Compact Inset CTA Button */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start lg:items-end justify-between h-full pt-1 lg:pt-2">
          <div className="w-full max-w-xl lg:max-w-[460px] xl:max-w-[500px]">
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
              {content.description}
            </p>

            {/* Inset Explore All Services CTA (Right-aligned in upper-right column per Figma) */}
            <div className="mt-5 sm:mt-6 flex justify-start lg:justify-start">
              <Button
                href={content.cta.href}
                variant={content.cta.variant === 'secondary' ? 'secondary' : 'primary'}
                arrowHover={true}
                className="px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Equal Coded Featured Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mt-10 sm:mt-14 lg:mt-16">
        {content.services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
