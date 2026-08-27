import React, { useState } from 'react';
import { Globe, Plus, X } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSImageField } from './CMSImageField';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { SEOData, ImageAsset } from '../../../cms/types';

export interface CMSSEOEditorProps {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  defaultTitlePlaceholder?: string;
  defaultDescriptionPlaceholder?: string;
  content?: SEOData;
  seo?: SEOData;
  onChange: (updated: SEOData) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
  defaultOpen?: boolean;
}

export const CMSSEOEditor: React.FC<CMSSEOEditorProps> = ({
  id = 'section-seo',
  title = 'SEO & Metadata',
  subtitle = 'Search engine indexing, metadata titles, social share graph and snippet optimization',
  badge = 'Metadata',
  defaultTitlePlaceholder = 'e.g. ESG Assurance and Support | ECAS EURO',
  defaultDescriptionPlaceholder = 'Comprehensive ESG assurance and technical support services by ECAS EURO...',
  content,
  seo,
  onChange,
  errors = {},
  errorPrefix = 'seo',
  defaultOpen = false,
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  // Defensively handle missing or undefined seo / content props
  const rawSeo = seo ?? content;
  const safeSeo: SEOData = {
    title: rawSeo?.title ?? '',
    description: rawSeo?.description ?? '',
    keywords: Array.isArray(rawSeo?.keywords) ? rawSeo.keywords : [],
    canonicalUrl: rawSeo?.canonicalUrl ?? '',
    noIndex: Boolean(rawSeo?.noIndex),
    ogImage: rawSeo?.ogImage ?? { src: '', alt: '' },
    ogTitle: rawSeo?.ogTitle ?? rawSeo?.title ?? '',
    ogDescription: rawSeo?.ogDescription ?? rawSeo?.description ?? '',
  };

  const metaTitle = safeSeo.title;
  const description = safeSeo.description;
  const keywords = safeSeo.keywords ?? [];
  const canonicalUrl = safeSeo.canonicalUrl ?? '';
  const noIndex = Boolean(safeSeo.noIndex);
  const ogImage: ImageAsset = safeSeo.ogImage ?? { src: '', alt: '' };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...safeSeo,
      title: val,
      ogTitle: val,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange({
      ...safeSeo,
      description: val,
      ogDescription: val,
    });
  };

  const handleCanonicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...safeSeo,
      canonicalUrl: e.target.value,
    });
  };

  const handleNoIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...safeSeo,
      noIndex: e.target.checked,
    });
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const items = newKeyword
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && !keywords.includes(k));

    if (items.length > 0) {
      onChange({
        ...safeSeo,
        keywords: [...keywords, ...items],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = keywords.filter((_, i) => i !== index);
    onChange({
      ...safeSeo,
      keywords: updated,
    });
  };

  const handleOgImageChange = (updatedImage: ImageAsset) => {
    onChange({
      ...safeSeo,
      ogImage: updatedImage,
    });
  };

  const titleErrorKey = `${errorPrefix}.title`;
  const descErrorKey = `${errorPrefix}.description`;

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title={title}
      subtitle={subtitle}
      icon={Globe}
      badge={badge}
      defaultOpen={defaultOpen}
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Page Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-title`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
            >
              Meta Page Title <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter
              current={metaTitle.length}
              max={80}
              optimalMin={50}
              optimalMax={60}
            />
          </div>
          <input
            id={`${id}-title`}
            type="text"
            value={metaTitle}
            maxLength={80}
            onChange={handleTitleChange}
            placeholder={defaultTitlePlaceholder}
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors[titleErrorKey]
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          />
          {errors[titleErrorKey] && (
            <p className="text-xs text-[#B42318] mt-1 font-medium">
              {errors[titleErrorKey]}
            </p>
          )}
        </div>

        {/* Page Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-desc`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
            >
              Meta Description <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter
              current={description.length}
              max={250}
              optimalMin={140}
              optimalMax={160}
            />
          </div>
          <textarea
            id={`${id}-desc`}
            rows={3}
            value={description}
            maxLength={250}
            onChange={handleDescriptionChange}
            placeholder={defaultDescriptionPlaceholder}
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

        {/* Keywords */}
        <div>
          <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
            Keywords ({keywords.length})
          </label>
          <div className="flex items-center gap-2 mb-2.5">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              placeholder="Type keyword and press Enter or click Add (supports comma-separated)"
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3.5 py-2 text-xs font-semibold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>Add</span>
            </button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white text-[#334155] border border-[#CBD5E1] rounded-md shadow-2xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(i)}
                    className="text-[#94A3B8] hover:text-[#B42318] focus:outline-none cursor-pointer"
                    aria-label={`Remove keyword ${kw}`}
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Canonical URL & Indexing */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
          <div className="sm:col-span-8">
            <label
              htmlFor={`${id}-canonical`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5"
            >
              Canonical URL (Optional)
            </label>
            <input
              id={`${id}-canonical`}
              type="text"
              value={canonicalUrl}
              onChange={handleCanonicalChange}
              placeholder="https://ecaseuro.com/services/esg"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
            />
          </div>

          <div className="sm:col-span-4 flex items-end">
            <label className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg w-full cursor-pointer select-none">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={handleNoIndexChange}
                className="w-4 h-4 text-[#082046] rounded border-[#CBD5E1] focus:ring-[#082046]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#082046] block">No-Index</span>
                <span className="text-[#64748B] text-[10px]">Hide from search indexing</span>
              </div>
            </label>
          </div>
        </div>

        {/* Social / Open Graph Image Preview */}
        <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
          <CMSImageField
            value={ogImage}
            onChange={handleOgImageChange}
            label="Social Share Image (Open Graph)"
            defaultSrcPlaceholder="/images/brand/eca-logo.webp"
            defaultAltPlaceholder="Page Social Share Image"
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};

// Re-export alias
export const EsgSeoEditor = CMSSEOEditor;
