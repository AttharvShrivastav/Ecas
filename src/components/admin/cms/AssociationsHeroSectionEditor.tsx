import React from 'react';
import { Plus, Trash, TextT } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { AssociationsHeroContent } from '../../../cms/types';

export interface AssociationsHeroSectionEditorProps {
  content: AssociationsHeroContent;
  onChange: (updated: AssociationsHeroContent) => void;
  errors?: Record<string, string>;
}

export const AssociationsHeroSectionEditor: React.FC<AssociationsHeroSectionEditorProps> = ({
  content,
  onChange,
  errors = {},
}) => {
  const headingLines = content?.headingLines || [];
  const description = content?.description ?? '';

  const handleLineChange = (index: number, value: string) => {
    const updated = [...headingLines];
    updated[index] = value;
    onChange({
      ...content,
      headingLines: updated,
    });
  };

  const handleAddLine = () => {
    if (headingLines.length >= 4) return;
    onChange({
      ...content,
      headingLines: [...headingLines, ''],
    });
  };

  const handleRemoveLine = (index: number) => {
    if (headingLines.length <= 1) return;
    const updated = headingLines.filter((_, i) => i !== index);
    onChange({
      ...content,
      headingLines: updated,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      description: e.target.value,
    });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith('hero.')).length;

  return (
    <CMSSectionCard
      id="section-hero"
      title="Hero Section"
      subtitle="Page header headline and introductory narrative for Associations & Partners"
      icon={TextT}
      badge="Header"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Heading Lines List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                Hero Heading Lines <span className="text-[#B42318]">*</span>
              </label>
              <p className="text-xs text-[#64748B] mt-0.5">
                Each line renders on a distinct typographic row on desktop (Max 4 lines).
              </p>
            </div>
            {headingLines.length < 4 && (
              <button
                type="button"
                onClick={handleAddLine}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-md transition-colors border border-[#CBD5E1] cursor-pointer"
              >
                <Plus size={13} weight="bold" />
                <span>Add Line</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {headingLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-[#94A3B8]">
                  L{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={line}
                    maxLength={100}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    placeholder={`e.g. ${idx === 0 ? 'Associations built' : 'on trusted expertise.'}`}
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors[`hero.headingLines.${idx}`] || (!line.trim() && errors['hero.headingLines'])
                        ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                        : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
                    }`}
                  />
                </div>
                {headingLines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="p-2 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg transition-colors cursor-pointer"
                    title="Remove line"
                    aria-label={`Remove line ${idx + 1}`}
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors['hero.headingLines'] && (
            <p className="text-xs text-[#B42318] mt-1.5 font-medium">
              {errors['hero.headingLines']}
            </p>
          )}

          {/* Heading Live Preview */}
          <div className="mt-3 p-4 bg-[#082046] rounded-lg text-white border border-[#1E3A8A]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] block mb-1">
              Live Heading Preview
            </span>
            <div className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-white">
              {headingLines.filter((l) => l && l.trim()).length > 0 ? (
                headingLines.map((l, i) => <div key={i}>{l}</div>)
              ) : (
                <span className="text-slate-400 italic font-normal text-sm">
                  (Empty heading)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="hero-description"
              className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
            >
              Hero Subtitle / Description <span className="text-[#B42318]">*</span>
            </label>
            <CMSCharacterCounter current={description.length} max={400} />
          </div>
          <textarea
            id="hero-description"
            rows={3}
            value={description}
            maxLength={400}
            onChange={handleDescriptionChange}
            placeholder="Enter concise hero introductory copy..."
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-y ${
              errors['hero.description']
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          />
          {errors['hero.description'] && (
            <p className="text-xs text-[#B42318] mt-1 font-medium">
              {errors['hero.description']}
            </p>
          )}
        </div>
      </div>
    </CMSSectionCard>
  );
};
