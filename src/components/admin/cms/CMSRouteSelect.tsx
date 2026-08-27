import React, { useState, useEffect } from 'react';
import { ArrowSquareOut, Link as LinkIcon, Check } from '@phosphor-icons/react';
import {
  PUBLIC_ROUTES,
  isExternalUrl,
  isValidExternalUrl,
  PublicRouteOption,
} from '../../../config/publicRoutes';

export interface CMSRouteSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  allowExternal?: boolean;
  className?: string;
}

export const CMSRouteSelect: React.FC<CMSRouteSelectProps> = ({
  id = 'cms-route-select',
  value,
  onChange,
  error,
  label = 'Button Destination Route',
  required = true,
  allowExternal = true,
  className = '',
}) => {
  // Determine mode based on value
  const [isExternalMode, setIsExternalMode] = useState<boolean>(() => isExternalUrl(value));
  const [externalInput, setExternalInput] = useState<string>(() =>
    isExternalUrl(value) ? value : 'https://'
  );
  const [internalSelected, setInternalSelected] = useState<string>(() =>
    isExternalUrl(value) ? '/verify-certificate' : value || '/verify-certificate'
  );

  // Sync internal state with external prop changes
  useEffect(() => {
    if (isExternalUrl(value)) {
      setIsExternalMode(true);
      setExternalInput(value);
    } else {
      setIsExternalMode(false);
      setInternalSelected(value || '/verify-certificate');
    }
  }, [value]);

  const handleModeSwitch = (mode: 'internal' | 'external') => {
    if (mode === 'internal') {
      setIsExternalMode(false);
      const targetValue = internalSelected || '/verify-certificate';
      onChange(targetValue);
    } else {
      setIsExternalMode(true);
      const targetValue = externalInput.trim() || 'https://';
      onChange(targetValue);
    }
  };

  const handleInternalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setInternalSelected(newVal);
    onChange(newVal);
  };

  const handleExternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setExternalInput(newVal);
    onChange(newVal);
  };

  // Group routes by category for clean UX in select element
  const groupedRoutes: Record<string, PublicRouteOption[]> = {
    Primary: PUBLIC_ROUTES.filter((r) => r.category === 'Primary' || r.category === 'Tools'),
    Services: PUBLIC_ROUTES.filter((r) => r.category === 'Services'),
    Company: PUBLIC_ROUTES.filter((r) => r.category === 'Company'),
    Legal: PUBLIC_ROUTES.filter((r) => r.category === 'Legal'),
  };

  const isExternalValid = !isExternalMode || (externalInput.length > 8 && isValidExternalUrl(externalInput));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>

        {allowExternal && (
          <div className="inline-flex items-center p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-[11px] font-semibold text-[#475467]">
            <button
              type="button"
              onClick={() => handleModeSwitch('internal')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                !isExternalMode
                  ? 'bg-white text-[#082046] shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#082046]'
              }`}
            >
              <LinkIcon size={12} weight={!isExternalMode ? 'bold' : 'regular'} />
              <span>Internal Page</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('external')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                isExternalMode
                  ? 'bg-white text-[#082046] shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#082046]'
              }`}
            >
              <ArrowSquareOut size={12} weight={isExternalMode ? 'bold' : 'regular'} />
              <span>External URL</span>
            </button>
          </div>
        )}
      </div>

      {/* Internal Page Dropdown Selector */}
      {!isExternalMode ? (
        <div className="relative">
          <select
            id={id}
            value={internalSelected}
            onChange={handleInternalChange}
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none font-medium text-[#082046] cursor-pointer ${
              error
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          >
            {Object.entries(groupedRoutes).map(([category, routes]) => (
              <optgroup key={category} label={category} className="font-bold text-[#082046]">
                {routes.map((route) => (
                  <option key={route.value} value={route.value} className="font-normal py-1">
                    {route.label} ({route.value})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ) : (
        /* External URL Input */
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id={id}
              type="url"
              value={externalInput}
              onChange={handleExternalChange}
              placeholder="https://example.com/target-page"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-8 ${
                error || (!isExternalValid && externalInput.length > 0)
                  ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                  : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
              }`}
            />
            {isExternalValid && externalInput.length > 8 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#027A48]">
                <Check size={16} weight="bold" />
              </div>
            )}
          </div>
          {!isExternalValid && externalInput.length > 0 && (
            <p className="text-[11px] text-[#B42318] font-medium">
              Please enter a valid URL starting with http:// or https://
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-[#B42318] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
