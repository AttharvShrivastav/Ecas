import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../primitives/Button';
import { defaultFooterContent } from '../../cms/homeContent';
import type { FooterContent, FooterNavItem } from '../../cms/types';
import { gsap, prefersReducedMotion } from '../../animations/gsap';

export interface FooterProps {
  content?: FooterContent;
  withGlobe?: boolean;
}

/**
 * Reusable Global Footer Component
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshots
 * - Upper Layer / Globe Composition: Large centered decorative globe asset (/images/home/footer-globe.webp)
 * - Lower Layer: Large white rounded card sitting over lower region of the globe
 * - Left Column:
 *   - Semantic display brand statement ("Certification\n& Inspection.\nAssured.")
 *   - Supporting copy
 *   - Certificate verification form (with inline validation -> /verify-certificate?cert_no=...)
 *   - Confirmed ECA logo (/images/brand/eca-logo.webp)
 * - Right Column:
 *   - Semantic navigation rows with thin horizontal dividers
 *   - Home (/), Associations (/associations), Contact Us (/contact)
 *   - Services: Expandable inline footer navigation group revealing the 5 approved service routes
 * - Bottom Row:
 *   - Copyright ("All Rights Reserved by ECASEURO")
 *   - Privacy Policy (/privacy-policy)
 *   - Terms of Use (/terms-of-use)
 */
