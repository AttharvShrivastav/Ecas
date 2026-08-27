import React from 'react';
import { CMSCharacterCounter } from './CMSCharacterCounter';

export interface CMSTextareaProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  optimalMin?: number;
  optimalMax?: number;
  rows?: number;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
}

export const CMSTextarea: React.FC<CMSTextareaProps> = ({
  id,
  label,
  value = '',
  onChange,
  error,
  required = false,
  maxLength,
  optimalMin,
  optimalMax,
  rows = 3,
  placeholder,
  description,
  disabled = false,
  className = '',
  textareaClassName = '',
}) => {
  const inputId = id || `textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>
        {maxLength !== undefined && (
          <CMSCharacterCounter
            current={value.length}
            max={maxLength}
            optimalMin={optimalMin}
            optimalMax={optimalMax}
          />
        )}
      </div>

      {description && (
        <p className="text-xs text-[#64748B]">{description}</p>
      )}

      <textarea
        id={inputId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-y ${
          error
            ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
            : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
        } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''} ${textareaClassName}`.trim()}
      />

      {error && (
        <p className="text-xs text-[#B42318] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
