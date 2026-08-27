import React from 'react';
import { Certificate } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { CertificateShortcutContent } from '../../../cms/types';

export interface HomeCertificateShortcutEditorProps {
  id?: string;
  content: CertificateShortcutContent;
  onChange: (updated: CertificateShortcutContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeCertificateShortcutEditor: React.FC<HomeCertificateShortcutEditorProps> = ({
  id = 'section-home-cert-shortcut',
  content,
  onChange,
  errors = {},
  errorPrefix = 'certificateShortcut',
}) => {
  const heading = content.heading ?? '';
  const placeholder = content.placeholder ?? '';
  const buttonLabel = content.buttonLabel ?? '';

  const handleHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      heading: e.target.value,
    });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      placeholder: e.target.value,
    });
  };

  const handleButtonLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      buttonLabel: e.target.value,
    });
  };

  const headingError = errors[`${errorPrefix}.heading`];
  const placeholderError = errors[`${errorPrefix}.placeholder`];
  const btnLabelError = errors[`${errorPrefix}.buttonLabel`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Certificate Verification Shortcut Banner"
      subtitle="Homepage inline navy gradient banner for quick certificate verification lookup"
      icon={Certificate}
      badge="Verification"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Banner Heading */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-heading`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
            >
              Banner Heading <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter current={heading.length} max={80} />
          </div>
          <p className="text-xs text-[#64748B] mb-1.5">
            Use a line break to match the high-contrast display styling (e.g. &quot;Verify an ECAS EURO\ncertificate&quot;).
          </p>
          <textarea
            id={`${id}-heading`}
            rows={2}
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Verify an ECAS EURO&#10;certificate"
            className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
              headingError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
            } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
          />
          {headingError && (
            <p className="mt-1 text-xs font-semibold text-[#B42318]">{headingError}</p>
          )}
        </div>

        {/* Input Placeholder & Button Label */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-placeholder`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Search Input Placeholder <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={placeholder.length} max={50} />
            </div>
            <input
              id={`${id}-placeholder`}
              type="text"
              value={placeholder}
              onChange={handlePlaceholderChange}
              placeholder="e.g. EXAMPLE- IND/02/678505"
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                placeholderError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {placeholderError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{placeholderError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-btn-label`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Verification Button Label <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={buttonLabel.length} max={30} />
            </div>
            <input
              id={`${id}-btn-label`}
              type="text"
              value={buttonLabel}
              onChange={handleButtonLabelChange}
              placeholder="e.g. VERIFY TODAY"
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                btnLabelError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {btnLabelError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{btnLabelError}</p>
            )}
          </div>
        </div>
      </div>
    </CMSSectionCard>
  );
};
