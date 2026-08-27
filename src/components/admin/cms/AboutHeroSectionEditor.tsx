import React from 'react';
import { Presentation, Sparkle } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSImageField } from './CMSImageField';
import type { AboutHeroContent, ImageAsset } from '../../../cms/types';

export interface AboutHeroSectionEditorProps {
  id?: string;
  content: AboutHeroContent;
  onChange: (updated: AboutHeroContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const AboutHeroSectionEditor: React.FC<AboutHeroSectionEditorProps> = ({
  id = 'section-about-hero',
  content,
  onChange,
  errors = {},
  errorPrefix = 'hero',
}) => {
  const headingLines = content.headingLines || [];
  const description = content.description ?? '';
  const visualAsset = content.visualAsset ?? { src: '', alt: '' };

  const handleHeadingLineChange = (index: number, val: string) => {
    const nextLines = [...headingLines];
    nextLines[index] = val;
    onChange({
      ...content,
      headingLines: nextLines,
    });
  };

  const handleDescriptionChange = (val: string) => {
    onChange({
      ...content,
      description: val,
    });
  };

  const handleVisualAssetChange = (updatedImage: ImageAsset) => {
    onChange({
      ...content,
      visualAsset: updatedImage,
    });
  };

  const descErrorKey = `${errorPrefix}.description`;
  const headingErrorKey = `${errorPrefix}.headingLines`;
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="About Page Hero"
      subtitle="Hero headline lines, supporting copy, and decorative world map vector asset"
      icon={Presentation}
      badge="Hero Section"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Heading Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
              Display Heading Lines <span className="text-[#B42318]">*</span>
            </label>
            <span className="text-[11px] text-[#64748B]">3 distinct visual display lines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CMSField
              id={`${id}-line-1`}
              label="Line 1"
              value={headingLines[0] ?? ''}
              onChange={(val) => handleHeadingLineChange(0, val)}
              placeholder="Independent"
              required={true}
              error={errors[`${headingErrorKey}.0`]}
            />
            <CMSField
              id={`${id}-line-2`}
              label="Line 2"
              value={headingLines[1] ?? ''}
              onChange={(val) => handleHeadingLineChange(1, val)}
              placeholder="Assurance,"
              error={errors[`${headingErrorKey}.1`]}
            />
            <CMSField
              id={`${id}-line-3`}
              label="Line 3"
              value={headingLines[2] ?? ''}
              onChange={(val) => handleHeadingLineChange(2, val)}
              placeholder="Made Clear"
              error={errors[`${headingErrorKey}.2`]}
            />
          </div>

          {errors[headingErrorKey] && (
            <p className="text-xs text-[#B42318] mt-1 font-medium">{errors[headingErrorKey]}</p>
          )}
        </div>

        {/* Hero Description */}
        <CMSTextarea
          id={`${id}-description`}
          label="Hero Supporting Description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="For ISO Certification and ISO Standards Implementation..."
          required={true}
          maxLength={400}
          optimalMin={120}
          optimalMax={260}
          rows={3}
          error={errors[descErrorKey]}
          description="Concise introductory statement below the main headline."
        />

        {/* Decorative Visual Asset */}
        <div className="pt-2 border-t border-[#F1F5F9]">
          <CMSImageField
            id={`${id}-visual-asset`}
            label="Hero Decorative World Map Asset"
            helperText="Upper-right dotted vector map displayed in the blue hero container."
            value={visualAsset}
            onChange={handleVisualAssetChange}
            defaultSrcPlaceholder="/images/about/about-hero-map.svg"
            defaultAltPlaceholder="ECAS EURO World Map"
          />
        </div>

        {/* Live Hero Miniature Preview */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-2">
            Live Hero Composition Preview
          </span>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#082046] via-[#0D2F66] to-[#124285] text-white shadow-2xs relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-[#7DD3FC] border border-white/10">
                <Sparkle size={11} weight="fill" /> About ECAS EURO
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                {headingLines.filter(Boolean).join(' ') || 'Independent Assurance, Made Clear'}
              </h3>
              <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
                {description || 'For ISO Certification and ISO Standards Implementation...'}
              </p>
            </div>
            {visualAsset.src && (
              <img
                src={visualAsset.src}
                alt=""
                className="absolute right-0 top-0 h-full w-auto opacity-30 object-contain pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>
    </CMSSectionCard>
  );
};
