import React, { useState } from 'react';
import {
  ShieldCheck,
  Certificate,
  CalendarBlank,
  CalendarCheck,
  Buildings,
  MapPin,
  Target,
  FilePdf,
  Check,
  Copy,
  Info,
} from '@phosphor-icons/react';
import { CertificateStatusBadge } from './CertificateStatusBadge';
import { formatDisplayDate } from '../../data/mockCertificates';
import { generateCertificatePdf } from '../../utils/certificatePdf';
import type { CertificateRecord } from '../../types/verification';

export interface CertificateResultCardProps {
  record: CertificateRecord;
  className?: string;
}

export const CertificateResultCard: React.FC<CertificateResultCardProps> = ({
  record,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-certificate?cert_no=${encodeURIComponent(
      record.certificateNumber
    )}`;
    
    // Modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          fallbackCopyTextToClipboard(url);
        });
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Could not copy link', e);
    }
  };

  const handleSavePdf = () => {
    generateCertificatePdf(record);
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden ${className}`}
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00607A] via-[#032E64] to-[#3261BC]" />

      {/* Header Banner Area */}
      <div className="p-6 sm:p-8 lg:p-10 bg-[#F0F5FA]/70 border-b border-[#E2E8F0]/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00607A] flex items-center gap-1.5">
              <ShieldCheck size={16} weight="fill" className="text-[#032E64]" />
              <span>
                {record.status.toLowerCase() === 'valid'
                  ? 'CERTIFICATE VERIFIED'
                  : record.status.toLowerCase() === 'expired'
                  ? 'CERTIFICATE RECORD (EXPIRED)'
                  : `CERTIFICATE RECORD (${record.status.toUpperCase()})`}
              </span>
            </span>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#082046] tracking-tight leading-snug">
              {record.companyName || record.organisationName}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-[#64748B]">
              Certificate No.{' '}
              <span className="font-mono font-bold text-[#082046]">
                {record.certificateNumber}
              </span>
            </p>
          </div>

          {/* Right Status Badge */}
          <div className="shrink-0 self-start md:self-center">
            <CertificateStatusBadge status={record.status} />
          </div>
        </div>
      </div>

      {/* Body Information Groups */}
      <div className="p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Group 1: CERTIFICATE DETAILS */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#032E64] mb-4">
            Certificate Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Standard */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64]">
                <ShieldCheck size={18} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Standard
                </span>
                <span className="block text-sm font-bold text-[#082046] mt-0.5">
                  {record.standard}
                </span>
              </div>
            </div>

            {/* Certificate No */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64]">
                <Certificate size={18} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Certificate No.
                </span>
                <span className="block text-xs sm:text-sm font-mono font-bold text-[#082046] mt-0.5 truncate">
                  {record.certificateNumber}
                </span>
              </div>
            </div>

            {/* Issue Date */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64]">
                <CalendarBlank size={18} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Issue Date
                </span>
                <span className="block text-sm font-bold text-[#082046] mt-0.5">
                  {formatDisplayDate(record.issueDate)}
                </span>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64]">
                <CalendarCheck size={18} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Expiry Date
                </span>
                <span
                  className={`block text-sm font-bold mt-0.5 ${
                    record.status === 'expired' ? 'text-[#DC2626]' : 'text-[#082046]'
                  }`}
                >
                  {formatDisplayDate(record.expiryDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* Group 2: ORGANISATION */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#032E64] mb-4">
            Organisation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Organisation Name */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64] mt-0.5">
                <Buildings size={20} weight="bold" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Name
                </span>
                <span className="block text-sm sm:text-base font-bold text-[#082046] mt-0.5">
                  {record.companyName || record.organisationName}
                </span>
              </div>
            </div>

            {/* Organisation Address */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#032E64] mt-0.5">
                <MapPin size={20} weight="bold" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                  Address
                </span>
                <span className="block text-xs sm:text-sm font-medium text-[#334155] mt-0.5 leading-relaxed">
                  {record.address || record.organisationAddress}
                  {record.otherAddress && (
                    <span className="block text-[11px] text-[#64748B] mt-1 pt-1 border-t border-[#E2E8F0]/60">
                      Additional site: {record.otherAddress}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* Group 3: CERTIFIED SCOPE */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} weight="bold" className="text-[#032E64]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#032E64]">
              Certified Scope
            </h3>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70">
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
              {record.scope}
            </p>
          </div>
        </div>

        {/* Accreditation / Registrar Reassurance Note */}
        {record.accreditationBody && (
          <div className="p-3.5 rounded-xl bg-[#F1F5F9]/70 border border-[#CBD5E1]/60 flex items-center gap-2.5 text-xs text-[#475569]">
            <Info size={16} weight="bold" className="text-[#032E64] shrink-0" />
            <span>
              Accredited registrar authority:{' '}
              <strong className="font-semibold text-[#082046]">
                {record.accreditationBody}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="px-6 py-4 sm:px-8 sm:py-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
        <div className="text-center sm:text-left">
          <span>Official verification record. Verified against ECASEURO Registry.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#082046] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} weight="bold" className="text-[#16A34A]" />
                <span className="text-[#16A34A]">Link Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} weight="bold" />
                <span>Share Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSavePdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#082046] hover:bg-[#F1F5F9] font-medium transition-colors cursor-pointer"
          >
            <FilePdf size={15} weight="bold" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
