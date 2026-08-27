import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/primitives/Button';
import {
  Compass,
  ShieldCheck,
  Certificate,
  Newspaper,
  ArrowUpRight,
} from '@phosphor-icons/react';

/**
 * ECASEURO Public 404 / Not Found Page
 *
 * Adheres strictly to ECASEURO's confirmed public design system:
 * - Rendered inside global neutral canvas (#EEEEEE)
 * - Public navigation header with standard desktop & mobile dropdowns
 * - Clean, elevated white card container with balanced vertical spacing
 * - Direct primary CTA ("Back to Home") and secondary CTA ("Contact Us")
 * - Helpful shortcuts to high-traffic public areas (Certificate Registry, ISO Standards, News)
 * - Shared global Footer
 */
export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | ECASEURO Certification & Verification';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "The page you are looking for does not exist or may have been moved. Return to the ECASEURO homepage or explore our certification and verification services."
      );
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col font-['DM_Sans']">
      {/* 1. Global Public Navbar */}
      <div className="w-full pt-3 sm:pt-4">
        <Navbar />
      </div>

      {/* 2. Main 404 Content Canvas */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-[#CBD5E1]/80 shadow-sm p-6 sm:p-10 lg:p-12 text-center relative overflow-hidden">

          {/* Large Typographic 404 Display */}
          <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#082046] tracking-tight leading-none mb-3 sm:mb-4 select-none">
            404
          </div>

          {/* Editorial Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082046] tracking-tight mb-3">
            Page Not Found
          </h1>

          {/* Concise Supporting Copy */}
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-md mx-auto mb-8">
            The page you are looking for does not exist, has been removed, or may have been moved to another location.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <Button
              variant="primary"
              href="/"
              arrowHover={true}
              className="min-w-[150px] sm:min-w-[160px] py-2.5 px-5"
            >
              Back to Home
            </Button>
            <Button
              variant="secondary"
              href="/contact"
              className="min-w-[150px] sm:min-w-[160px] py-2.5 px-5"
            >
              Contact Us
            </Button>
          </div>

          {/* Quick Helpful Navigation Shortcuts */}
          <div className="pt-8 border-t border-[#E2E8F0] text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4 text-center sm:text-left">
              Looking for one of these services?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/verify-certificate"
                className="group p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#032E64]/10 text-[#032E64] flex items-center justify-center">
                    <ShieldCheck size={16} weight="bold" />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-[#94A3B8] group-hover:text-[#082046] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#082046] block group-hover:text-[#00607A] transition-colors">
                    Verify Certificate
                  </span>
                  <span className="text-[11px] text-[#64748B] leading-tight block mt-0.5">
                    Official registry lookup
                  </span>
                </div>
              </Link>

              <Link
                to="/services/management-system-certification"
                className="group p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#032E64]/10 text-[#032E64] flex items-center justify-center">
                    <Certificate size={16} weight="bold" />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-[#94A3B8] group-hover:text-[#082046] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#082046] block group-hover:text-[#00607A] transition-colors">
                    ISO Certification
                  </span>
                  <span className="text-[11px] text-[#64748B] leading-tight block mt-0.5">
                    Management standards
                  </span>
                </div>
              </Link>

              <Link
                to="/news"
                className="group p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#032E64]/10 text-[#032E64] flex items-center justify-center">
                    <Newspaper size={16} weight="bold" />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-[#94A3B8] group-hover:text-[#082046] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#082046] block group-hover:text-[#00607A] transition-colors">
                    News & Insights
                  </span>
                  <span className="text-[11px] text-[#64748B] leading-tight block mt-0.5">
                    Industry updates & ESG
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Global Public Footer */}
      <div className="relative w-full overflow-hidden mt-auto">
        <Footer withGlobe={false} />
      </div>
    </div>
  );
};
