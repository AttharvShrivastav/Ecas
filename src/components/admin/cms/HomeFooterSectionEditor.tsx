import React from 'react';
import { Layout } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSImageField } from './CMSImageField';
import { CMSRouteSelect } from './CMSRouteSelect';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { FooterContent, ImageAsset } from '../../../cms/types';

export interface HomeFooterSectionEditorProps {
  id?: string;
  content: FooterContent;
  onChange: (updated: FooterContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeFooterSectionEditor: React.FC<HomeFooterSectionEditorProps> = ({
  id = 'section-home-footer',
  content,
  onChange,
  errors = {},
  errorPrefix = 'footer',
}) => {
  const brandHeading = content.brandHeading ?? '';
  const description = content.description ?? '';
  const verificationPlaceholder = content.verificationPlaceholder ?? '';
  const verificationButtonLabel = content.verificationButtonLabel ?? '';
  const copyright = content.copyright ?? '';
  const privacyLabel = content.privacyLabel ?? '';
  const privacyHref = content.privacyHref ?? '/privacy-policy';
  const termsLabel = content.termsLabel ?? '';
  const termsHref = content.termsHref ?? '/terms-of-use';
  const logoAsset: ImageAsset = content.logoAsset || {
    src: '/images/brand/eca-logo.webp',
    alt: 'ECA Logo',
    width: 80,
    height: 80,
  };

  const handleBrandHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      brandHeading: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      description: e.target.value,
    });
  };

  const handleVerificationPlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      verificationPlaceholder: e.target.value,
    });
  };

  const handleVerificationButtonLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      verificationButtonLabel: e.target.value,
    });
  };

  const handleCopyrightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      copyright: e.target.value,
    });
  };

  const handlePrivacyLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      privacyLabel: e.target.value,
    });
  };

  const handlePrivacyHrefChange = (newHref: string) => {
    onChange({
      ...content,
      privacyHref: newHref,
    });
  };

  const handleTermsLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      termsLabel: e.target.value,
    });
  };

  const handleTermsHrefChange = (newHref: string) => {
    onChange({
      ...content,
      termsHref: newHref,
    });
  };

  const handleLogoAssetChange = (newLogo: ImageAsset) => {
    onChange({
      ...content,
      logoAsset: newLogo,
    });
  };

  const brandHeadingError = errors[`${errorPrefix}.brandHeading`];
  const descError = errors[`${errorPrefix}.description`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Global Footer & Legal Notice"
      subtitle="Homepage global bottom card brand statements, verification shortcut, and policy links"
      icon={Layout}
      badge="Footer"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Brand Statement & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-brand-heading`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Brand Display Heading <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={brandHeading.length} max={80} />
            </div>
            <p className="text-xs text-[#64748B] mb-1.5">
              Multi-line brand mark (e.g. &quot;Certification\n& Inspection.\nAssured.&quot;).
            </p>
            <textarea
              id={`${id}-brand-heading`}
              rows={3}
              value={brandHeading}
              onChange={handleBrandHeadingChange}
              placeholder="Certification&#10;& Inspection.&#10;Assured."
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                brandHeadingError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {brandHeadingError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{brandHeadingError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-description`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Footer Supporting Description <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={description.length} max={250} />
            </div>
            <textarea
              id={`${id}-description`}
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="For ISO Certification and ISO Standards Implementation..."
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                descError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {descError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{descError}</p>
            )}
          </div>
        </div>

        {/* Verification Shortcut Fields inside Footer */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
          <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider">
            Footer Search Form Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                Input Placeholder
              </label>
              <input
                type="text"
                value={verificationPlaceholder}
                onChange={handleVerificationPlaceholderChange}
                placeholder="e.g. EXAMPLE- IND/02/678505"
                className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                Submit Button Label
              </label>
              <input
                type="text"
                value={verificationButtonLabel}
                onChange={handleVerificationButtonLabelChange}
                placeholder="e.g. VERIFY TODAY"
                className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
              />
            </div>
          </div>
        </div>

        {/* Legal & Policy Links */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
          <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider">
            Copyright Notice & Legal Links
          </h4>
          <div>
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
              Copyright Notice
            </label>
            <input
              type="text"
              value={copyright}
              onChange={handleCopyrightChange}
              placeholder="All Rights Reserved by ECAS EURO"
              className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Privacy Policy */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                Privacy Policy Link
              </label>
              <input
                type="text"
                value={privacyLabel}
                onChange={handlePrivacyLabelChange}
                placeholder="Privacy Policy"
                className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
              />
              <CMSRouteSelect
                label="Privacy Policy Route"
                value={privacyHref}
                onChange={handlePrivacyHrefChange}
              />
            </div>

            {/* Terms of Use */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                Terms of Use Link
              </label>
              <input
                type="text"
                value={termsLabel}
                onChange={handleTermsLabelChange}
                placeholder="Terms of Use"
                className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
              />
              <CMSRouteSelect
                label="Terms of Use Route"
                value={termsHref}
                onChange={handleTermsHrefChange}
              />
            </div>
          </div>
        </div>

        {/* Footer Brand Logo */}
        <div className="pt-2 border-t border-[#F1F5F9]">
          <CMSImageField
            label="Brand Logo Asset"
            value={logoAsset}
            onChange={handleLogoAssetChange}
            defaultSrcPlaceholder="/images/brand/eca-logo.webp"
            defaultAltPlaceholder="ECAS EURO Certification Directorate"
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
