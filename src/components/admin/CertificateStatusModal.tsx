import React, { useState } from 'react';
import {
  X,
  WarningCircle,
  ShieldCheck,
  Prohibit,
  XCircle,
  ClockCounterClockwise
} from '@phosphor-icons/react';
import type { DbCertificate, CertificateStatus } from '../../types/adminCertificate';

interface CertificateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: DbCertificate | null;
  targetStatus: CertificateStatus | null;
  onConfirm: (certificateId: number, status: CertificateStatus) => Promise<void>;
}

export const CertificateStatusModal: React.FC<CertificateStatusModalProps> = ({
  isOpen,
  onClose,
  certificate,
  targetStatus,
  onConfirm
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !certificate || !targetStatus) return null;

  const getModalConfig = () => {
    switch (targetStatus) {
      case 'Suspended':
        return {
          title: 'Suspend Certificate',
          subtitle: 'Impose temporary administrative suspension',
          description:
            'Suspending this certificate will immediately update its status in the public verification registry to "Suspended". The certificate holder cannot claim active certification during the suspension period.',
          buttonLabel: 'Confirm Suspension',
          buttonClass: 'bg-[#D97706] hover:bg-[#B45309] text-white',
          icon: <WarningCircle size={22} className="text-[#D97706]" weight="fill" />,
        };
      case 'Withdrawn':
        return {
          title: 'Withdraw Certificate',
          subtitle: 'Permanent administrative cancellation',
          description:
            'Warning: Certificate withdrawal is a permanent administrative revocation. The public verification registry will show this certificate as permanently Withdrawn.',
          buttonLabel: 'Confirm Permanent Withdrawal',
          buttonClass: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white',
          icon: <XCircle size={22} className="text-[#DC2626]" weight="fill" />,
        };
      case 'Valid':
        return {
          title: 'Reactivate Certificate',
          subtitle: 'Restore active certification status',
          description:
            'Reactivating will lift any current administrative suspensions, restoring the public status to Valid (provided the expiry date has not elapsed).',
          buttonLabel: 'Confirm Reactivation',
          buttonClass: 'bg-[#0E7044] hover:bg-[#095030] text-white',
          icon: <ClockCounterClockwise size={22} className="text-[#0E7044]" weight="bold" />,
        };
      case 'Expired':
      default:
        return {
          title: 'Mark Certificate as Expired',
          subtitle: 'Administrative status update',
          description: 'Update the status of this certificate record to Expired.',
          buttonLabel: 'Update Status',
          buttonClass: 'bg-[#475467] hover:bg-[#344054] text-white',
          icon: <Prohibit size={22} className="text-[#475467]" weight="bold" />,
        };
    }
  };

  const config = getModalConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onConfirm(certificate.id, targetStatus);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update certificate status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#082046]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-lg w-full overflow-hidden z-10 font-['DM_Sans']">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center shadow-xs">
              {config.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082046]">{config.title}</h3>
              <p className="text-xs text-[#64748B]">{config.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#E2E8F0] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Certificate Summary */}
          <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Certificate Number:</span>
              <span className="font-semibold text-[#082046] font-mono">
                {certificate.certificate_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Company Name:</span>
              <span className="font-medium text-[#1E293B]">{certificate.company_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Standard:</span>
              <span className="font-medium text-[#1E293B]">{certificate.standard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Current Status:</span>
              <span className="font-semibold text-[#082046]">{certificate.status}</span>
            </div>
          </div>

          <p className="text-xs text-[#475467] leading-relaxed">{config.description}</p>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start gap-2">
              <WarningCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#475467] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-md border border-[#CBD5E1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 ${config.buttonClass} disabled:opacity-50`}
            >
              {isSubmitting ? 'Processing...' : config.buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
