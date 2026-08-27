import React, { useState } from 'react';
import {
  X,
  UserPlus,
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  CircleNotch,
  WarningCircle,
  ShieldCheck
} from '@phosphor-icons/react';
import { ProvisionAdminInput, AdminAccountStatus } from '../../../types/adminAccount';
import { provisionAdminAccountApi } from '../../../services/adminAccountService';

interface ProvisionAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ProvisionAdminModal: React.FC<ProvisionAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<AdminAccountStatus>('Active');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify confirmation password.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: ProvisionAdminInput = {
        name: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
        status
      };

      await provisionAdminAccountApi(payload);
      onSuccess(`Administrator account for ${trimmedName} (${trimmedEmail}) was successfully provisioned.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to provision administrator account. Please try again.');
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
              <UserPlus size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Provision Administrator</h2>
              <p className="text-xs text-slate-300">
                Create a new authenticated ECAS EURO administrator account.
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
              placeholder="e.g. Elena Rostova"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
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
                placeholder="elena.rostova@ecaseuro.com"
                disabled={isLoading}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
              />
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Initial Account Status
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
                <span>Active (Can Log In)</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Disabled')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  status === 'Disabled'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Disabled (Staged Only)</span>
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Temporary / Initial Password * (Min 8 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475467] focus:outline-none"
              >
                {showPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
              Confirm Password *
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
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC]"
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

          {/* Security Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck size={18} className="text-[#00607A] shrink-0 mt-0.5" weight="bold" />
            <span>
              Credentials are securely hashed using Better Auth crypto. Administrator actions and logins are permanently audited.
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
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} weight="bold" />
                  <span>Provision Administrator</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
