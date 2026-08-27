import React from 'react';
import {
  CheckCircle,
  ClockCountdown,
  Prohibit,
  XCircle,
} from '@phosphor-icons/react';
import type { CertificateStatus } from '../../types/verification';

export interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  className?: string;
  size?: 'normal' | 'compact';
}

export const CertificateStatusBadge: React.FC<CertificateStatusBadgeProps> = ({
  status,
  className = '',
  size = 'normal',
}) => {
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'valid':
      return (
        <div
          className={`flex flex-col items-center justify-center border-2 border-[#16A34A] bg-[#F0FDF4] text-[#15803D] rounded-xl sm:rounded-2xl ${
            size === 'compact'
              ? 'px-3 py-1.5'
              : 'px-5 py-2.5 sm:px-6 sm:py-3 min-w-[130px] sm:min-w-[150px]'
          } ${className}`}
          role="status"
          aria-label="Certificate Status: Valid"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold tracking-tight">
            <CheckCircle size={size === 'compact' ? 18 : 22} weight="bold" className="text-[#16A34A] shrink-0" />
            <span>VALID</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#166534] uppercase mt-0.5">
            Certificate Status
          </span>
        </div>
      );

    case 'expired':
      return (
        <div
          className={`flex flex-col items-center justify-center border-2 border-[#DC2626] bg-[#FEF2F2] text-[#B91C1C] rounded-xl sm:rounded-2xl ${
            size === 'compact'
              ? 'px-3 py-1.5'
              : 'px-5 py-2.5 sm:px-6 sm:py-3 min-w-[130px] sm:min-w-[150px]'
          } ${className}`}
          role="status"
          aria-label="Certificate Status: Expired"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold tracking-tight">
            <ClockCountdown size={size === 'compact' ? 18 : 22} weight="bold" className="text-[#DC2626] shrink-0" />
            <span>EXPIRED</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#991B1B] uppercase mt-0.5">
            Certificate Status
          </span>
        </div>
      );

    case 'suspended':
      return (
        <div
          className={`flex flex-col items-center justify-center border-2 border-[#D97706] bg-[#FFFBEB] text-[#B45309] rounded-xl sm:rounded-2xl ${
            size === 'compact'
              ? 'px-3 py-1.5'
              : 'px-5 py-2.5 sm:px-6 sm:py-3 min-w-[130px] sm:min-w-[150px]'
          } ${className}`}
          role="status"
          aria-label="Certificate Status: Suspended"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold tracking-tight">
            <Prohibit size={size === 'compact' ? 18 : 22} weight="bold" className="text-[#D97706] shrink-0" />
            <span>SUSPENDED</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#92400E] uppercase mt-0.5">
            Certificate Status
          </span>
        </div>
      );

    case 'withdrawn':
    case 'revoked':
      return (
        <div
          className={`flex flex-col items-center justify-center border-2 border-[#991B1B] bg-[#FEF2F2] text-[#991B1B] rounded-xl sm:rounded-2xl ${
            size === 'compact'
              ? 'px-3 py-1.5'
              : 'px-5 py-2.5 sm:px-6 sm:py-3 min-w-[130px] sm:min-w-[150px]'
          } ${className}`}
          role="status"
          aria-label={`Certificate Status: ${normalized.toUpperCase()}`}
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold tracking-tight">
            <XCircle size={size === 'compact' ? 18 : 22} weight="bold" className="text-[#991B1B] shrink-0" />
            <span>{normalized === 'withdrawn' ? 'WITHDRAWN' : 'REVOKED'}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#7F1D1D] uppercase mt-0.5">
            Certificate Status
          </span>
        </div>
      );

    default:
      return null;
  }
};
