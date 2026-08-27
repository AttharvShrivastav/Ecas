import React from 'react';
import { Globe, Buildings, MapPin, Factory } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSImageField } from './CMSImageField';
import type { AboutGlobalExpertiseContent, ImageAsset } from '../../../cms/types';

export interface AboutGlobalExpertiseSectionEditorProps {
  id?: string;
  content: AboutGlobalExpertiseContent;
  onChange: (updated: AboutGlobalExpertiseContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const AboutGlobalExpertiseSectionEditor: React.FC<
  AboutGlobalExpertiseSectionEditorProps
> = ({
  id = 'section-global-expertise',
  content,
  onChange,
  errors = {},
  errorPrefix = 'globalExpertise',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const countries = content.countries;
  const worldwide = content.worldwide;
  const offices = content.offices;
  const industries = content.industries;

  const handleHeadingChange = (val: string) => {
    onChange({ ...content, heading: val });
  };

  const handleDescriptionChange = (val: string) => {
    onChange({ ...content, description: val });
  };

  // Card 1 Countries handler
  const handleCountriesChange = (patch: Partial<typeof countries>) => {
    onChange({
      ...content,
      countries: {
        ...countries,
        ...patch,
      },
    });
  };

  const handleLocationsTextChange = (locationsStr: string) => {
    const locs = locationsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    handleCountriesChange({ locations: locs });
  };

  // Card 2 Worldwide handler
  const handleWorldwideChange = (patch: Partial<typeof worldwide>) => {
    onChange({
      ...content,
      worldwide: {
        ...worldwide,
        ...patch,
      },
    });
  };

  const handleWorldwideImageChange = (img: ImageAsset) => {
    handleWorldwideChange({ image: img });
  };

  // Card 3 Offices handler
  const handleOfficesChange = (patch: Partial<typeof offices>) => {
    onChange({
      ...content,
      offices: {
        ...offices,
        ...patch,
      },
    });
  };

  // Card 4 Industries handler
  const handleIndustriesChange = (patch: Partial<typeof industries>) => {
    onChange({
      ...content,
      industries: {
        ...industries,
        ...patch,
      },
    });
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const descErrorKey = `${errorPrefix}.description`;
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Global Expertise & Network"
      subtitle="4-card collage highlighting countries, worldwide reach, regional offices, and served industries"
      icon={Globe}
      badge="Global Collage"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Intro Heading & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSTextarea
            id={`${id}-heading`}
            label="Section Heading"
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Global Expertise,&#10;Local Understanding"
            required={true}
            maxLength={140}
            rows={2}
            error={errors[headingErrorKey]}
            description="Use newline for 2-line break."
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Copy"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Operating across borders while understanding local regulatory environments..."
            required={true}
            maxLength={300}
            rows={2}
            error={errors[descErrorKey]}
            description="Right-aligned description copy."
          />
        </div>

        {/* 4 Cards Form Structure */}
        <div className="space-y-6 pt-2">
          {/* Card 1: 10+ Countries */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#082046] font-bold text-sm">
              <MapPin size={18} className="text-[#032E64]" />
              <h4>Card 01: Countries Network (Upper Left)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CMSField
                label="Card Headline"
                value={countries.headline ?? ''}
                onChange={(val) => handleCountriesChange({ headline: val })}
                placeholder="10+ Countries"
                required={true}
                error={errors[`${errorPrefix}.countries.headline`]}
              />
              <CMSField
                label="Card Subtitle"
                value={countries.subtitle ?? ''}
                onChange={(val) => handleCountriesChange({ subtitle: val })}
                placeholder="International Network"
                required={true}
                error={errors[`${errorPrefix}.countries.subtitle`]}
              />
            </div>

            <CMSTextarea
              label="Card Description"
              value={countries.description ?? ''}
              onChange={(val) => handleCountriesChange({ description: val })}
              placeholder="Skilled specialists across multiple regions delivering consistent audit quality."
              required={true}
              maxLength={260}
              rows={2}
              error={errors[`${errorPrefix}.countries.description`]}
            />

            <CMSField
              label="Optional Sub-Description"
              value={countries.subDescription ?? ''}
              onChange={(val) => handleCountriesChange({ subDescription: val })}
              placeholder="Worldwide Certification"
            />

            <div>
              <CMSField
                label="Country Pill Badges (Comma-Separated)"
                value={(countries.locations || []).join(', ')}
                onChange={handleLocationsTextChange}
                placeholder="Oman, Qatar, Belgium, India"
                description="List of 4 countries layered over the world globe wireframe SVG."
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(countries.locations || []).map((loc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#CBD5E1] text-[#082046] shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#032E64]" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Worldwide */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#082046] font-bold text-sm">
              <Globe size={18} className="text-[#032E64]" />
              <h4>Card 02: Worldwide Capability (Lower Left)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CMSField
                label="Card Headline"
                value={worldwide.headline ?? ''}
                onChange={(val) => handleWorldwideChange({ headline: val })}
                placeholder="Worldwide"
                required={true}
                error={errors[`${errorPrefix}.worldwide.headline`]}
              />
              <CMSField
                label="Card Subtitle"
                value={worldwide.subtitle ?? ''}
                onChange={(val) => handleWorldwideChange({ subtitle: val })}
                placeholder="Global Capability"
                required={true}
                error={errors[`${errorPrefix}.worldwide.subtitle`]}
              />
            </div>

            <CMSTextarea
              label="Card Description"
              value={worldwide.description ?? ''}
              onChange={(val) => handleWorldwideChange({ description: val })}
              placeholder="International expertise delivered with practical understanding of your operational environment."
              required={true}
              maxLength={260}
              rows={2}
              error={errors[`${errorPrefix}.worldwide.description`]}
            />

            <CMSImageField
              label="Worldwide Editorial Photo"
              helperText="Bottom photo illustrating worldwide certification team in action."
              value={worldwide.image ?? { src: '', alt: '' }}
              onChange={handleWorldwideImageChange}
              defaultSrcPlaceholder="/images/about/global-worldwide.webp"
              defaultAltPlaceholder="Worldwide certification and global capability"
            />
          </div>

          {/* Card 3: 15+ Offices */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#082046] font-bold text-sm">
              <Buildings size={18} className="text-[#032E64]" />
              <h4>Card 03: Regional Offices (Upper Right)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CMSField
                label="Card Headline"
                value={offices.headline ?? ''}
                onChange={(val) => handleOfficesChange({ headline: val })}
                placeholder="15+ Offices"
                required={true}
                error={errors[`${errorPrefix}.offices.headline`]}
              />
              <CMSField
                label="Card Subtitle"
                value={offices.subtitle ?? ''}
                onChange={(val) => handleOfficesChange({ subtitle: val })}
                placeholder="Regional Presence"
                required={true}
                error={errors[`${errorPrefix}.offices.subtitle`]}
              />
            </div>

            <CMSTextarea
              label="Card Description"
              value={offices.description ?? ''}
              onChange={(val) => handleOfficesChange({ description: val })}
              placeholder="A strong network supporting organisations wherever they operate."
              required={true}
              maxLength={260}
              rows={2}
              error={errors[`${errorPrefix}.offices.description`]}
            />
          </div>

          {/* Card 4: Multiple Industries */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-2 text-[#082046] font-bold text-sm">
              <Factory size={18} className="text-[#032E64]" />
              <h4>Card 04: Multiple Industries (Lower Right)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CMSField
                label="Card Headline"
                value={industries.headline ?? ''}
                onChange={(val) => handleIndustriesChange({ headline: val })}
                placeholder="Multiple"
                required={true}
                error={errors[`${errorPrefix}.industries.headline`]}
              />
              <CMSField
                label="Card Subtitle"
                value={industries.subtitle ?? ''}
                onChange={(val) => handleIndustriesChange({ subtitle: val })}
                placeholder="Industries that we deal with"
                required={true}
                error={errors[`${errorPrefix}.industries.subtitle`]}
              />
            </div>

            <CMSTextarea
              label="Card Description Summary"
              value={industries.description ?? ''}
              onChange={(val) => handleIndustriesChange({ description: val })}
              placeholder="Serving organisations across Oil & Gas, Power, Mining, Construction, Engineering, Chemical, Food and other industries."
              required={true}
              maxLength={260}
              rows={2}
              error={errors[`${errorPrefix}.industries.description`]}
            />
          </div>
        </div>
      </div>
    </CMSSectionCard>
  );
};
