import React, { useEffect, useRef, useState } from 'react';
import {
  ChatCircleText,
  ShieldCheck,
  Buildings,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { getPhosphorIconByKey } from '../admin/cms/CMSIconSelect';
import { defaultAboutConfidenceContent } from '../../cms/aboutContent';
import type { AboutConfidenceContent, AboutConfidenceItem } from '../../cms/types';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap';

export interface AboutConfidenceSectionProps {
  content?: AboutConfidenceContent;
}

const getConfidenceIcon = (icon: AboutConfidenceItem['icon'] | string) => {
  switch (icon) {
    case 'chat':
    case 'chat-circle-text':
      return ChatCircleText;
    case 'shield':
    case 'shield-check':
      return ShieldCheck;
    case 'buildings':
      return Buildings;
    case 'arrows-clockwise':
      return ArrowsClockwise;
    default:
      return getPhosphorIconByKey(icon);
  }
};

/**
 * Approved ECASEURO About "Confidence Behind Every Certification" Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshots
 * - Top Row:
 *   - Left: Semantic Display H2 ("Confidence Behind\nEvery Certification")
 *   - Right: Supporting paragraph
 * - Lower Area:
 *   - Large left image/placeholder that dynamically responds to the active/hovered card
 *   - 2x2 interactive card grid on the right
 *   - Default active card/image: Clear Communication
 *   - Active card state: CTA gradient (#0F1B4A -> #6B96CC), white text, white icon badge with dark navy icon
 *   - Inactive card state: Plain light surface, dark navy title, muted text, dark navy icon badge with white icon
 *   - GSAP image transition: subtle opacity crossfade only (no y, x, scale, blur, rotation)
 *   - Entrance sequence: Opacity only (Heading -> Description -> Left image -> 4 cards)
 */
export const AboutConfidenceSection: React.FC<AboutConfidenceSectionProps> = ({
  content = defaultAboutConfidenceContent,
}) => {
  const items = content.items;
  const defaultId = items[0]?.id || 'clear-communication';
  const [activeId, setActiveId] = useState<string>(defaultId);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Entrance animation (opacity-only)
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      });

      // 1. Heading fades in
      if (headingRef.current) {
        tl.fromTo(headingRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }

      // 2. Supporting copy fades in
      if (descRef.current) {
        tl.fromTo(descRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 }, '-=0.3');
      }

      // 3. Left image fades in
      if (imageContainerRef.current) {
        tl.fromTo(imageContainerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.55 }, '-=0.25');
      }

      // 4. Four cards fade in sequentially
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll('.confidence-card');
        tl.fromTo(
          cards,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Image crossfade on activeId change (opacity-only)
  useEffect(() => {
    if (prefersReducedMotion()) {
      items.forEach((item) => {
        const el = imageRefs.current[item.id];
        if (el) {
          el.style.opacity = item.id === activeId ? '1' : '0';
          el.style.pointerEvents = item.id === activeId ? 'auto' : 'none';
        }
      });
      return;
    }

    items.forEach((item) => {
      const el = imageRefs.current[item.id];
      if (el) {
        if (item.id === activeId) {
          gsap.to(el, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        } else {
          gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        }
      }
    });
  }, [activeId, items]);

  const handleCardHover = (id: string) => {
    setActiveId(id);
  };

  const handleContainerLeave = () => {
    // When pointer leaves the cards area, return smoothly to default (Clear Communication)
    setActiveId(defaultId);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Confidence Behind Every Certification"
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-[#EEEEEE]"
    >
      <div className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
        {/* TOP ROW: Heading & Supporting Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-start mb-10 sm:mb-12 lg:mb-14">
          <div className="lg:col-span-6 xl:col-span-6">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-normal leading-[1.12] tracking-[-0.025em] text-[#082046] whitespace-pre-line"
            >
              {content.heading}
            </h2>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 lg:pt-2">
            <p
              ref={descRef}
              className="text-sm sm:text-base lg:text-[16px] text-slate-600 font-normal leading-relaxed max-w-xl"
            >
              {content.description}
            </p>
          </div>
        </div>

        {/* LOWER AREA: Large Dynamic Image (Left) + 2x2 Interactive Cards Grid (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-stretch">
          {/* Large Left Image Column (~42% Desktop) */}
          <div
            ref={imageContainerRef}
            className="lg:col-span-5 xl:col-span-5 relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-auto lg:h-full min-h-[300px] sm:min-h-[360px] lg:min-h-0 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200/80 shadow-xs"
          >
            {items.map((item) => {
              const imageSrc =
                item.image?.src ||
                `/images/about/confidence-${item.id}.webp`;
              const imageAlt = item.image?.alt || item.title;
              const IconComp = getConfidenceIcon(item.icon);

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    imageRefs.current[item.id] = el;
                  }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    opacity: item.id === defaultId ? 1 : 0,
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover object-[center_12%]"
                    onError={(e) => {
                      // Fallback to elegant quiet placeholder if future image is pending
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = parent.querySelector('.confidence-placeholder');
                        if (placeholder) {
                          placeholder.classList.remove('hidden');
                        }
                      }
                    }}
                  />

                  {/* Quiet Editorial Placeholder Frame */}
                  <div
                    className={`confidence-placeholder hidden w-full h-full bg-gradient-to-br from-[#0B1A3D] via-[#142C61] to-[#345B9E] text-white p-8 flex flex-col justify-between select-none`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white/90">
                        <IconComp size={26} weight="regular" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-widest uppercase text-white/50">
                        ECASEURO ASSURANCE
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/60 font-medium block mb-2">
                        {item.title}
                      </span>
                      <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed max-w-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2x2 Interactive Card Grid (Right Column ~58% Desktop) */}
          <div
            ref={cardsContainerRef}
            onPointerLeave={handleContainerLeave}
            className="lg:col-span-7 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {items.map((item) => {
              const isActive = item.id === activeId;
              const IconComp = getConfidenceIcon(item.icon);

              return (
                <article
                  key={item.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={item.title}
                  onPointerEnter={() => handleCardHover(item.id)}
                  onFocus={() => handleCardHover(item.id)}
                  onClick={() => handleCardHover(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardHover(item.id);
                    }
                  }}
                  className={`confidence-card relative overflow-hidden rounded-xl sm:rounded-2xl p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] focus-visible:ring-offset-2 select-none min-h-[220px] sm:min-h-[240px] border ${
                    isActive
                      ? 'border-transparent shadow-md'
                      : 'border-slate-200/70 bg-white/40 hover:bg-white/70'
                  }`}
                >
                  {/* CTA Gradient Overlay for Active / Hovered Card (#0F1B4A -> #6B96CC) */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-cta-gradient pointer-events-none transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Card Content Top: Icon Badge */}
                  <div className="relative z-10 mb-6 sm:mb-8">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-colors duration-300 ${
                        isActive
                          ? 'bg-white text-[#082046]'
                          : 'bg-[#082046] text-white'
                      }`}
                    >
                      <IconComp size={24} weight="regular" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card Content Bottom: Title & Description */}
                  <div className="relative z-10">
                    <h3
                      className={`text-sm sm:text-[15px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#082046]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-2 text-xs sm:text-[13px] lg:text-sm leading-relaxed font-normal transition-colors duration-300 ${
                        isActive ? 'text-white/85' : 'text-slate-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
