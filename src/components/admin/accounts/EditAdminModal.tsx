import React, { useState, useEffect } from 'react';
import {
  X,
  PencilSimple,
  EnvelopeSimple,
  CircleNotch,
  WarningCircle,
  ShieldCheck
} from '@phosphor-icons/react';
import { AdminAccount, AdminAccountStatus, UpdateAdminInput } from '../../../types/adminAccount';
import { updateAdminAccountApi } from '../../../services/adminAccountService';

interface EditAdminModalProps {
  account: AdminAccount | null;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  account,
  currentUserId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<AdminAccountStatus>('Active');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSelf = Boolean(currentUserId && account?.id === currentUserId);

  useEffect(() => {
    if (account) {
      setName(account.name || '');
      setEmail(account.email || '');
      setStatus(account.status || 'Active');
      setErrorMessage(null);
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Full name is required and must be at least 2 characters.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Administrator email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid administrator email address.');
      return;
    }

    if (isSelf && status === 'Disabled') {
      setErrorMessage('You cannot disable your own administrator account.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: UpdateAdminInput = {
        name: trimmedName,
        email: trimmedEmail,
        status
      };

      await updateAdminAccountApi(account.id, payload);
      onSuccess(`Administrator details for ${trimmedName} were updated successfully.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update administrator account.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082046]/50 backdrop-blur-xs font-['DM_Sans'] animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#082046] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <PencilSimple size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Edit Administrator Account</h2>
              <p className="text-xs text-slate-300">
                Update account details and administrative access status.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
            >
              <WarningCircle size={17} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Administrator Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <EnvelopeSimple size={17} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
              />
            </div>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Account Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </button>
              <button
                type="button"
                disabled={isSelf}
                onClick={() => {
                  if (!isSelf) setStatus('Disabled');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  status === 'Disabled'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                } ${isSelf ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={isSelf ? 'You cannot disable your own active account.' : undefined}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Disabled</span>
              </button>
            </div>
            {isSelf && (
              <p className="text-[11px] text-amber-600 mt-1.5">
                Note: You are currently signed in as this administrator. Self-disable is locked.
              </p>
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck size={18} className="text-[#00607A] shrink-0 mt-0.5" weight="bold" />
            <span>
              Passwords are not displayed or edited here. To update credentials, use the dedicated Reset Password action.
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
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
