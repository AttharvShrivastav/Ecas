import React from 'react';
import { House, Plus, Trash, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSImageField } from './CMSImageField';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { HomeHeroContent, ImageAsset } from '../../../cms/types';

export interface HomeHeroSectionEditorProps {
  id?: string;
  content: HomeHeroContent;
  onChange: (updated: HomeHeroContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeHeroSectionEditor: React.FC<HomeHeroSectionEditorProps> = ({
  id = 'section-home-hero',
  content,
  onChange,
  errors = {},
  errorPrefix = 'hero',
}) => {
  const headingLines = content.headingLines || [];
  const description = content.description ?? '';
  const globeAsset: ImageAsset = content.globeAsset || {
    src: '/images/home/hero-globe.webp',
    alt: 'ECAS EURO Global Compliance and Certification Network',
  };

  const handleLineChange = (index: number, value: string) => {
    const updatedLines = [...headingLines];
    updatedLines[index] = value;
    onChange({
      ...content,
      headingLines: updatedLines,
    });
  };

  const handleAddLine = () => {
    onChange({
      ...content,
      headingLines: [...headingLines, ''],
    });
  };

  const handleRemoveLine = (index: number) => {
    if (headingLines.length <= 1) return;
    const updatedLines = headingLines.filter((_, i) => i !== index);
    onChange({
      ...content,
      headingLines: updatedLines,
    });
  };

  const handleMoveLine = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= headingLines.length) return;
    const updatedLines = [...headingLines];
    const temp = updatedLines[index];
    updatedLines[index] = updatedLines[targetIndex];
    updatedLines[targetIndex] = temp;
    onChange({
      ...content,
      headingLines: updatedLines,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      description: e.target.value,
    });
  };

  const handleGlobeChange = (updatedAsset: ImageAsset) => {
    onChange({
      ...content,
      globeAsset: updatedAsset,
    });
  };

  const heroHeadingError = errors[`${errorPrefix}.headingLines`];
  const heroDescError = errors[`${errorPrefix}.description`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Hero Section"
      subtitle="Homepage top display lines, introductory statement, and interactive globe visual asset"
      icon={House}
      badge="Top Fold"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Dynamic Heading Lines */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none">
              Hero Heading Lines <span className="text-[#B42318]">*</span>
            </label>
            <span className="text-xs text-[#64748B]">
              {headingLines.length} {headingLines.length === 1 ? 'line' : 'lines'} configured
            </span>
          </div>
          <p className="text-xs text-[#64748B] mb-3">
            Each line renders as a stacked high-contrast display statement in the top fold.
          </p>

          <div className="space-y-2.5">
            {headingLines.map((line, idx) => (
              <div
                key={`hero-line-${idx}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
              >
                <span className="text-xs font-mono font-bold text-[#082046] w-6 text-center select-none">
                  L{idx + 1}
                </span>

                <div className="flex-1">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    placeholder={`e.g. Line ${idx + 1}`}
                    className="w-full px-3 py-1.5 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
                  />
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveLine(idx, 'up')}
                    aria-label={`Move line ${idx + 1} up`}
                    className="p-1 text-[#64748B] hover:text-[#082046] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded transition-colors"
                  >
                    <ArrowUp size={14} weight="bold" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === headingLines.length - 1}
                    onClick={() => handleMoveLine(idx, 'down')}
                    aria-label={`Move line ${idx + 1} down`}
                    className="p-1 text-[#64748B] hover:text-[#082046] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded transition-colors"
                  >
                    <ArrowDown size={14} weight="bold" />
                  </button>
                  <button
                    type="button"
                    disabled={headingLines.length <= 1}
                    onClick={() => handleRemoveLine(idx)}
                    aria-label={`Delete line ${idx + 1}`}
                    className="p-1 text-[#64748B] hover:text-[#B42318] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded transition-colors"
                  >
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-start">
            <button
              type="button"
              onClick={handleAddLine}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00607A] hover:text-[#082046] bg-[#E6F4F8] hover:bg-[#D0ECF4] border border-[#00607A]/20 rounded-md transition-colors"
            >
              <Plus size={14} weight="bold" />
              Add Heading Line
            </button>
          </div>

          {heroHeadingError && (
            <p className="mt-2 text-xs font-semibold text-[#B42318]">{heroHeadingError}</p>
          )}
        </div>

        {/* Hero Supporting Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${id}-description`}
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
            >
              Hero Supporting Description <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter current={description.length} max={300} optimalMin={60} optimalMax={220} />
          </div>
          <textarea
            id={`${id}-description`}
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter introductory overview paragraph displayed alongside the heading..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg text-[#082046] bg-white border ${
              heroDescError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
            } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
          />
          {heroDescError && (
            <p className="mt-1 text-xs font-semibold text-[#B42318]">{heroDescError}</p>
          )}
        </div>

        {/* Hero Globe Asset */}
        <div className="pt-2 border-t border-[#F1F5F9]">
          <CMSImageField
            label="Hero Visual Asset (Globe Artwork)"
            value={globeAsset}
            onChange={handleGlobeChange}
            defaultSrcPlaceholder="/images/home/hero-globe.webp"
            defaultAltPlaceholder="ECAS EURO Global Compliance and Certification Network"
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