export const Footer: React.FC<FooterProps> = ({
  content = defaultFooterContent,
  withGlobe = true,
}) => {
  const [certNumber, setCertNumber] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [globeError, setGlobeError] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const footerContainerRef = useRef<HTMLElement | null>(null);
  const globeContainerRef = useRef<HTMLDivElement | null>(null);
  const footerCardRef = useRef<HTMLDivElement | null>(null);
  const servicesSubmenuRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<SVGSVGElement | null>(null);
  const isSubmenuFirstRender = useRef(true);

  const navigate = useNavigate();

  // Entrance opacity animation for Footer container & Card
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !footerContainerRef.current) {
      return;
    }

    const container = footerContainerRef.current;
    const card = footerCardRef.current;
    const globe = globeContainerRef.current;

    const ctx = gsap.context(() => {
      if (card) {
        gsap.set(card, { opacity: 0 });
      }
      if (globe) {
        gsap.set(globe, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true,
        },
      });

      if (globe) {
        tl.to(globe, {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
        });
      }

      if (card) {
        tl.to(
          card,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power1.out',
          },
          globe ? '-=0.25' : 0
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  // Smooth GSAP accordion animation for Services footer sub-menu
  useLayoutEffect(() => {
    if (!servicesSubmenuRef.current) return;

    if (isSubmenuFirstRender.current) {
      isSubmenuFirstRender.current = false;
      if (isServicesOpen) {
        gsap.set(servicesSubmenuRef.current, { height: 'auto', opacity: 1 });
        if (chevronRef.current) gsap.set(chevronRef.current, { rotate: 180 });
      } else {
        gsap.set(servicesSubmenuRef.current, { height: 0, opacity: 0 });
        if (chevronRef.current) gsap.set(chevronRef.current, { rotate: 0 });
      }
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(servicesSubmenuRef.current, {
        height: isServicesOpen ? 'auto' : 0,
        opacity: isServicesOpen ? 1 : 0,
      });
      if (chevronRef.current) {
        gsap.set(chevronRef.current, { rotate: isServicesOpen ? 180 : 0 });
      }
      return;
    }

    if (isServicesOpen) {
      gsap.fromTo(
        servicesSubmenuRef.current,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.32,
          ease: 'power2.out',
        }
      );
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          rotate: 180,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    } else {
      gsap.to(servicesSubmenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
      });
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          rotate: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    }
  }, [isServicesOpen]);

  const handleVerifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = certNumber.trim();

    if (!trimmed) {
      setFormError('Please enter a certificate number.');
      inputRef.current?.focus();
      return;
    }

    setFormError(null);
    navigate(`/verify-certificate?cert_no=${encodeURIComponent(trimmed)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertNumber(e.target.value);
    if (formError) {
      setFormError(null);
    }
  };

  return (
    <footer
      ref={footerContainerRef}
      aria-label="Site Footer"
      className="relative w-full overflow-hidden"
    >
      {/* Scope 4: Centered Decorative Globe Asset tucked underneath CTA & behind Footer */}
      {withGlobe && (
        <div
          ref={globeContainerRef}
          aria-hidden="true"
          className="relative w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pointer-events-none select-none flex justify-center -mt-24 sm:-mt-36 md:-mt-48 lg:-mt-64 xl:-mt-72 2xl:-mt-80 -mb-28 sm:-mb-40 md:-mb-56 lg:-mb-72 xl:-mb-80 2xl:-mb-88 z-0"
        >
          <div className="w-[540px] sm:w-[720px] md:w-[920px] lg:w-[1100px] xl:w-[1320px] 2xl:w-[1460px] max-w-[96vw] flex justify-center">
            {!globeError ? (
              <img
                src="/images/home/footer-globe.webp"
                alt=""
                className="w-full h-auto object-contain object-top will-change-transform drop-shadow-2xs"
                onError={() => setGlobeError(true)}
              />
            ) : (
              /* High-fidelity vector globe fallback if local WebP is pending upload */
              <div className="w-full aspect-[2/1] rounded-t-full border border-dashed border-[#CBD5E1] bg-gradient-to-b from-white/40 to-transparent flex flex-col items-center justify-center p-8 text-center">
                <svg
                  className="w-16 h-16 text-[#032E64]/30 mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-xs font-semibold text-[#0B1642]/50 tracking-wider uppercase">
                  FOOTER GLOBE ASSET
                </span>
                <span className="text-[11px] text-[#64748B] mt-0.5">
                  /images/home/footer-globe.webp
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scope 5: Compact White Footer Card Inset Within #EEEEEE Canvas Overlapping Lower Globe */}
      <div className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-8 sm:pb-12 lg:pb-14 relative z-20">
        <div
          ref={footerCardRef}
          className="w-full bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 lg:p-10"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Brand Statement, Supporting Text, Certificate Search & Logo */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] xl:text-[38px] font-normal leading-[1.14] tracking-[-0.02em] text-[#0B1642] whitespace-pre-line mb-2.5 sm:mb-3">
                  {content.brandHeading}
                </h2>

                <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed max-w-md font-normal mb-5 sm:mb-6">
                  {content.description}
                </p>

                {/* Certificate Verification Form */}
                <form
                  onSubmit={handleVerifySubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 max-w-lg"
                >
                  <div className="flex-1 min-w-0">
                    <label htmlFor="footer-cert-input" className="sr-only">
                      Certificate Number
                    </label>
                    <input
                      id="footer-cert-input"
                      ref={inputRef}
                      type="text"
                      value={certNumber}
                      onChange={handleInputChange}
                      placeholder={content.verificationPlaceholder}
                      className="w-full px-4 py-2.5 sm:py-3 bg-[#EEEEEE] text-[#0B1642] placeholder-[#64748B] rounded-xl text-xs sm:text-sm font-medium border border-transparent focus:border-[#032E64] focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 transition-all"
                    />
                    {formError && (
                      <p className="text-xs text-rose-600 mt-1 font-medium pl-1">
                        {formError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="!bg-[#0B1642] hover:!bg-[#060F30] text-white shrink-0 shadow-sm"
                  >
                    {content.verificationButtonLabel}
                  </Button>
                </form>
              </div>

              {/* ECA Brand Logo */}
              <div className="pt-1 sm:pt-2">
                <Link
                  to="/"
                  aria-label="ECASEURO Homepage"
                  className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] rounded-2xl"
                >
                  <img
                    src={content.logoAsset.src}
                    alt={content.logoAsset.alt}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl shadow-2xs"
                  />
                </Link>
              </div>
            </div>

            {/* Right Column: Navigation Rows */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between h-full pt-1 lg:pt-2">
              <nav aria-label="Footer navigation" className="w-full">
                <ul className="flex flex-col w-full divide-y divide-[#CBD5E1]/60">
                  {content.navigation.map((navItem: FooterNavItem) => {
                    if (navItem.isExpandable) {
                      return (
                        <li key={navItem.id} className="py-2.5 sm:py-3.5">
                          {/* Services Expandable Row */}
                          <button
                            type="button"
                            onClick={() => setIsServicesOpen((prev) => !prev)}
                            aria-expanded={isServicesOpen}
                            aria-controls="footer-services-menu"
                            className="w-full flex items-center justify-between text-left text-base sm:text-[17px] lg:text-[18px] font-medium text-[#0B1642] hover:text-[#0066FF] focus-visible:text-[#0066FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] rounded-md py-0.5 cursor-pointer"
                          >
                            <span>{navItem.label}</span>
                            <svg
                              ref={chevronRef}
                              className="w-4 h-4 text-inherit transition-transform duration-200"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>

                          {/* Expandable Services Links (Native Footer List) */}
                          <div
                            id="footer-services-menu"
                            ref={servicesSubmenuRef}
                            className="overflow-hidden"
                          >
                            <ul className="pt-2.5 pb-1 pl-2 sm:pl-3 space-y-2">
                              {navItem.children?.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    to={child.href}
                                    className="text-xs sm:text-sm text-[#475569] hover:text-[#0066FF] focus-visible:text-[#0066FF] font-normal transition-colors block py-0.5"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={navItem.id} className="py-2.5 sm:py-3.5">
                        <Link
                          to={navItem.href || '/'}
                          className="block text-base sm:text-[17px] lg:text-[18px] font-medium text-[#0B1642] hover:text-[#0066FF] focus-visible:text-[#0066FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64] rounded-md py-0.5"
                        >
                          {navItem.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Bottom Row: Copyright & Legal Policy Links */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
            <p className="font-normal">{content.copyright}</p>

          </div>
        </div>
      </div>
    </footer>
  );
};
