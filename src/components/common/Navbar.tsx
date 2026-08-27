import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import { Button } from '../primitives/Button';

export interface ServiceMenuItem {
  title: string;
  slug: string;
  description?: string;
}

export const SERVICES_LIST: ServiceMenuItem[] = [
  {
    title: 'ESG',
    slug: 'esg',
    description: 'Environmental, social, and corporate governance assurance & verification frameworks.',
  },
  {
    title: 'Management System Certification',
    slug: 'management-system-certification',
    description: 'International ISO standards, quality, security, and environmental compliance.',
  },
  {
    title: 'Inspection',
    slug: 'inspection',
    description: 'Independent technical inspection, quality audits, and statutory evaluations.',
  },
  {
    title: 'Training',
    slug: 'training',
    description: 'Professional auditor qualification, lead auditor programs, and standard seminars.',
  },
  {
    title: 'Product Certification',
    slug: 'product-certification',
    description: 'European conformity assessment, CE marking compliance, and product safety testing.',
  },
  {
    title: 'CBAM Verification',
    slug: 'cbam-verification',
    description: 'Carbon Border Adjustment Mechanism greenhouse gas emissions reporting and compliance verification.',
  },
];

export const Navbar: React.FC = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesExpanded, setIsMobileServicesExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const location = useLocation();

  const navShellRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);
  const megaMenuInnerRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<SVGSVGElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus immediately on route change
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Setup master reversible GSAP timeline for shell expansion
  useEffect(() => {
    if (!navShellRef.current || !topBarRef.current || !megaMenuRef.current || !megaMenuInnerRef.current) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let ctx: gsap.Context | null = null;

    const buildTimeline = () => {
      if (ctx) {
        ctx.revert();
      }

      ctx = gsap.context(() => {
        // Measure actual dimensions
        const compactHeight = topBarRef.current ? topBarRef.current.offsetHeight : 60;
        const menuHeight = megaMenuInnerRef.current ? megaMenuInnerRef.current.offsetHeight : 240;
        const targetExpandedHeight = compactHeight + menuHeight;

        // Set initial compact state
        gsap.set(navShellRef.current, { height: compactHeight });
        gsap.set(megaMenuRef.current, { opacity: 0, y: -6, pointerEvents: 'none' });
        if (backdropRef.current) {
          gsap.set(backdropRef.current, { opacity: 0, pointerEvents: 'none' });
        }
        if (chevronRef.current) {
          gsap.set(chevronRef.current, { rotate: 0 });
        }

        // Build single master reversible timeline
        tl = gsap.timeline({
          paused: true,
          onStart: () => {
            if (megaMenuRef.current) {
              megaMenuRef.current.style.pointerEvents = 'auto';
            }
            if (backdropRef.current) {
              backdropRef.current.style.pointerEvents = 'auto';
            }
          },
          onReverseComplete: () => {
            if (megaMenuRef.current) {
              megaMenuRef.current.style.pointerEvents = 'none';
            }
            if (backdropRef.current) {
              backdropRef.current.style.pointerEvents = 'none';
            }
          },
        });

        // 1. Page overlay fade
        if (backdropRef.current) {
          tl.to(
            backdropRef.current,
            {
              opacity: 1,
              duration: 0.36,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // 2. Services chevron rotates to open state
        if (chevronRef.current) {
          tl.to(
            chevronRef.current,
            {
              rotate: 180,
              duration: 0.3,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // 3. Navbar shell continuous height expansion / collapse
        tl.to(
          navShellRef.current,
          {
            height: targetExpandedHeight,
            duration: 0.36,
            ease: 'power2.inOut',
          },
          0
        );

        // 4. Dropdown content fades in slightly after expansion starts / fades out first on reverse
        tl.to(
          megaMenuRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          },
          0.14
        );

        timelineRef.current = tl;
      }, navShellRef);
    };

    buildTimeline();

    const handleResize = () => {
      buildTimeline();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  // Sync state changes with GSAP timeline playback (play on open, reverse on close)
  useEffect(() => {
    if (prefersReducedMotion()) {
      if (navShellRef.current && megaMenuRef.current) {
        navShellRef.current.style.height = isServicesOpen ? 'auto' : '60px';
        megaMenuRef.current.style.opacity = isServicesOpen ? '1' : '0';
        megaMenuRef.current.style.pointerEvents = isServicesOpen ? 'auto' : 'none';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = isServicesOpen ? '1' : '0';
        backdropRef.current.style.pointerEvents = isServicesOpen ? 'auto' : 'none';
      }
      if (chevronRef.current) {
        chevronRef.current.style.transform = isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      return;
    }

    if (timelineRef.current) {
      if (isServicesOpen) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse();
      }
    }
  }, [isServicesOpen]);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (prefersReducedMotion()) {
      mobileMenuRef.current.style.display = isMobileMenuOpen ? 'block' : 'none';
      return;
    }

    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10, display: 'block' },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuRef.current) {
            mobileMenuRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [isMobileMenuOpen]);

  const openServices = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  const cancelCloseServices = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const closeServicesImmediately = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsServicesOpen(false);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsServicesOpen(false);
      }
    },
    []
  );

  return (
    <>
      {/* Subdued Backdrop Overlay (Fades in when Services expands) */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={() => setIsServicesOpen(false)}
        className="fixed inset-0 bg-[#032E64]/12 backdrop-blur-[1.5px] opacity-0 pointer-events-none z-30 transition-none"
      />

      {/* Navbar Container */}
      <header
        className="sticky top-4 z-40 w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10"
        onKeyDown={handleKeyDown}
      >
        {/* Continuous White Navbar Shell (Animates height downward on Services hover) */}
        <div
          ref={navShellRef}
          onMouseEnter={cancelCloseServices}
          onMouseLeave={scheduleCloseServices}
          className={`w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm transition-[box-shadow,border-color] duration-200 overflow-hidden ${
            isServicesOpen ? 'shadow-lg border-[#CBD5E1]' : ''
          }`}
        >
          {/* Top Bar Row (Compact Height: 60px) */}
          <div
            ref={topBarRef}
            className="h-[60px] px-5 sm:px-6 flex items-center justify-between"
          >
            {/* Logo on far left */}
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-ring rounded-md py-1"
              aria-label="ECASEURO Homepage"
              onClick={closeServicesImmediately}
            >
              {!logoError ? (
                <img
                  src="/images/brand/eca-logo.webp"
                  alt="ECASEURO"
                  className="h-9 sm:h-10 w-auto max-h-[42px] object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : null}

              {/* Text mark fallback so layout never collapses before public logo asset is loaded */}
              {logoError && (
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#032E64] flex items-center justify-center text-white font-bold text-xs tracking-wider">
                    ECA
                  </div>
                  <span className="text-base font-bold tracking-tight text-[#032E64]">
                    ECASEURO
                  </span>
                </div>
              )}
            </Link>

            {/* Central Navigation Links (Desktop) */}
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-2"
              aria-label="Main Navigation"
            >
              {/* About Us */}
              <Link
                to="/about"
                onMouseEnter={closeServicesImmediately}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                  location.pathname === '/about'
                    ? 'text-[#032E64] font-semibold bg-[#F1F4F7]'
                    : 'text-[#475569] hover:text-[#032E64] hover:bg-[#F8FAFB]'
                }`}
              >
                About Us
              </Link>

              {/* Services (Dropdown Trigger) */}
              <div
                className="relative"
                onMouseEnter={openServices}
              >
                <button
                  type="button"
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-controls="services-mega-menu"
                  onClick={() => setIsServicesOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring cursor-pointer select-none ${
                    isServicesOpen || location.pathname.startsWith('/services')
                      ? 'text-[#032E64] font-semibold bg-[#F1F4F7]'
                      : 'text-[#475569] hover:text-[#032E64] hover:bg-[#F8FAFB]'
                  }`}
                >
                  <span>Services</span>
                  <svg
                    ref={chevronRef}
                    className="w-4 h-4 text-[#64748B] transition-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Associations */}
              <Link
                to="/associations"
                onMouseEnter={closeServicesImmediately}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                  location.pathname === '/associations'
                    ? 'text-[#032E64] font-semibold bg-[#F1F4F7]'
                    : 'text-[#475569] hover:text-[#032E64] hover:bg-[#F8FAFB]'
                }`}
              >
                Associations
              </Link>

              {/* News & Insights */}
              <Link
                to="/news"
                onMouseEnter={closeServicesImmediately}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                  location.pathname.startsWith('/news')
                    ? 'text-[#032E64] font-semibold bg-[#F1F4F7]'
                    : 'text-[#475569] hover:text-[#032E64] hover:bg-[#F8FAFB]'
                }`}
              >
                News
              </Link>

              {/* Contact Us */}
              <Link
                to="/contact"
                onMouseEnter={closeServicesImmediately}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                  location.pathname === '/contact'
                    ? 'text-[#032E64] font-semibold bg-[#F1F4F7]'
                    : 'text-[#475569] hover:text-[#032E64] hover:bg-[#F8FAFB]'
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* Right: Verify Certificate CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                href="/verify-certificate"
                arrowHover={true}
                className="hidden sm:inline-flex"
                onClick={closeServicesImmediately}
              >
                Verify Certificate
              </Button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg text-[#032E64] hover:bg-[#F1F4F7] focus-ring"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isMobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded Mega-Menu Surface Inside the Continuous Shell */}
          <div
            ref={megaMenuRef}
            id="services-mega-menu"
            className="border-t border-[#E2E8F0] overflow-hidden"
          >
            <div ref={megaMenuInnerRef} className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left / Main: Exactly the 5 Approved Services */}
                <div className="lg:col-span-8">
                  <div className="mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#00607A]">
                      Certification & Assurance Services
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SERVICES_LIST.map((service) => {
                      const href = `/services/${service.slug}`;
                      const isActive = location.pathname === href;

                      return (
                        <Link
                          key={service.slug}
                          to={href}
                          onClick={closeServicesImmediately}
                          className={`group p-3 rounded-xl transition-colors duration-150 focus-ring border ${
                            isActive
                              ? 'bg-[#E8EEF3] border-[#CBD5E1]'
                              : 'bg-white hover:bg-[#F8FAFB] border-transparent hover:border-[#E2E8F0]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#032E64] group-hover:text-[#00607A] transition-colors">
                              {service.title}
                            </span>
                            <svg
                              className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00607A] group-hover:translate-x-0.5 transition-all"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                          {service.description && (
                            <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">
                              {service.description}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Structural Supporting Spacing (Reserved for future visual, no fake images) */}
                <div className="hidden lg:flex lg:col-span-4 flex-col justify-between h-full min-h-[190px] bg-[#F8FAFB] rounded-xl p-5 border border-[#E2E8F0]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      ECA Accreditation Scope
                    </span>
                    <h4 className="text-sm font-bold text-[#032E64] mt-1">
                      Independent Global Conformity
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      ECASEURO delivers accredited management system certifications and technical assessments complying with EA and IAF guidelines.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                    <Link
                      to="/associations"
                      onClick={closeServicesImmediately}
                      className="text-xs font-semibold text-[#00607A] hover:text-[#032E64] inline-flex items-center gap-1 focus-ring"
                    >
                      <span>View Accreditations & Associations</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel (Responsive Fallback) */}
        <div
          ref={mobileMenuRef}
          style={{ display: 'none' }}
          className="md:hidden mt-2 bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-lg overflow-hidden"
        >
          <nav className="flex flex-col gap-1 text-sm font-medium text-[#475569]">
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F1F4F7] hover:text-[#032E64]"
            >
              About Us
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileServicesExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F1F4F7] hover:text-[#032E64] text-left cursor-pointer"
              >
                <span>Services</span>
                <svg
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-150 ${
                    isMobileServicesExpanded ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isMobileServicesExpanded && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-[#F8FAFB] rounded-lg mt-1 border border-[#E2E8F0]">
                  {SERVICES_LIST.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2.5 py-1.5 text-xs text-[#032E64] hover:bg-white rounded-md font-medium"
                    >
                      {s.title}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-2.5 py-1.5 text-xs text-[#00607A] font-semibold underline"
                  >
                    All Services Index &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/associations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F1F4F7] hover:text-[#032E64]"
            >
              Associations
            </Link>

            <Link
              to="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F1F4F7] hover:text-[#032E64]"
            >
              News & Insights
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F1F4F7] hover:text-[#032E64]"
            >
              Contact Us
            </Link>

            <div className="pt-3 mt-2 border-t border-[#E2E8F0]">
              <Button
                variant="primary"
                href="/verify-certificate"
                arrowHover={true}
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Verify Certificate
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
