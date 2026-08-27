import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  PencilSimple,
  WarningCircle,
  XCircle,
  ClockCounterClockwise,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { CertificateStatusPill } from './CertificateStatusPill';
import type { DbCertificate, CertificateStatus } from '../../types/adminCertificate';

interface CertificateDetailDrawerProps {
  certificate: DbCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusModal: (certificate: DbCertificate, status: CertificateStatus) => void;
}

export const CertificateDetailDrawer: React.FC<CertificateDetailDrawerProps> = ({
  certificate,
  isOpen,
  onClose,
  onOpenStatusModal,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !certificate) return null;

  const effectiveStatus = certificate.effectiveStatus || certificate.status;

  const handleEdit = () => {
    navigate(`/admin/certificates/${certificate.id}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#082046]/30 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div
        className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-50 flex flex-col border-l border-[#E2E8F0] font-['DM_Sans'] animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-bold text-[#082046]">Certificate Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-md transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Certificate Title & Status Header */}
          <div className="space-y-2 pb-4 border-b border-[#E2E8F0]">
            <div>
              <CertificateStatusPill status={effectiveStatus} size="sm" />
            </div>
            <h3 className="text-2xl font-bold text-[#082046] tracking-tight font-mono">
              {certificate.certificate_number}
            </h3>
            <p className="text-base font-semibold text-[#334155]">
              {certificate.company_name}
            </p>
          </div>

          {/* Key-Value Fields Grid */}
          <div className="space-y-4 text-xs">
            {/* Sr. No. */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Sr. No.</span>
              <span className="col-span-8 text-[#1E293B] font-semibold">{certificate.id}</span>
            </div>

            {/* Company Name */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Company Name</span>
              <span className="col-span-8 text-[#1E293B] font-semibold">
                {certificate.company_name}
              </span>
            </div>

            {/* Standard */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Standard</span>
              <span className="col-span-8 text-[#1E293B] font-semibold">
                {certificate.standard}
              </span>
            </div>

            {/* Address */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Address</span>
              <span className="col-span-8 text-[#1E293B] leading-relaxed">
                {certificate.address}
              </span>
            </div>

            {/* Other address */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Other address</span>
              <span className="col-span-8 text-[#1E293B] leading-relaxed">
                {certificate.other_address || '—'}
              </span>
            </div>

            {/* Scope or Product/s */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Scope or Product/s</span>
              <span className="col-span-8 text-[#1E293B] leading-relaxed whitespace-pre-line">
                {certificate.scope}
              </span>
            </div>

            {/* Issue Date */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Issue Date</span>
              <span className="col-span-8 text-[#1E293B] font-mono">
                {certificate.issue_date}
              </span>
            </div>

            {/* Certificate Number */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Certificate Number</span>
              <span className="col-span-8 text-[#082046] font-semibold font-mono">
                {certificate.certificate_number}
              </span>
            </div>

            {/* Expiry Date */}
            <div className="grid grid-cols-12 gap-3 py-1">
              <span className="col-span-4 text-[#64748B] font-medium">Expiry Date</span>
              <span className="col-span-8 text-[#1E293B] font-mono">
                {certificate.expiry_date}
              </span>
            </div>

            {/* Status */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <span className="col-span-4 text-[#64748B] font-medium">Status</span>
              <div className="col-span-8">
                <CertificateStatusPill status={effectiveStatus} size="sm" />
              </div>
            </div>

            {/* Public Link */}
            <div className="pt-2">
              <a
                href={`/verify-certificate?cert_no=${encodeURIComponent(
                  certificate.certificate_number
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#00607A] hover:text-[#082046] font-medium underline underline-offset-2"
              >
                <span>Verify in Public Registry</span>
                <ArrowSquareOut size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions (Matching Screenshot 3) */}
        <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3 shrink-0">
          {/* Top 3 Action Buttons Row */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={handleEdit}
              className="px-3 py-2 text-xs font-semibold text-[#082046] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </button>

            {/* Suspend / Reactivate Button */}
            {effectiveStatus === 'Suspended' ? (
              <button
                type="button"
                onClick={() => onOpenStatusModal(certificate, 'Valid')}
                className="px-3 py-2 text-xs font-semibold text-[#0E7044] bg-white hover:bg-[#E8F8F0] border border-[#BDEBD3] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ClockCounterClockwise size={14} weight="bold" />
                <span>Reactivate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenStatusModal(certificate, 'Suspended')}
                disabled={effectiveStatus === 'Withdrawn' || effectiveStatus === 'Expired'}
                className="px-3 py-2 text-xs font-semibold text-[#D97706] bg-white hover:bg-[#FFF6ED] border border-[#FECDCA] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <WarningCircle size={14} weight="fill" />
                <span>Suspend</span>
              </button>
            )}

            {/* Withdraw Button */}
            <button
              type="button"
              onClick={() => onOpenStatusModal(certificate, 'Withdrawn')}
              disabled={effectiveStatus === 'Withdrawn'}
              className="px-3 py-2 text-xs font-semibold text-[#DC2626] bg-white hover:bg-[#FEF3F2] border border-[#FECDCA] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <XCircle size={14} weight="bold" />
              <span>Withdraw</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
