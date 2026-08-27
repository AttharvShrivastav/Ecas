import React, { useState } from 'react';
import {
  X,
  Key,
  Lock,
  Eye,
  EyeSlash,
  CircleNotch,
  WarningCircle,
  ShieldCheck
} from '@phosphor-icons/react';
import { AdminAccount, ResetPasswordInput } from '../../../types/adminAccount';
import { resetAdminPasswordApi } from '../../../services/adminAccountService';

interface ResetPasswordModalProps {
  account: AdminAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  account,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: ResetPasswordInput = {
        newPassword,
        confirmPassword
      };

      await resetAdminPasswordApi(account.id, payload);
      onSuccess(`Password for administrator "${account.name}" (${account.email}) has been successfully reset. Active sessions were revoked.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset administrator password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082046]/50 backdrop-blur-xs font-['DM_Sans'] animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#082046] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Key size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Reset Admin Password</h2>
              <p className="text-xs text-slate-300">Set new credentials for this administrator.</p>
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

        {/* Target Info */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-900">{account.name}</span>
            <span className="text-slate-500 ml-1.5">({account.email})</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00607A] bg-[#E6F4F8] px-2 py-0.5 rounded border border-[#00607A]/20">
            {account.status}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
            >
              <WarningCircle size={17} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              New Password * (Min 8 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock size={17} />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475467] focus:outline-none"
              >
                {showNewPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock size={17} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475467] focus:outline-none"
              >
                {showConfirmPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Revocation Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-800">
            <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" weight="bold" />
            <span>
              Resetting this password will immediately invalidate and terminate any active sessions across devices for this account.
            </span>
          </div>

          {/* Footer Buttons */}
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
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#082046] hover:bg-[#0d2e61] active:bg-[#061834] rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <CircleNotch size={15} className="animate-spin" weight="bold" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Key size={15} weight="bold" />
                  <span>Set New Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
