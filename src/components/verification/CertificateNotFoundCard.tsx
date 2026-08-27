import React from 'react';
import { MagnifyingGlass, WarningCircle, EnvelopeSimple, Sparkle } from '@phosphor-icons/react';

export interface CertificateNotFoundCardProps {
  searchedQuery: string;
  onTryDemo: (certNumber: string) => void;
  className?: string;
}

export const CertificateNotFoundCard: React.FC<CertificateNotFoundCardProps> = ({
  searchedQuery,
  onTryDemo,
  className = '',
}) => {
  return (
    <div
      className={`w-full max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 text-center ${className}`}
      role="region"
      aria-label="Certificate Not Found"
    >
      {/* Icon Badge */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] mx-auto flex items-center justify-center mb-5">
        <MagnifyingGlass size={28} weight="bold" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
        Certificate Not Found
      </h2>

      <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-lg mx-auto leading-relaxed">
        We could not find an active or historical certificate record matching{' '}
        <span className="font-mono font-bold text-[#082046] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
          {searchedQuery}
        </span>
        . Please check the certificate number and try again.
      </p>

      {/* Helpful Troubleshooting Box */}
      <div className="mt-6 p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-xl mx-auto space-y-2.5 text-xs sm:text-sm text-[#475569]">
        <div className="flex items-center gap-2 font-bold text-[#032E64]">
          <WarningCircle size={18} weight="fill" />
          <span>Verification Guidelines</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-[#64748B] pl-1">
          <li>Ensure all slashes, hyphens, and numeric characters are included accurately.</li>
          <li>For certificates issued recently, allow up to 48 hours for global registry synchronization.</li>
          <li>
            If you believe this is an error, please email our compliance desk at{' '}
            <a
              href="mailto:certification@ecaseuro.com"
              className="text-[#032E64] font-semibold underline hover:text-[#00607A]"
            >
              certification@ecaseuro.com
            </a>
            .
          </li>
        </ul>
      </div>

      {/* Demo shortcuts */}
      <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
        <span className="font-semibold text-[#64748B] flex items-center gap-1">
          <Sparkle size={14} weight="fill" className="text-[#032E64]" />
          Try valid demo numbers:
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => onTryDemo('IND/02/5362023')}
            className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#082046] font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            IND/02/5362023
          </button>
          <button
            type="button"
            onClick={() => onTryDemo('ECA/02/5372023')}
            className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#082046] font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            ECA/02/5372023
          </button>
        </div>
      </div>
    </div>
  );
};
