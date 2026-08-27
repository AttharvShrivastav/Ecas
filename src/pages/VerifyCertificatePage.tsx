import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CertificateSearchForm } from '../components/verification/CertificateSearchForm';
import { CertificateResultCard } from '../components/verification/CertificateResultCard';
import { CertificateNotFoundCard } from '../components/verification/CertificateNotFoundCard';
import { CertificateLoadingState } from '../components/verification/CertificateLoadingState';
import { verifyCertificate } from '../services/certificateVerification';
import type { VerificationState } from '../types/verification';
import {
  ShieldCheck,
  CheckCircle,
  FileMagnifyingGlass,
  LockKey,
} from '@phosphor-icons/react';

/**
 * ECASEURO Verify Certificate Page (/verify-certificate)
 *
 * Source of Truth & Functional Scope:
 * - Frontend-only mock verification system for client demo & approval
 * - Supports instant validation, loading states, valid/expired/suspended status badges, and not-found states
 * - Modular design ready for production REST/GraphQL backend endpoint replacement
 */
export const VerifyCertificatePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read certificate parameter: strictly prioritize cert_no (with backward compatibility for cert/number)
  const certParam = searchParams.get('cert_no') || searchParams.get('cert') || searchParams.get('number') || '';

  const [state, setState] = useState<VerificationState>({ status: 'idle' });
  const [activeQuery, setActiveQuery] = useState(certParam);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Set document title & SEO metadata
  useEffect(() => {
    document.title =
      'Verify Certificate | ECASEURO Quality Registrar & Verification Registry';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Verify the validity and authenticity of certificates issued by ECASEURO. Enter your certificate number to view real-time status, accredited standard, and certified scope.'
      );
    }
  }, []);

  // Execute verification query against backend registry API
  const executeVerification = async (certNumber: string) => {
    const trimmed = certNumber.trim();
    if (!trimmed) return;

    setActiveQuery(trimmed);
    setState({ status: 'loading', query: trimmed });

    try {
      const result = await verifyCertificate(trimmed);

      if (result.success && result.record) {
        setState({ status: 'found', record: result.record });
      } else if (result.notFound) {
        setState({ status: 'not_found', query: trimmed });
      } else {
        setState({
          status: 'error',
          message: result.errorMessage || 'Unable to connect to registry. Please try again.',
        });
      }
    } catch {
      setState({
        status: 'error',
        message: 'Unable to connect to registry. Please try again.',
      });
    }

    // Restrained smooth scroll to result panel on mobile/small screens if needed
    setTimeout(() => {
      if (resultRef.current && window.innerWidth < 768) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleSearchSubmit = (certNumber: string) => {
    const trimmed = certNumber.trim();
    if (!trimmed) return;

    if (certParam === trimmed) {
      // Re-run if query didn't change
      executeVerification(trimmed);
    } else {
      // Updates URL search param -> triggers the useEffect to execute verification
      setSearchParams({ cert_no: trimmed }, { replace: true });
    }
  };

  // Restore result from shared URL or sync when URL param changes (e.g. homepage navigation, browser back/forward, shared link)
  useEffect(() => {
    if (certParam) {
      const trimmed = certParam.trim();
      setActiveQuery(trimmed);
      executeVerification(trimmed);
    } else {
      setActiveQuery('');
      setState({ status: 'idle' });
    }
  }, [certParam]);

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col font-sans">
      {/* 1. Global Navbar */}
      <div className="w-full pt-3 sm:pt-4">
        <Navbar />
      </div>

      {/* 2. Main Verify Content Canvas */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col items-center"
      >
        {/* Page Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#032E64]/8 text-[#032E64] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={16} weight="fill" />
            <span>Official Register</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#082046] tracking-tight leading-tight">
            Verify Certificate
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#475569] leading-relaxed">
            Enter a certificate number to verify its current details and status.
          </p>
        </div>

        {/* 3. Search Bar Section */}
        <div className="w-full mb-10 sm:mb-12">
          <CertificateSearchForm
            initialQuery={activeQuery}
            isLoading={state.status === 'loading'}
            onSearch={handleSearchSubmit}
          />
        </div>

        {/* 4. Result Panel Section */}
        <div ref={resultRef} className="w-full max-w-4xl mx-auto min-h-[300px]">
          {/* Loading State */}
          {state.status === 'loading' && (
            <CertificateLoadingState query={state.query} />
          )}

          {/* Valid / Expired / Suspended Certificate Found */}
          {state.status === 'found' && (
            <CertificateResultCard record={state.record} />
          )}

          {/* Certificate Not Found */}
          {state.status === 'not_found' && (
            <CertificateNotFoundCard
              searchedQuery={state.query}
              onTryDemo={handleSearchSubmit}
            />
          )}

          {/* Network / General Error */}
          {state.status === 'error' && (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-[#EF4444] p-6 text-center">
              <p className="text-sm font-semibold text-[#DC2626]">
                {state.message}
              </p>
              <button
                type="button"
                onClick={() => handleSearchSubmit(activeQuery)}
                className="mt-3 px-4 py-2 bg-[#032E64] text-white text-xs font-semibold rounded-lg hover:bg-[#021F45] cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Initial / Idle Helper State */}
          {state.status === 'idle' && (
            <div className="w-full max-w-3xl mx-auto bg-white/70 rounded-2xl sm:rounded-3xl border border-[#CBD5E1]/70 p-6 sm:p-8 backdrop-blur-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#032E64] mb-4 text-center">
                ECASEURO Certification Registry System
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F5FA] text-[#032E64] flex items-center justify-center mb-2.5 mx-auto sm:mx-0">
                    <CheckCircle size={18} weight="bold" />
                  </div>
                  <h3 className="text-xs font-bold text-[#082046]">
                    Instant Verification
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                    Real-time status validation across all issued ISO standards & conformity schemes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F5FA] text-[#032E64] flex items-center justify-center mb-2.5 mx-auto sm:mx-0">
                    <FileMagnifyingGlass size={18} weight="bold" />
                  </div>
                  <h3 className="text-xs font-bold text-[#082046]">
                    Scope & Validity
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                    View certified activity scope, standard version, issue dates, and expiry terms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F5FA] text-[#032E64] flex items-center justify-center mb-2.5 mx-auto sm:mx-0">
                    <LockKey size={18} weight="bold" />
                  </div>
                  <h3 className="text-xs font-bold text-[#082046]">
                    Official & Secure
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                    Tamper-resistant registry records verified by accredited certification authorities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. Global Footer */}
      <div className="relative w-full overflow-hidden mt-auto">
        <Footer withGlobe={false} />
      </div>
    </div>
  );
};
