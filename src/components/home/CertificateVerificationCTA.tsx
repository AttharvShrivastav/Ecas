import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../primitives/Button';
import { defaultCertificateShortcutContent } from '../../cms/homeContent';
import type { CertificateShortcutContent } from '../../cms/types';

export interface CertificateVerificationCTAProps {
  content?: CertificateShortcutContent;
}

/**
 * CertificateVerificationCTA Component
 *
 * "Verify an ECASEURO certificate" Banner
 *
 * Source of Truth: Approved Figma Desktop Composition
 * - Wide rounded horizontal banner with confirmed #0F1B4A -> #6B96CC gradient (.bg-cta-gradient)
 * - Lightweight code-generated decorative orbital lines cropped at top-left and bottom-right
 * - Left: Multi-line display heading
 * - Right: Certificate search form with text input + "VERIFY TODAY" submit button
 * - Validated submission cleanly navigates to /verify-certificate?cert_no=<encoded_cert>
 */
export const CertificateVerificationCTA: React.FC<CertificateVerificationCTAProps> = ({
  content = defaultCertificateShortcutContent,
}) => {
  const [certNo, setCertNo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = certNo.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a certificate number to verify.');
      inputRef.current?.focus();
      return;
    }

    setErrorMessage(null);
    const encoded = encodeURIComponent(trimmed);
    navigate(`/verify-certificate?cert_no=${encoded}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertNo(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return (
    <section
      id="certificate-verification-shortcut"
      aria-labelledby="certificate-verification-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-16 sm:pb-24 lg:pb-28"
    >
      {/* Banner Container with Confirmed CTA Gradient */}
      <div className="relative w-full bg-cta-gradient rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden text-white px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-12 shadow-sm">
        {/* Decorative Orbital Lines (Top-Left) */}
        <div
          className="absolute -top-16 -left-16 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
            <circle cx="20" cy="20" r="40" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <circle cx="20" cy="20" r="70" stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="20" cy="20" r="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="20" cy="20" r="130" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="20" cy="20" r="160" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </svg>
        </div>

        {/* Decorative Orbital Lines (Bottom-Right) */}
        <div
          className="absolute -bottom-16 -right-16 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
            <circle cx="180" cy="180" r="40" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <circle cx="180" cy="180" r="70" stroke="rgba(255,255,255,0.11)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="180" cy="180" r="100" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            <circle cx="180" cy="180" r="135" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="180" cy="180" r="170" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </svg>
        </div>

        {/* Banner Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-6 xl:col-span-5">
            <h2
              id="certificate-verification-heading"
              className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-normal leading-[1.18] tracking-[-0.02em] text-white whitespace-pre-line"
            >
              {content.heading}
            </h2>
          </div>

          {/* Right Column: Search Form */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-stretch lg:items-end justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5"
              noValidate
            >
              <div className="relative flex-1">
                <label
                  htmlFor="homepage-certificate-input"
                  className="sr-only"
                >
                  Certificate Number
                </label>
                <input
                  ref={inputRef}
                  id="homepage-certificate-input"
                  type="text"
                  value={certNo}
                  onChange={handleInputChange}
                  placeholder={content.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-white text-[#0F172A] placeholder-[#94A3B8] text-xs sm:text-sm font-medium tracking-normal border border-white/60 focus-ring shadow-xs"
                />
              </div>

              {/* Reusable GSAP Button with Dark Navy Styling */}
              <div className="shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  arrowHover={true}
                  className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#0B1642] hover:bg-[#0F1B4A]"
                >
                  {content.buttonLabel}
                </Button>
              </div>
            </form>

            {/* Restrained Inline Validation Message */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-2 text-xs text-[#FEE2E2] font-medium tracking-normal text-left sm:text-right w-full"
              >
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
