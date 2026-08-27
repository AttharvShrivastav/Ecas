import React, { useState } from 'react';
import {
  X,
  Warning,
  CheckCircle,
  CircleNotch,
  WarningCircle
} from '@phosphor-icons/react';
import { AdminAccount } from '../../../types/adminAccount';
import { disableAdminAccountApi, enableAdminAccountApi } from '../../../services/adminAccountService';

interface AccountStatusConfirmModalProps {
  account: AdminAccount | null;
  targetAction: 'disable' | 'enable' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const AccountStatusConfirmModal: React.FC<AccountStatusConfirmModalProps> = ({
  account,
  targetAction,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !account || !targetAction) return null;

  const isDisabling = targetAction === 'disable';

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isDisabling) {
        await disableAdminAccountApi(account.id);
        onSuccess(`Administrator "${account.name}" (${account.email}) has been disabled. All active sessions have been terminated.`);
      } else {
        await enableAdminAccountApi(account.id);
        onSuccess(`Administrator "${account.name}" (${account.email}) has been re-enabled.`);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to ${targetAction} administrator account.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082046]/50 backdrop-blur-xs font-['DM_Sans'] animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`px-6 py-4.5 text-white flex items-center justify-between shrink-0 ${
            isDisabling ? 'bg-rose-900' : 'bg-[#082046]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
              {isDisabling ? <Warning size={20} weight="bold" /> : <CheckCircle size={20} weight="bold" />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isDisabling ? 'Disable Administrator Account' : 'Re-enable Administrator Account'}
              </h2>
              <p className="text-xs text-slate-300">
                {isDisabling ? 'Revoke portal access & terminate active sessions' : 'Restore administrative portal access'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
            >
              <WarningCircle size={17} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="font-semibold text-slate-900">{account.name}</div>
            <div className="text-slate-600">{account.email}</div>
          </div>

          {isDisabling ? (
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to disable this administrator account? The administrator will be{' '}
              <strong className="text-slate-900">immediately locked out</strong> of the ECAS EURO Admin Portal,
              and all current active sessions will be terminated. The account record remains stored in the database and can be re-enabled later.
            </p>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to re-enable this administrator account? The administrator will be able to log in again using their existing credentials.
            </p>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
                isDisabling
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                  : 'bg-[#082046] hover:bg-[#0d2e61] active:bg-[#061834]'
              }`}
            >
              {isLoading ? (
                <>
                  <CircleNotch size={15} className="animate-spin" weight="bold" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isDisabling ? 'Confirm Disable Account' : 'Confirm Re-enable Account'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
