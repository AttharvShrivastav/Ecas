import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

export interface CMSSectionCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: any }>;
  badge?: string;
  badgeVariant?: 'default' | 'info' | 'warning';
  defaultOpen?: boolean;
  errorCount?: number;
  children: React.ReactNode;
}

export const CMSSectionCard: React.FC<CMSSectionCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = 'default',
  defaultOpen = true,
  errorCount = 0,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getBadgeStyle = () => {
    if (badgeVariant === 'info') {
      return 'bg-[#E6F4F8] text-[#00607A] border-[#00607A]/20';
    }
    if (badgeVariant === 'warning') {
      return 'bg-[#FEF3F2] text-[#B42318] border-[#B42318]/20';
    }
    return 'bg-[#F1F5F9] text-[#475467] border-[#E2E8F0]';
  };

  return (
    <section
      id={id}
      className={`bg-white rounded-xl border transition-shadow duration-200 ${
        errorCount > 0
          ? 'border-[#FDA29B] shadow-xs'
          : 'border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]'
      }`}
    >
      {/* Card Header (Collapsible toggle) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer select-none border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/60 transition-colors rounded-t-xl"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#082046] shrink-0">
            <Icon size={18} weight="bold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#082046] tracking-tight">
                {title}
              </h2>
              {badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle()}`}
                >
                  {badge}
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B]">
                  {errorCount} {errorCount === 1 ? 'issue' : 'issues'}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            type="button"
            className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-md transition-colors"
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          >
            {isOpen ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      {isOpen && <div className="p-5 sm:p-6 space-y-6">{children}</div>}
    </section>
  );
};

// Also export alias for backward compatibility
export const CmsSectionCard = CMSSectionCard;
