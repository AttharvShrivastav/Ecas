import React from 'react';
import { ShieldCheck } from '@phosphor-icons/react';

export interface CertificateLoadingStateProps {
  query: string;
  className?: string;
}

export const CertificateLoadingState: React.FC<CertificateLoadingStateProps> = ({
  query,
  className = '',
}) => {
  return (
    <div
      className={`w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Verifying certificate..."
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-[#CBD5E1]" />

      {/* Header Skeleton */}
      <div className="p-6 sm:p-8 lg:p-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#94A3B8]" />
              <div className="h-3.5 bg-[#CBD5E1] rounded w-36" />
            </div>
            <div className="h-7 bg-[#E2E8F0] rounded w-3/4 max-w-md" />
            <div className="h-4 bg-[#E2E8F0] rounded w-48" />
          </div>

          <div className="h-16 w-36 bg-[#E2E8F0] rounded-2xl shrink-0" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="p-6 sm:p-8 lg:p-10 space-y-8">
        <div>
          <div className="h-3 bg-[#CBD5E1] rounded w-32 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
                <div className="h-2.5 bg-[#E2E8F0] rounded w-16" />
                <div className="h-4 bg-[#CBD5E1] rounded w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E2E8F0]" />

        <div>
          <div className="h-3 bg-[#CBD5E1] rounded w-28 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="h-2.5 bg-[#E2E8F0] rounded w-20" />
                <div className="h-4 bg-[#CBD5E1] rounded w-4/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E2E8F0]" />

        <div>
          <div className="h-3 bg-[#CBD5E1] rounded w-32 mb-3" />
          <div className="h-20 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="h-3 bg-[#E2E8F0] rounded w-full" />
            <div className="h-3 bg-[#E2E8F0] rounded w-2/3" />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-center text-xs text-[#64748B] font-medium">
        <span className="inline-flex items-center gap-2">
          <span>Verifying record against ECASEURO registry...</span>
        </span>
      </div>
    </div>
  );
};
