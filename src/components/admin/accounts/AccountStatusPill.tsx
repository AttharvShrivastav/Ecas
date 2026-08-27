import React from 'react';
import { AdminAccountStatus } from '../../../types/adminAccount';

interface AccountStatusPillProps {
  status: AdminAccountStatus;
}

export const AccountStatusPill: React.FC<AccountStatusPillProps> = ({ status }) => {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      <span>Disabled</span>
    </span>
  );
};
