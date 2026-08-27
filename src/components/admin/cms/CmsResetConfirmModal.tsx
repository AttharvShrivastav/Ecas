import React from 'react';
import { Warning, X, ArrowClockwise } from '@phosphor-icons/react';

interface CmsResetConfirmModalProps {
  isOpen: boolean;
  pageTitle: string;
  isResetting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CmsResetConfirmModal: React.FC<CmsResetConfirmModalProps> = ({
  isOpen,
  pageTitle,
  isResetting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082046]/50 backdrop-blur-xs font-['DM_Sans'] antialiased animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3F2] border border-[#FDA29B]/30 flex items-center justify-center text-[#B42318] shrink-0">
            <Warning size={24} weight="fill" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isResetting}
            className="p-1.5 text-[#94A3B8] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-2">
          <h3 id="reset-dialog-title" className="text-base sm:text-lg font-bold text-[#082046] tracking-tight">
            Reset "{pageTitle}" to Defaults?
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            This will revert all hero text, pillar cards, FAQs, CTA copy, and SEO metadata back to the official ECAS EURO baseline defaults.
          </p>
          <div className="p-3 bg-[#FFF7ED] rounded-lg border border-[#FDBA74]/40 text-[#9A3412] text-xs font-medium">
            <strong>Warning:</strong> Any unsaved or custom changes you have made will be permanently replaced.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isResetting}
            className="px-4 py-2 text-xs font-semibold text-[#475467] hover:text-[#082046] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isResetting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#B42318] hover:bg-[#912018] rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isResetting ? (
              <>
                <ArrowClockwise size={14} className="animate-spin" weight="bold" />
                <span>Resetting...</span>
              </>
            ) : (
              <span>Confirm Reset</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
