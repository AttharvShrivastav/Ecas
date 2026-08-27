import React, { useState, useEffect } from 'react';
import { IdentificationBadge, MagnifyingGlass, Sparkle } from '@phosphor-icons/react';

export interface CertificateSearchFormProps {
  initialQuery?: string;
  isLoading?: boolean;
  onSearch: (certNumber: string) => void;
  className?: string;
}

const DEMO_SUGGESTIONS = [
  { label: 'IND/02/5482025', tag: 'Valid' },
  { label: 'ECA/MSC/2021/00412', tag: 'Expired' },
  { label: 'ECA/MSC/2026/01234', tag: 'Valid' },
  { label: 'ECA/SUS/2023/00889', tag: 'Suspended' },
];

export const CertificateSearchForm: React.FC<CertificateSearchFormProps> = ({
  initialQuery = '',
  isLoading = false,
  onSearch,
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a certificate number.');
      return;
    }
    setErrorMessage(null);
    onSearch(trimmed);
  };

  const handleDemoClick = (certNum: string) => {
    setQuery(certNum);
    setErrorMessage(null);
    onSearch(certNum);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} noValidate className="relative">
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl border p-2 sm:p-2.5 transition-all shadow-sm ${
            errorMessage
              ? 'border-[#EF4444] ring-2 ring-[#EF4444]/20'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] focus-within:border-[#032E64] focus-within:ring-2 focus-within:ring-[#032E64]/20'
          }`}
        >
          {/* Input field with Phosphor Icon */}
          <div className="relative flex-1 flex items-center min-w-0 px-3 py-2 sm:py-0">
            <IdentificationBadge
              size={24}
              className="text-[#94A3B8] shrink-0 mr-3 pointer-events-none"
              weight="regular"
            />
            <input
              type="text"
              id="certificate-search-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter certificate number"
              aria-label="Certificate number"
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? 'search-error-msg' : undefined}
              disabled={isLoading}
              className="w-full bg-transparent border-none text-[#082046] placeholder-[#94A3B8] text-base sm:text-lg font-medium focus:outline-none focus:ring-0 disabled:opacity-60"
            />
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setErrorMessage(null);
                }}
                className="text-[#94A3B8] hover:text-[#475569] p-1 text-xs uppercase tracking-wider font-semibold rounded-md"
                aria-label="Clear input"
              >
                Clear
              </button>
            )}
          </div>

          {/* Verify Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 sm:mt-0 px-6 sm:px-8 py-3 rounded-xl sm:rounded-xl text-white font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#0B1642] to-[#3261BC] hover:from-[#081133] hover:to-[#2850A0] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032E64]"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <MagnifyingGlass size={16} weight="bold" />
                <span>VERIFY</span>
              </>
            )}
          </button>
        </div>

        {/* Inline Validation Error */}
        {errorMessage && (
          <p
            id="search-error-msg"
            role="alert"
            className="mt-2 text-xs sm:text-sm font-semibold text-[#DC2626] flex items-center gap-1.5 px-2"
          >
            <span>{errorMessage}</span>
          </p>
        )}
      </form>

    </div>
  );
};
