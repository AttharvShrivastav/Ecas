import React from 'react';
import { Certificate, Scales, Globe } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  AboutCertificationConfidenceContent,
  AboutCertificationFeatureItem,
} from '../../../cms/types';

export interface AboutCertificationSectionEditorProps {
  id?: string;
  content: AboutCertificationConfidenceContent;
  onChange: (updated: AboutCertificationConfidenceContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const AboutCertificationSectionEditor: React.FC<
  AboutCertificationSectionEditorProps
> = ({
  id = 'section-certification-confidence',
  content,
  onChange,
  errors = {},
  errorPrefix = 'certificationConfidence',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const features = content.features || [];

  const handleHeadingChange = (val: string) => {
    onChange({
      ...content,
      heading: val,
    });
  };

  const handleDescriptionChange = (val: string) => {
    onChange({
      ...content,
      description: val,
    });
  };

  const handleFeaturesChange = (nextFeatures: AboutCertificationFeatureItem[]) => {
    onChange({
      ...content,
      features: nextFeatures,
    });
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const descErrorKey = `${errorPrefix}.description`;
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Certification Confidence Strip"
      subtitle="Compact 3-column feature strip on CTA gradient highlighting accreditation and impartiality"
      icon={Certificate}
      badge="Features Strip"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Intro Heading & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSField
            id={`${id}-heading`}
            label="Section Display Heading"
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Certification built on confidence."
            required={true}
            maxLength={120}
            error={errors[headingErrorKey]}
            description="Left column headline."
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Copy"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="ECA helps organisations strengthen management systems, reduce risk..."
            required={true}
            maxLength={260}
            rows={2}
            error={errors[descErrorKey]}
            description="Left column explanatory paragraph."
          />
        </div>

        {/* Features Repeater - Fixed 3 columns */}
        <div className="pt-2">
          <CMSRepeater<AboutCertificationFeatureItem>
            id={`${id}-features`}
            title="Certification Features (3 Columns)"
            subtitle="Fixed collection of 3 feature cards displayed side-by-side on desktop."
            items={features}
            onChange={handleFeaturesChange}
            fixedItems={3}
            allowReorder={true}
            getItemKey={(item, idx) => item.id || `feature-${idx}`}
            getItemNumber={(item, idx) => `0${idx + 1}`}
            renderItemSummary={(item, idx) => (
              <div>
                <span className="text-xs font-bold text-[#082046] block truncate uppercase">
                  {item.title || `Feature #${idx + 1}`}
                </span>
                <span className="text-[11px] text-[#64748B] block truncate max-w-sm">
                  {item.description || 'Feature description...'}
                </span>
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <CMSField
                      label="Feature ID"
                      value={item.id ?? ''}
                      onChange={(val) => updateItem({ ...item, id: val })}
                      placeholder="e.g. accredited-certification"
                      required={true}
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <CMSField
                      label="Feature Title (Uppercase)"
                      value={item.title ?? ''}
                      onChange={(val) => updateItem({ ...item, title: val })}
                      placeholder="ACCREDITED CERTIFICATION"
                      required={true}
                      error={errors[`${errorPrefix}.features.${idx}.title`]}
                    />
                  </div>
                </div>

                <CMSTextarea
                  label="Feature Description"
                  value={item.description ?? ''}
                  onChange={(val) => updateItem({ ...item, description: val })}
                  placeholder="Certification services across internationally recognised management system standards..."
                  required={true}
                  maxLength={300}
                  rows={3}
                  error={errors[`${errorPrefix}.features.${idx}.description`]}
                />

                <CMSIconSelect
                  label="Feature Icon Badge"
                  value={item.icon}
                  onChange={(val) => updateItem({ ...item, icon: val as any })}
                  helperText="Phosphor icon symbol displayed in the badge."
                />
              </div>
            )}
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
