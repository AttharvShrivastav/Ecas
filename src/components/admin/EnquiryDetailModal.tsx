import React, { useState, useEffect } from 'react';
import {
  X,
  EnvelopeSimple,
  Phone,
  Buildings,
  GlobeHemisphereWest,
  Clock,
  User,
  CheckCircle,
  WarningCircle,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { EnquiryStatusPill } from './EnquiryStatusPill';
import type { EnquiryRecord, EnquiryStatus } from '../../types/adminEnquiry';

interface EnquiryDetailModalProps {
  enquiry: EnquiryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: EnquiryStatus) => Promise<void>;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Close on Escape key and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setActionSuccessMessage(null);
      setActionErrorMessage(null);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !enquiry) return null;

  const handleUpdateStatus = async (newStatus: EnquiryStatus) => {
    try {
      setIsUpdatingStatus(true);
      setActionSuccessMessage(null);
      setActionErrorMessage(null);

      await onStatusChange(enquiry.id, newStatus);
      setActionSuccessMessage(`Status updated to "${newStatus}".`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      setActionErrorMessage(err.message || 'Failed to update enquiry status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formattedSubmittedDate = new Date(enquiry.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Restrained Backdrop */}
      <div
        className="fixed inset-0 bg-[#082046]/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Modal Surface */}
      <div className="relative bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-2xl w-full my-auto overflow-hidden z-10 font-['DM_Sans'] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#082046] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded shadow-2xs">
              ENQ-{enquiry.id}
            </span>
            <div className="flex items-center gap-2">
              <h2 id="enquiry-modal-title" className="text-base sm:text-lg font-bold text-[#082046]">
                Enquiry #{enquiry.id}
              </h2>
              <EnquiryStatusPill status={enquiry.status} size="sm" />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Status Feedback Alerts */}
          {actionSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {actionErrorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
              <WarningCircle size={16} weight="fill" className="text-red-500 shrink-0" />
              <span>{actionErrorMessage}</span>
            </div>
          )}

          {/* Section 1: Contact Information */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#082046] border-b border-[#E2E8F0] pb-1">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Name */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <User size={12} /> Full Name
                </span>
                <p className="font-bold text-[#082046] text-sm">{enquiry.name}</p>
              </div>

              {/* Company */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <Buildings size={12} /> Company / Organization
                </span>
                <p className="font-semibold text-[#1E293B]">
                  {enquiry.company || <span className="text-[#94A3B8] italic font-normal">Not specified</span>}
                </p>
              </div>

              {/* Email */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <EnvelopeSimple size={12} /> Email Address
                </span>
                <p className="font-semibold text-[#1E293B]">
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-[#00607A] hover:underline break-all"
                  >
                    {enquiry.email}
                  </a>
                </p>
              </div>

              {/* Phone */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <Phone size={12} /> Phone Number
                </span>
                <p className="font-semibold text-[#1E293B]">
                  {enquiry.phone ? (
                    <a href={`tel:${enquiry.phone}`} className="text-[#00607A] hover:underline">
                      {enquiry.phone}
                    </a>
                  ) : (
                    <span className="text-[#94A3B8] italic font-normal">Not provided</span>
                  )}
                </p>
              </div>

              {/* Country */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5 sm:col-span-2">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <GlobeHemisphereWest size={12} /> Country / Location
                </span>
                <p className="font-semibold text-[#1E293B]">
                  {enquiry.country || <span className="text-[#94A3B8] italic font-normal">Not specified</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Enquiry Information */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#082046] border-b border-[#E2E8F0] pb-1">
              Enquiry Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Service / Enquiry Type */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium text-[11px]">Enquiry Type / Service</span>
                <p className="font-bold text-[#082046]">{enquiry.enquiryType}</p>
              </div>

              {/* Submitted Date & Source Page */}
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-0.5">
                <span className="text-[#64748B] font-medium flex items-center gap-1 text-[11px]">
                  <Clock size={12} /> Submitted At
                </span>
                <p className="font-semibold text-[#1E293B]">{formattedSubmittedDate}</p>
              </div>
            </div>

            {/* Source Page origin if present */}
            {enquiry.sourcePage && (
              <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 px-1">
                <span>Submitted from page:</span>
                <code className="bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#334155] font-mono">
                  {enquiry.sourcePage}
                </code>
              </div>
            )}

            {/* Customer Message */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-[#475467] block">
                Customer Message
              </label>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#1E293B] text-xs leading-relaxed whitespace-pre-wrap selection:bg-[#00607A]/20 min-h-[90px]">
                {enquiry.message}
              </div>
            </div>
          </div>

          {/* Section 3: Status Lifecycle Controls */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#082046] border-b border-[#E2E8F0] pb-1">
              Lifecycle Status
            </h3>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isUpdatingStatus || enquiry.status === 'New'}
                onClick={() => handleUpdateStatus('New')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  enquiry.status === 'New'
                    ? 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF] ring-1 ring-[#2E90FA]'
                    : 'bg-white text-[#475467] border-[#D0D5DD] hover:bg-[#F8FAFC] hover:text-[#082046]'
                } disabled:opacity-50`}
              >
                Mark as New
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus || enquiry.status === 'In Progress'}
                onClick={() => handleUpdateStatus('In Progress')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  enquiry.status === 'In Progress'
                    ? 'bg-[#FFF6ED] text-[#C4320A] border-[#FECDCA] ring-1 ring-[#F79009]'
                    : 'bg-white text-[#475467] border-[#D0D5DD] hover:bg-[#F8FAFC] hover:text-[#082046]'
                } disabled:opacity-50`}
              >
                Mark In Progress
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus || enquiry.status === 'Closed'}
                onClick={() => handleUpdateStatus('Closed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  enquiry.status === 'Closed'
                    ? 'bg-[#F8FAFC] text-[#475467] border-[#94A3B8] ring-1 ring-[#64748B] font-bold'
                    : 'bg-white text-[#475467] border-[#D0D5DD] hover:bg-[#F8FAFC] hover:text-[#082046]'
                } disabled:opacity-50`}
              >
                Close Enquiry
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3 shrink-0">
          <a
            href={`mailto:${enquiry.email}?subject=RE: ECAS EURO Enquiry - ${encodeURIComponent(enquiry.enquiryType)}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#082046] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <EnvelopeSimple size={14} />
            <span>Reply via Email</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#475467] hover:text-[#082046] hover:bg-[#E2E8F0]/60 rounded-md border border-[#CBD5E1] bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
