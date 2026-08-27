import React from 'react';
import type { EnquiryStatus } from '../../types/adminEnquiry';

export interface EnquiryStatusPillProps {
  status: EnquiryStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EnquiryStatusPill: React.FC<EnquiryStatusPillProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const normStatus = (status || 'New').trim();

  // Color mapping based on eCAS Euro restrained admin design system
  let colorClasses = 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'; // New: calm clear blue (attention but clean)
  let dotColor = 'bg-[#2E90FA]';

  if (normStatus === 'In Progress') {
    colorClasses = 'bg-[#FFF6ED] text-[#C4320A] border-[#FECDCA]'; // In Progress: active warm amber
    dotColor = 'bg-[#F79009]';
  } else if (normStatus === 'Closed') {
    colorClasses = 'bg-[#F8FAFC] text-[#475467] border-[#E2E8F0]'; // Closed: neutral completed slate
    dotColor = 'bg-[#94A3B8]';
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
