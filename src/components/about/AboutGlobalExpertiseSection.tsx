import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  ShieldPlus,
  ChatTeardropText,
  Desktop,
  Briefcase,
  Pill,
  MapPin,
  Flame,
  Lightning,
  HardHat,
  Gear,
  Flask,
  ForkKnife,
  FirstAid,
} from '@phosphor-icons/react';
import { defaultAboutGlobalExpertiseContent } from '../../cms/aboutContent';
import type { AboutGlobalExpertiseContent } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface AboutGlobalExpertiseSectionProps {
  content?: AboutGlobalExpertiseContent;
}

/* =========================================================
   INDUSTRY ICON MAPPER
   ========================================================= */

const getIndustryIcon = (iconKey: string) => {
  switch (iconKey.toLowerCase()) {
    case 'oil-gas':
    case 'oil':
    case 'gas':
      return ShieldPlus;

    case 'power':
    case 'energy':
      return ChatTeardropText;

    case 'mining':
    case 'tech':
    case 'technology':
    case 'monitor':
    case 'desktop':
      return Desktop;

    case 'construction':
      return Briefcase;

    case 'chemical':
    case 'pharma':
    case 'pill':
      return Pill;

    case 'food':
    case 'agriculture':
      return MapPin;

    case 'engineering':
      return Gear;

    case 'flame':
      return Flame;

    case 'lightning':
      return Lightning;

    case 'hardhat':
      return HardHat;

    case 'flask':
      return Flask;

    case 'forkknife':
      return ForkKnife;

    case 'firstaid':
      return FirstAid;

    default:
      return ShieldCheck;
  }
};

/* =========================================================
   COUNTRY FLAGS
   ========================================================= */

const getCountryFlag = (country: string) => {
  const key = country.trim().toLowerCase();

  const flags: Record<string, string> = {
    oman: '/images/flags/oman.svg',
    qatar: '/images/flags/qatar.svg',
    belgium: '/images/flags/belgium.svg',
    india: '/images/flags/india.svg',
  };

  return flags[key];
};

/* =========================================================
   COMPONENT
   ========================================================= */

export const AboutGlobalExpertiseSection: React.FC<
  AboutGlobalExpertiseSectionProps
