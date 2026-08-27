import React from 'react';
import { Megaphone, ArrowSquareOut } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRouteSelect } from './CMSRouteSelect';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { ConsultingCTAContent } from '../../../cms/types';

export interface CMSCTAEditorProps {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  content?: ConsultingCTAContent;
  onChange: (updated: ConsultingCTAContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const CMSCTAEditor: React.FC<CMSCTAEditorProps> = ({
  id = 'section-cta',
  title = 'Consulting CTA Banner',
  subtitle = 'Bottom-of-page conversion banner prompting clients for consultation or certificate verification',
  badge = 'Conversion',
  content,
  onChange,
  errors = {},
  errorPrefix = 'consultingCta',
}) => {
  const safeContent: ConsultingCTAContent = {
    heading: content?.heading ?? '',
    description: content?.description ?? '',
    buttonLabel: content?.buttonLabel ?? '',
    buttonHref: content?.buttonHref ?? '/verify-certificate',
  };

  const heading = safeContent.heading;
  const description = safeContent.description;
  const buttonLabel = safeContent.buttonLabel;
  const buttonHref = safeContent.buttonHref;

  const handleHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...safeContent,
      heading: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...safeContent,
      description: e.target.value,
    });
  };

  const handleButtonLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...safeContent,
      buttonLabel: e.target.value,
    });
  };

  const handleButtonHrefChange = (newHref: string) => {
    onChange({
      ...safeContent,
      buttonHref: newHref,
    });
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const descErrorKey = `${errorPrefix}.description`;
  const btnLabelErrorKey = `${errorPrefix}.buttonLabel`;
  const btnHrefErrorKey = `${errorPrefix}.buttonHref`;

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title={title}
      subtitle={subtitle}
      icon={Megaphone}
      badge={badge}
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Banner Heading */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-heading`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
            >
              Banner Heading <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter current={heading.length} max={120} />
          </div>
          <p className="text-xs text-[#64748B] mb-1.5">
            Use a new line for secondary text emphasis (e.g. &quot;Need Expert Help?\nGet free consulting&quot;).
          </p>
          <textarea
            id={`${id}-heading`}
            rows={2}
            value={heading}
            maxLength={120}
            onChange={handleHeadingChange}
            placeholder="Need Expert Help?&#10;Get free consulting"
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors[headingErrorKey]
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          />
          {errors[headingErrorKey] && (
            <p className="text-xs text-[#B42318] mt-1 font-medium">
              {errors[headingErrorKey]}
            </p>
          )}
        </div>

        {/* Banner Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-desc`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
            >
              Banner Description <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter current={description.length} max={400} />
          </div>
          <textarea
            id={`${id}-desc`}
            rows={3}
            value={description}
            maxLength={400}
            onChange={handleDescriptionChange}
            placeholder="For ESG Assurance, Sustainability Verification and Compliance Assessment, our technical team is ready to assist..."
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-y ${
              errors[descErrorKey]
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          />
          {errors[descErrorKey] && (
            <p className="text-xs text-[#B42318] mt-1 font-medium">
              {errors[descErrorKey]}
            </p>
          )}
        </div>

        {/* Button Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-btn-label`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
              >
                Button Label (Single-Line) <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={buttonLabel.length} max={40} />
            </div>
            <input
              id={`${id}-btn-label`}
              type="text"
              value={buttonLabel}
              maxLength={40}
              onChange={handleButtonLabelChange}
              placeholder="e.g. VERIFY TODAY"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors uppercase font-bold ${
                errors[btnLabelErrorKey]
                  ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                  : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
              }`}
            />
            {errors[btnLabelErrorKey] && (
              <p className="text-xs text-[#B42318] mt-1 font-medium">
                {errors[btnLabelErrorKey]}
              </p>
            )}
          </div>

          <div>
            <CMSRouteSelect
              id={`${id}-btn-href`}
              value={buttonHref}
              onChange={handleButtonHrefChange}
              error={errors[btnHrefErrorKey]}
              label="Button Destination"
              required={true}
              allowExternal={true}
            />
          </div>
        </div>

        {/* Live CTA Mini-Card Visual Preview */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-2">
            Live Banner Appearance
          </span>
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#0F1B4A] via-[#1E3A8A] to-[#6B96CC] text-white shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <h4 className="text-lg sm:text-xl font-bold whitespace-pre-line tracking-tight leading-snug">
                  {heading || 'Need Expert Help?\nGet free consulting'}
                </h4>
                <p className="text-xs text-white/80 line-clamp-2">
                  {description || 'For ESG Assurance and Sustainability Assessment, our technical team is ready to assist...'}
                </p>
              </div>
              <div className="shrink-0">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#082046] font-bold text-xs rounded-full shadow-2xs uppercase tracking-wider pointer-events-none">
                  <span>{buttonLabel || 'BUTTON ACTION'}</span>
                  <ArrowSquareOut size={13} weight="bold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CMSSectionCard>
  );
};
