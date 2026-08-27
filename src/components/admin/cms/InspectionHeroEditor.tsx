import React from 'react';
import { MagnifyingGlass, Plus, Trash } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSTextarea } from './CMSTextarea';
import type { InspectionHeroContent } from '../../../cms/types';

export interface InspectionHeroEditorProps {
  id?: string;
  content: InspectionHeroContent;
  onChange: (updated: InspectionHeroContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionHeroEditor: React.FC<InspectionHeroEditorProps> = ({
  id = 'section-hero',
  content,
  onChange,
  errors = {},
  errorPrefix = 'hero',
}) => {
  const headingLines = content.headingLines || [];
  const description = content.description || '';

  const handleHeadingLineChange = (index: number, value: string) => {
    const nextLines = [...headingLines];
    nextLines[index] = value;
    onChange({
      ...content,
      headingLines: nextLines,
    });
  };

  const handleAddHeadingLine = () => {
    onChange({
      ...content,
      headingLines: [...headingLines, ''],
    });
  };

  const handleRemoveHeadingLine = (index: number) => {
    if (headingLines.length <= 1) return;
    onChange({
      ...content,
      headingLines: headingLines.filter((_, i) => i !== index),
    });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({
      ...content,
      description: value,
    });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Hero Section"
      subtitle="Header typography, multi-line heading stack and introductory narrative for Technical Inspection Services"
      icon={MagnifyingGlass}
      badge="Hero Banner"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Heading Lines Stack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
              Heading Lines (H1 Stack) <span className="text-[#B42318]">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddHeadingLine}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#00607A] hover:text-[#082046] transition-colors"
            >
              <Plus size={14} weight="bold" />
              <span>Add Heading Line</span>
            </button>
          </div>
          <p className="text-xs text-[#64748B]">
            Each line renders as a distinct typographic row in the main page hero.
          </p>

          <div className="space-y-2.5">
            {headingLines.map((line, idx) => {
              const lineError = errors[`${errorPrefix}.headingLines.${idx}`] || (idx === 0 && errors[`${errorPrefix}.headingLines`]);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => handleHeadingLineChange(idx, e.target.value)}
                      placeholder={`Line #${idx + 1} text...`}
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        lineError
                          ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                          : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
                      }`}
                    />
                  </div>
                  {headingLines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHeadingLine(idx)}
                      className="p-2 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg transition-colors"
                      title="Remove line"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Description */}
        <CMSTextarea
          id={`${id}-description`}
          label="Hero Supporting Description"
          value={description}
          onChange={handleDescriptionChange}
          rows={3}
          maxLength={300}
          optimalMin={60}
          optimalMax={240}
          required
          description="High-level narrative explaining independent technical surveillance, QA/QC, and asset integrity."
          error={errors[`${errorPrefix}.description`]}
        />
      </div>
    </CMSSectionCard>
  );
};