> = ({ content = defaultAboutGlobalExpertiseContent }) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);

  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  /*
   * Marquee refs
   *
   * viewport = clipped visible blue strip
   * track    = element GSAP translates
   * set      = first complete icon sequence whose width we measure
   */
  const marqueeViewportRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const marqueeSetRef = useRef<HTMLDivElement | null>(null);

  const industryItems = content.industries.items;

  const defaultActiveIndustryId =
    industryItems[2]?.id ||
    industryItems[0]?.id ||
    'mining';

  const [activeIndustryId, setActiveIndustryId] = useState<string>(
    defaultActiveIndustryId
  );

  /* =========================================================
     COUNTRY POSITIONS
     ========================================================= */

  const countryPositions = [
    {
      top: '16%',
      left: '8%',
    },
    {
      top: '14%',
      right: '10%',
    },
    {
      bottom: '34%',
      left: '15%',
    },
    {
      bottom: '20%',
      right: '10%',
    },
  ];

  /* =========================================================
     ENTRANCE + RIGHT COLUMN SCROLL ALIGNMENT
     ========================================================= */

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      /* Entrance */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: {
          ease: 'power2.out',
        },
      });

      if (headingRef.current) {
        entranceTl.fromTo(
          headingRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      }

      if (descRef.current) {
        entranceTl.fromTo(
          descRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.45,
          },
          '-=0.3'
        );
      }

      if (leftColRef.current) {
        entranceTl.fromTo(
          leftColRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          },
          '-=0.25'
        );
      }

      if (rightColRef.current) {
        entranceTl.fromTo(
          rightColRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          },
          '-=0.35'
        );
      }

      /* Desktop asymmetric column motion */
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        if (!rightColRef.current || !sectionRef.current) {
          return;
        }

        gsap.fromTo(
          rightColRef.current,
          {
            y: 75,
          },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 1,
            },
          }
        );
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =========================================================
     GSAP INFINITE INDUSTRY MARQUEE
     ========================================================= */

  useEffect(() => {
    const viewport = marqueeViewportRef.current;
    const track = marqueeTrackRef.current;
    const firstSet = marqueeSetRef.current;

    if (
      !viewport ||
      !track ||
      !firstSet ||
      industryItems.length === 0
    ) {
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(track, {
        x: 0,
      });

      return;
    }

    let marqueeTween: gsap.core.Tween | null = null;
    let resizeObserver: ResizeObserver | null = null;

    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;

    const buildMarquee = () => {
      if (!track || !firstSet) return;

      marqueeTween?.kill();
      marqueeTween = null;

      gsap.set(track, {
        x: 0,
      });

      /*
       * Because Set 2 is an exact duplicate of Set 1,
       * translating exactly the width of Set 1 gives us
       * a mathematically seamless loop.
       */
      const setWidth = firstSet.getBoundingClientRect().width;

      if (setWidth <= 0) {
        return;
      }

      /*
       * Approximate marquee speed:
       * 45 px per second.
       *
       * Smaller number = slower.
       * Larger number = faster.
       */
      const pixelsPerSecond = 45;
      const duration = setWidth / pixelsPerSecond;

      marqueeTween = gsap.fromTo(
        track,
        {
          x: 0,
        },
        {
          x: -setWidth,
          duration,
          ease: 'none',
          repeat: -1,
        }
      );
    };

    /*
     * Wait for layout to settle before measuring.
     */
    const frame = requestAnimationFrame(() => {
      buildMarquee();
    });

    /*
     * Re-measure if responsive layout changes.
     */
    resizeObserver = new ResizeObserver(() => {
      if (rebuildTimer) {
        clearTimeout(rebuildTimer);
      }

      rebuildTimer = setTimeout(() => {
        buildMarquee();
      }, 100);
    });

    resizeObserver.observe(firstSet);

    /* Pause interaction */
    const pauseMarquee = () => {
      marqueeTween?.pause();
    };

    const resumeMarquee = () => {
      marqueeTween?.resume();
    };

    viewport.addEventListener('pointerenter', pauseMarquee);
    viewport.addEventListener('pointerleave', resumeMarquee);

    viewport.addEventListener('focusin', pauseMarquee);
    viewport.addEventListener('focusout', resumeMarquee);

    return () => {
      cancelAnimationFrame(frame);

      if (rebuildTimer) {
        clearTimeout(rebuildTimer);
      }

      resizeObserver?.disconnect();

      viewport.removeEventListener(
        'pointerenter',
        pauseMarquee
      );

      viewport.removeEventListener(
        'pointerleave',
        resumeMarquee
      );

      viewport.removeEventListener(
        'focusin',
        pauseMarquee
      );

      viewport.removeEventListener(
        'focusout',
        resumeMarquee
      );

      marqueeTween?.kill();

      gsap.set(track, {
        clearProps: 'transform',
      });
    };
  }, [industryItems]);

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      ref={sectionRef}
      id="global-expertise"
      aria-label="Global Expertise, Local Understanding"
      className="
        w-full
        bg-[#EEEEEE]
        px-4
        py-12

        sm:px-6
        sm:py-16

        md:py-20

        lg:px-8
        lg:py-24

        xl:px-10

        2xl:px-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1380px]

          xl:max-w-[1560px]

          2xl:max-w-[1680px]
        "
      >
        {/* =====================================================
            TOP ROW
            ===================================================== */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            items-start
            gap-6

            sm:mb-12

            lg:mb-14
            lg:grid-cols-12
            lg:gap-12

            xl:gap-16
          "
        >
          <div className="lg:col-span-6">
            <h2
              ref={headingRef}
              className="
                whitespace-pre-line
                text-3xl
                font-normal
                leading-[1.12]
                tracking-[-0.025em]
                text-[#082046]

                sm:text-4xl

                lg:text-[42px]

                xl:text-[48px]
              "
            >
              {content.heading}
            </h2>
          </div>

          <div
            className="
              flex
              justify-start

              lg:col-span-6
              lg:justify-end
              lg:pt-2
            "
          >
            <p
              ref={descRef}
              className="
                max-w-lg
                text-sm
                font-normal
                leading-relaxed
                text-slate-600

                sm:text-base

                lg:text-right
                lg:text-[16px]
              "
            >
              {content.description}
            </p>
          </div>
        </div>

        {/* =====================================================
            COLLAGE
            ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-6

            lg:grid-cols-2
            lg:gap-8

            xl:gap-10
          "
        >
          {/* ===================================================
              LEFT COLUMN
              =================================================== */}

          <div
            ref={leftColRef}
            className="
              flex
              flex-col
              gap-6

              lg:gap-8
            "
          >
            {/* =================================================
                CARD 01 — COUNTRIES
                ================================================= */}

            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.countries.headline} - ${content.countries.subtitle}`}
              className="
                group
                relative
                flex
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                border-slate-200/80
                bg-gradient-to-r
                from-[#F2F5FB]
                to-[#DCDEFA]
                p-6
                shadow-xs
                outline-none

                focus-visible:ring-2
                focus-visible:ring-[#032E64]

                sm:rounded-2xl
                sm:p-7

                lg:h-[480px]
                lg:p-8

                xl:h-[500px]
              "
            >
              {/* TEXT */}

              <div className="relative z-20 shrink-0">
                <h3
                  className="
                    text-3xl
                    font-normal
                    leading-tight
                    tracking-tight
                    text-[#082046]

                    sm:text-4xl

                    lg:text-[38px]
                  "
                >
                  {content.countries.headline}
                </h3>

                <h4
                  className="
                    mt-3
                    text-base
                    font-medium
                    text-[#082046]

                    sm:mt-4
                    sm:text-lg
                  "
                >
                  {content.countries.subtitle}
                </h4>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-xs
                    font-normal
                    leading-relaxed
                    text-slate-600

                    sm:text-[13.5px]
                  "
                >
                  {content.countries.description}
                </p>

                {content.countries.subDescription && (
                  <p
                    className="
                      text-xs
                      font-normal
                      leading-relaxed
                      text-slate-600

                      sm:text-[13.5px]
                    "
                  >
                    {content.countries.subDescription}
                  </p>
                )}
              </div>

              {/* GLOBE */}

              <div
                className="
                  relative
                  flex
                  min-h-[200px]
                  w-full
                  flex-1
                  items-end
                  justify-center
                  pt-4

                  sm:min-h-[220px]

                  lg:min-h-0
                "
              >
                <img
                  src="/images/about/global-countries.svg"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    h-full
                    max-h-[230px]
                    w-full
                    select-none
                    object-contain
                    object-bottom
                    opacity-85
                    transition-opacity
                    duration-300

                    group-hover:opacity-95

                    xl:max-h-[250px]
                  "
                />

                {/* COUNTRY PILLS */}

                {content.countries.locations.map(
                  (location, idx) => {
                    const pos =
                      countryPositions[idx] || {
                        top: '50%',
                        left: '50%',
                      };

                    const flag = getCountryFlag(location);

                    return (
                      <div
                        key={location}
                        tabIndex={0}
                        role="text"
                        className="
                          absolute
                          z-10
                          flex
                          cursor-default
                          select-none
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200/90
                          bg-white/95
                          px-3
                          py-1.5
                          shadow-xs
                          backdrop-blur-xs
                          transition-all
                          duration-200

                          hover:border-slate-300
                          hover:bg-white
                          hover:shadow-md

                          sm:gap-2.5
                          sm:rounded-2xl
                          sm:px-4
                          sm:py-2
                        "
                        style={pos}
                      >
                        {flag ? (
                          <span
                            aria-hidden="true"
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-full
                              bg-white
                              shadow-sm
                              ring-1
                              ring-slate-200

                              sm:h-7
                              sm:w-7
                            "
                          >
                            <img
                              src={flag}
                              alt=""
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="
                              inline-block
                              h-5
                              w-5
                              shrink-0
                              rounded-full
                              bg-slate-300/80
                              shadow-inner

                              sm:h-6
                              sm:w-6
                            "
                          />
                        )}

                        <span
                          className="
                            whitespace-nowrap
                            text-xs
                            font-medium
                            tracking-wide
                            text-[#082046]

                            sm:text-sm
                          "
                        >
                          {location}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </article>

            {/* =================================================
                CARD 02 — WORLDWIDE
                ================================================= */}

            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.worldwide.headline} - ${content.worldwide.subtitle}`}
              className="
                group
                flex
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-xs
                outline-none
                transition-colors
                duration-300

                focus-visible:ring-2
                focus-visible:ring-[#032E64]

                sm:rounded-2xl
                sm:p-7

                lg:h-[560px]
                lg:p-8

                xl:h-[580px]
              "
            >
              <div className="shrink-0">
                <h3
                  className="
                    text-3xl
                    font-normal
                    leading-tight
                    tracking-tight
                    text-[#082046]

                    sm:text-4xl

                    lg:text-[38px]
                  "
                >
                  {content.worldwide.headline}
                </h3>

                <h4
                  className="
                    mt-3
                    text-base
                    font-medium
                    text-[#082046]

                    sm:mt-4
                    sm:text-lg
                  "
                >
                  {content.worldwide.subtitle}
                </h4>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-xs
                    font-normal
                    leading-relaxed
                    text-slate-600

                    sm:text-[13.5px]
                  "
                >
                  {content.worldwide.description}
                </p>
              </div>

              <div
                className="
                  mt-6
                  min-h-[220px]
                  w-full
                  flex-1
                  overflow-hidden
                  rounded-xl
                  bg-slate-100

                  sm:mt-7
                  sm:min-h-[260px]
                  sm:rounded-2xl

                  lg:min-h-0
                "
              >
                <img
                  src={
                    content.worldwide.image?.src ||
                    '/images/about/global-worldwide.webp'
                  }
                  alt={
                    content.worldwide.image?.alt ||
                    'Worldwide certification and global capability'
                  }
                  className="
                    h-full
                    w-full
                    rounded-xl
                    object-cover
                    object-center
                    opacity-95
                    transition-opacity
                    duration-300

                    group-hover:opacity-100

                    sm:rounded-2xl
                  "
                />
              </div>
            </article>
          </div>

          {/* ===================================================
              RIGHT COLUMN
              =================================================== */}

          <div
            ref={rightColRef}
            className="
              flex
              flex-col
              gap-6

              lg:gap-8
            "
          >
            {/* =================================================
                CARD 03 — OFFICES
                ================================================= */}

            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.offices.headline} - ${content.offices.subtitle}`}
              className="
                group
                flex
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-xs
                outline-none
                transition-colors
                duration-300

                focus-visible:ring-2
                focus-visible:ring-[#032E64]

                sm:rounded-2xl
                sm:p-7

                lg:h-[630px]
                lg:p-8

                xl:h-[650px]
              "
            >
              <div
                className="
                  mb-4
                  flex
                  min-h-[240px]
                  w-full
                  flex-1
                  items-center
                  justify-center
                  p-2

                  sm:mb-6
                  sm:min-h-[280px]
                  sm:p-4

                  lg:min-h-0
                "
              >
                <img
                  src="/images/about/global-offices.svg"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    h-auto
                    max-h-[360px]
                    w-full
                    max-w-[360px]
                    select-none
                    object-contain
                    opacity-90
                    transition-opacity
                    duration-300

                    group-hover:opacity-100

                    sm:max-w-[420px]

                    xl:max-h-[400px]
                    xl:max-w-[460px]
                  "
                />
              </div>

              <div className="shrink-0">
                <h3
                  className="
                    text-3xl
                    font-normal
                    leading-tight
                    tracking-tight
                    text-[#082046]

                    sm:text-4xl

                    lg:text-[38px]
                  "
                >
                  {content.offices.headline}
                </h3>

                <h4
                  className="
                    mt-3
                    text-base
                    font-medium
                    text-[#082046]

                    sm:mt-4
                    sm:text-lg
                  "
                >
                  {content.offices.subtitle}
                </h4>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-xs
                    font-normal
                    leading-relaxed
                    text-slate-600

                    sm:text-[13.5px]
                  "
                >
                  {content.offices.description}
                </p>
              </div>
            </article>

            {/* =================================================
                CARD 04 — INDUSTRIES
                ================================================= */}

            <article
              tabIndex={0}
              role="region"
              aria-label={`${content.industries.headline} - ${content.industries.subtitle}`}
              className="
                group
                flex
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-xs
                outline-none
                transition-colors
                duration-300

                focus-visible:ring-2
                focus-visible:ring-[#032E64]

                sm:rounded-2xl
                sm:p-7

                lg:h-[410px]
                lg:p-8

                xl:h-[430px]
              "
            >
              {/* ===============================================
                  INDUSTRY MARQUEE
                  =============================================== */}

              <div
                ref={marqueeViewportRef}
                role="toolbar"
                aria-label="Industries we serve"
                className="
                  relative
                  mb-4
                  h-[64px]
                  w-full
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  bg-gradient-to-r
                  from-[#1B3679]
                  via-[#284E94]
                  to-[#4572B8]
                  shadow-xs

                  sm:mb-6
                  sm:h-[72px]
                  sm:rounded-2xl
                "
              >
                {/* LEFT MASK */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    z-20
                    w-6
                    bg-gradient-to-r
                    from-[#1B3679]
                    to-transparent

                    sm:w-10
                  "
                />

                {/* RIGHT MASK */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    z-20
                    w-6
                    bg-gradient-to-l
                    from-[#4572B8]
                    to-transparent

                    sm:w-10
                  "
                />

                {/* VERTICAL CENTRING WRAPPER */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    overflow-hidden
                  "
                >
                  {/* MOVING TRACK */}

                  <div
                    ref={marqueeTrackRef}
                    className="
                      flex
                      w-max
                      max-w-none
                      shrink-0
                      flex-row
                      flex-nowrap
                      items-center
                      will-change-transform
                    "
                  >
                    {/* ===========================================
                        PRIMARY SET
                        =========================================== */}

                    <div
                      ref={marqueeSetRef}
                      className="
                        flex
                        w-max
                        shrink-0
                        flex-row
                        flex-nowrap
                        items-center
                        gap-2
                        pr-2

                        sm:gap-3
                        sm:pr-3
                      "
                    >
                      {industryItems.map((industry) => {
                        const isActive =
                          industry.id === activeIndustryId;

                        const IconComp = getIndustryIcon(
                          industry.iconKey
                        );

                        return (
                          <button
                            key={`industry-primary-${industry.id}`}
                            type="button"
                            aria-label={industry.label}
                            aria-pressed={isActive}
                            onPointerEnter={() =>
                              setActiveIndustryId(industry.id)
                            }
                            onFocus={() =>
                              setActiveIndustryId(industry.id)
                            }
                            onClick={() =>
                              setActiveIndustryId(industry.id)
                            }
                            className={`
                              relative
                              flex
                              flex-none
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              outline-none
                              transition-[background-color,color,box-shadow]
                              duration-200

                              sm:rounded-2xl

                              ${
                                isActive
                                  ? `
                                    h-[46px]
                                    w-[46px]
                                    bg-white
                                    text-[#082046]
                                    shadow-sm

                                    sm:h-[50px]
                                    sm:w-[50px]
                                  `
                                  : `
                                    h-[42px]
                                    w-[42px]
                                    bg-white/10
                                    text-white/80

                                    hover:bg-white/20
                                    hover:text-white

                                    sm:h-[46px]
                                    sm:w-[46px]
                                  `
                              }

                              focus-visible:ring-2
                              focus-visible:ring-white
                              focus-visible:ring-offset-2
                              focus-visible:ring-offset-[#284E94]
                            `}
                          >
                            <IconComp
                              size={isActive ? 22 : 19}
                              weight={
                                isActive ? 'bold' : 'regular'
                              }
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* ===========================================
                        DUPLICATE SET
                        Decorative only.
                        Required for seamless wrap.
                        =========================================== */}

                    <div
                      aria-hidden="true"
                      className="
                        flex
                        w-max
                        shrink-0
                        flex-row
                        flex-nowrap
                        items-center
                        gap-2
                        pr-2

                        sm:gap-3
                        sm:pr-3
                      "
                    >
                      {industryItems.map((industry) => {
                        const isActive =
                          industry.id === activeIndustryId;

                        const IconComp = getIndustryIcon(
                          industry.iconKey
                        );

                        return (
                          <div
                            key={`industry-clone-${industry.id}`}
                            className={`
                              relative
                              flex
                              flex-none
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              transition-[background-color,color,box-shadow]
                              duration-200

                              sm:rounded-2xl

                              ${
                                isActive
                                  ? `
                                    h-[46px]
                                    w-[46px]
                                    bg-white
                                    text-[#082046]
                                    shadow-sm

                                    sm:h-[50px]
                                    sm:w-[50px]
                                  `
                                  : `
                                    h-[42px]
                                    w-[42px]
                                    bg-white/10
                                    text-white/80

                                    sm:h-[46px]
                                    sm:w-[46px]
                                  `
                              }
                            `}
                          >
                            <IconComp
                              size={isActive ? 22 : 19}
                              weight={
                                isActive ? 'bold' : 'regular'
                              }
                              aria-hidden="true"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===============================================
                  INDUSTRIES TEXT
                  =============================================== */}

              <div className="shrink-0">
                <h3
                  className="
                    text-3xl
                    font-normal
                    leading-tight
                    tracking-tight
                    text-[#082046]

                    sm:text-4xl

                    lg:text-[38px]
                  "
                >
                  {content.industries.headline}
                </h3>

                <h4
                  className="
                    mt-3
                    text-base
                    font-medium
                    text-[#082046]

                    sm:mt-4
                    sm:text-lg
                  "
                >
                  {content.industries.subtitle}
                </h4>

                <p
                  className="
                    mt-2
                    max-w-lg
                    text-xs
                    font-normal
                    leading-relaxed
                    text-slate-600

                    sm:text-[13.5px]
                  "
                >
                  Serving{' '}
                  <strong className="font-bold text-[#082046]">
                    organisations across Oil &amp; Gas, Power,
                    Mining, Construction, Engineering, Chemical,
                    Food
                  </strong>{' '}
                  and other industries.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};