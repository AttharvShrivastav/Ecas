import React from 'react';
import type { CertificateStatus } from '../../types/adminCertificate';

export interface CertificateStatusPillProps {
  status: CertificateStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CertificateStatusPill: React.FC<CertificateStatusPillProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const normStatus = (status || 'Valid').trim();

  // Color mapping based on eCAS Euro design system & screenshot style
  let colorClasses = 'bg-[#E8F8F0] text-[#0E7044] border-[#BDEBD3]'; // Valid: clean calm green
  let dotColor = 'bg-[#12B76A]';

  if (normStatus === 'Suspended') {
    colorClasses = 'bg-[#FFF6ED] text-[#C4320A] border-[#FECDCA]'; // Suspended: warm amber/orange
    dotColor = 'bg-[#F79009]';
  } else if (normStatus === 'Expired') {
    colorClasses = 'bg-[#F2F4F7] text-[#475467] border-[#D0D5DD]'; // Expired: neutral gray
    dotColor = 'bg-[#667085]';
  } else if (normStatus === 'Withdrawn') {
    colorClasses = 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]'; // Withdrawn: soft red
    dotColor = 'bg-[#D92D20]';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border whitespace-nowrap leading-none transition-colors ${colorClasses} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      {normStatus}
    </span>
  );
};
