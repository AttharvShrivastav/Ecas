import React, { useEffect, useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  MagnifyingGlass,
  ArrowClockwise,
  PencilSimple,
  Key,
  ShieldCheck,
  WarningCircle,
  CheckCircle,
  LockKeyOpen,
  Lock,
  User,
  EnvelopeSimple,
  Shield
} from '@phosphor-icons/react';
import { useSession } from '../../lib/auth-client';
import { fetchAdminAccounts } from '../../services/adminAccountService';
import { AdminAccount, AdminAccountStats, AdminAccountStatus } from '../../types/adminAccount';
import { AccountStatusPill } from '../../components/admin/accounts/AccountStatusPill';
import { ProvisionAdminModal } from '../../components/admin/accounts/ProvisionAdminModal';
import { EditAdminModal } from '../../components/admin/accounts/EditAdminModal';
import { ResetPasswordModal } from '../../components/admin/accounts/ResetPasswordModal';
import { AccountStatusConfirmModal } from '../../components/admin/accounts/AccountStatusConfirmModal';

export const AdminAccountsRegistryPage: React.FC = () => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;

  // Data State
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [stats, setStats] = useState<AdminAccountStats>({ total: 0, active: 0, disabled: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [resetPasswordAccount, setResetPasswordAccount] = useState<AdminAccount | null>(null);
  const [confirmModalAccount, setConfirmModalAccount] = useState<AdminAccount | null>(null);
  const [confirmModalAction, setConfirmModalAction] = useState<'disable' | 'enable' | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 5000);
  };

  // Load Accounts
  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await fetchAdminAccounts({
        search: searchQuery,
        status: statusFilter
      });

      setAccounts(result.accounts);
      setStats(result.stats);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load administrator accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [statusFilter]);

  // Handle Enter on search input
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAccounts();
  };

  // Format Dates nicely
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Helpers to get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 font-['DM_Sans']">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" weight="fill" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1 rounded hover:bg-emerald-100/60"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00607A] uppercase tracking-wider mb-1">
              <span>Administration</span>
              <span>/</span>
              <span>Settings</span>
              <span>/</span>
              <span className="text-slate-900">Admin Accounts</span>
            </div>
            <h1 className="text-2xl font-bold text-[#082046] tracking-tight">Admin Accounts</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage authenticated administrative accounts, credentials, and portal access permissions for ECAS EURO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsProvisionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#082046] hover:bg-[#0d2e61] active:bg-[#061834] transition-colors shadow-xs cursor-pointer"
            >
              <UserPlus size={16} weight="bold" />
              <span>Provision Admin</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Administrators</p>
              <p className="text-2xl font-bold text-[#082046] mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#082046] shadow-2xs">
              <Users size={20} weight="bold" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Active Accounts</p>
              <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.active}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <CheckCircle size={20} weight="bold" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Disabled Accounts</p>
              <p className="text-2xl font-bold text-rose-800 mt-1">{stats.disabled}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-700 shadow-2xs">
              <Lock size={20} weight="bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlass size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all"
            />
          </form>

          {/* Status Tabs and Refresh */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-white">
              {['All', 'Active', 'Disabled'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-[#082046] text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadAccounts}
              title="Refresh administrator accounts list"
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowClockwise size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 m-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
            <WarningCircle size={18} className="text-red-600 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <p className="font-semibold">Unable to load accounts</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={loadAccounts}
              className="underline font-semibold hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Administrator</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {isLoading && accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <ArrowClockwise size={16} className="animate-spin text-[#00607A]" />
                      <span>Loading administrator accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users size={32} className="mx-auto text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No administrator accounts found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? 'Try adjusting your search criteria or clear the filters.'
                          : 'No accounts match the current status filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => {
                  const isCurrentSessionUser =
                    acc.id === currentUserId ||
                    (currentUserEmail && acc.email.toLowerCase() === currentUserEmail.toLowerCase());
                  const isPrimary = acc.isPrimary;
                  const canToggleStatus = !isCurrentSessionUser && !(acc.status === 'Active' && stats.active <= 1);

                  return (
                    <tr
                      key={acc.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#082046] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {getInitials(acc.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-slate-900">{acc.name}</span>
                              {isCurrentSessionUser && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                  You
                                </span>
                              )}
                              {isPrimary && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                                  Primary
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Role: {acc.role || 'admin'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 font-mono text-slate-800 text-xs">
                        <div className="flex items-center gap-1.5">
                          <EnvelopeSimple size={14} className="text-slate-400" />
                          <span>{acc.email}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <AccountStatusPill status={acc.status} />
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-slate-600">
                        {formatDate(acc.createdAt)}
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4 text-slate-600">
                        {acc.lastActiveAt ? formatDate(acc.lastActiveAt) : 'Recently active'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right sm:pr-6">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => setEditingAccount(acc)}
                            title="Edit Administrator Details"
                            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <PencilSimple size={16} />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => setResetPasswordAccount(acc)}
                            title="Reset Administrator Password"
                            className="p-1.5 rounded-md text-slate-600 hover:text-[#00607A] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Key size={16} />
                          </button>

                          {/* Disable or Enable */}
                          {acc.status === 'Active' ? (
                            <button
                              type="button"
                              disabled={!canToggleStatus}
                              onClick={() => {
                                if (canToggleStatus) {
                                  setConfirmModalAccount(acc);
                                  setConfirmModalAction('disable');
                                }
                              }}
                              title={
                                isCurrentSessionUser
                                  ? 'You cannot disable your own active account.'
                                  : stats.active <= 1
                                  ? 'Cannot disable the last active administrator account.'
                                  : 'Disable Administrator Account'
                              }
                              className={`p-1.5 rounded-md transition-colors ${
                                canToggleStatus
                                  ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 cursor-pointer'
                                  : 'text-slate-300 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Lock size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmModalAccount(acc);
                                setConfirmModalAction('enable');
                              }}
                              title="Re-enable Administrator Account"
                              className="p-1.5 rounded-md text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              <LockKeyOpen size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#00607A]" />
            <span>ECAS EURO Enterprise Security: Account provisioning, password resets, and session revocations are fully audited.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Showing {accounts.length} of {stats.total} accounts
          </span>
        </div>
      </div>

      {/* Modals */}
      <ProvisionAdminModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          loadAccounts();
        }}
      />

      <EditAdminModal
        account={editingAccount}
        currentUserId={currentUserId}
        isOpen={Boolean(editingAccount)}
        onClose={() => setEditingAccount(null)}
        onSuccess={(msg) => {
          showToast(msg);
          loadAccounts();
        }}
      />

      <ResetPasswordModal
        account={resetPasswordAccount}
        isOpen={Boolean(resetPasswordAccount)}
        onClose={() => setResetPasswordAccount(null)}
        onSuccess={(msg) => {
          showToast(msg);
          loadAccounts();
        }}
      />

      <AccountStatusConfirmModal
        account={confirmModalAccount}
        targetAction={confirmModalAction}
        isOpen={Boolean(confirmModalAccount && confirmModalAction)}
        onClose={() => {
          setConfirmModalAccount(null);
          setConfirmModalAction(null);
        }}
        onSuccess={(msg) => {
          showToast(msg);
          loadAccounts();
        }}
      />
    </div>
  );
};
