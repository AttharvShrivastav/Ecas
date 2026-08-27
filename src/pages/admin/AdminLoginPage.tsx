import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signIn, useSession } from '../../lib/auth-client';
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  CircleNotch,
  WarningCircle,
  ShieldCheck,
  ArrowSquareOut
} from '@phosphor-icons/react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // If user is already authenticated, redirect to destination or default admin landing
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/certificates';

  useEffect(() => {
    if (session?.user && !isSessionLoading) {
      navigate(from, { replace: true });
    }
  }, [session, isSessionLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.email({
        email: trimmedEmail,
        password
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Invalid email or password. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Successful login - navigate to destination
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('[eCAS Euro Admin Login Error]', err);
      setErrorMessage(
        err?.message || 'A network error occurred while contacting the authentication service. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#082046] flex flex-col justify-between font-['DM_Sans'] text-[#1E293B] antialiased">
      {/* Top Bar / Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          {!logoError ? (
            <img
              src="/images/brand/eca-logo.webp"
              alt="ECAS EURO"
              className="h-8 sm:h-9 w-auto max-h-[36px] object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded bg-white text-[#082046] flex items-center justify-center font-bold text-xs">
              ECA
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base tracking-tight">ECAS EURO</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E6F4F8] text-[#00607A] rounded border border-[#00607A]/30 uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Public Website</span>
          <ArrowSquareOut size={13} />
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#082046] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck size={22} weight="bold" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#00607A] bg-[#E6F4F8] px-2.5 py-1 rounded-full border border-[#00607A]/20">
                  Secure Access
                </span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight font-['Space_Grotesk']">
              Sign In to Admin
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Enter your credentials to manage registry certificates and customer enquiries.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in duration-200"
              >
                <WarningCircle size={17} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5"
                >
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <EnvelopeSimple size={17} weight="regular" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ecaseuro.com"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock size={17} weight="regular" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all disabled:bg-[#F8FAFC] disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475467] focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlash size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#082046] hover:bg-[#0d2e61] active:bg-[#061834] text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <CircleNotch size={17} className="animate-spin" weight="bold" />
                      <span>Verifying Session...</span>
                    </>
                  ) : (
                    <span>Sign In to Admin Portal</span>
                  )}
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-center">
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Authorized ECAS EURO administrative access only. All audit transactions, certificate updates, and login sessions are recorded.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center border-t border-white/10">
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} ECAS EURO International Certification & Accreditation Services. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
