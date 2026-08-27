import React from 'react';
import { ShieldCheck, ChatCircleText, Buildings, ArrowsClockwise } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import { CMSImageField } from './CMSImageField';
import type { AboutConfidenceContent, AboutConfidenceItem, ImageAsset } from '../../../cms/types';

export interface AboutConfidenceSectionEditorProps {
  id?: string;
  content: AboutConfidenceContent;
  onChange: (updated: AboutConfidenceContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const AboutConfidenceSectionEditor: React.FC<AboutConfidenceSectionEditorProps> = ({
  id = 'section-confidence',
  content,
  onChange,
  errors = {},
  errorPrefix = 'confidence',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const items = content.items || [];

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

  const handleItemsChange = (nextItems: AboutConfidenceItem[]) => {
    onChange({
      ...content,
      items: nextItems,
    });
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const descErrorKey = `${errorPrefix}.description`;
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Confidence Cards"
      subtitle="4 key pillar cards with interactive image crossfading on public hover"
      icon={ShieldCheck}
      badge="Assurance Pillars"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Intro Heading & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSTextarea
            id={`${id}-heading`}
            label="Section Heading"
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Confidence Behind&#10;Every Certification"
            required={true}
            maxLength={140}
            rows={2}
            error={errors[headingErrorKey]}
            description="Display heading on left side."
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Paragraph"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Independent expertise, global reach, and practical assessments..."
            required={true}
            maxLength={300}
            rows={2}
            error={errors[descErrorKey]}
            description="Overview copy on right side."
          />
        </div>

        {/* Confidence 4 Cards Repeater (Fixed 4) */}
        <div className="pt-2">
          <CMSRepeater<AboutConfidenceItem>
            id={`${id}-items`}
            title="Confidence Cards (2x2 Grid)"
            subtitle="Fixed collection of 4 cards corresponding to the 4 hover states and image crossfades."
            items={items}
            onChange={handleItemsChange}
            fixedItems={4}
            allowReorder={true}
            getItemKey={(item, idx) => item.id || `conf-card-${idx}`}
            getItemNumber={(item, idx) => `0${idx + 1}`}
            renderItemSummary={(item, idx) => (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#082046] block truncate uppercase">
                    {item.title || `Card #${idx + 1}`}
                  </span>
                  <span className="text-[11px] text-[#64748B] block truncate max-w-sm">
                    {item.description || 'Card description text...'}
                  </span>
                </div>
                {item.image?.src && (
                  <span className="text-[10px] font-semibold text-[#00607A] bg-[#E6F4F8] px-2 py-0.5 rounded border border-[#00607A]/20 shrink-0">
                    Image Set
                  </span>
                )}
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <CMSField
                      label="Card ID (Anchor)"
                      value={item.id ?? ''}
                      onChange={(val) => updateItem({ ...item, id: val })}
                      placeholder="e.g. clear-communication"
                      required={true}
                      description="Unique identifier for crossfade reference"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <CMSField
                      label="Card Title (Uppercase)"
                      value={item.title ?? ''}
                      onChange={(val) => updateItem({ ...item, title: val })}
                      placeholder="CLEAR COMMUNICATION"
                      required={true}
                      error={errors[`${errorPrefix}.items.${idx}.title`]}
                    />
                  </div>
                </div>

                <CMSTextarea
                  label="Card Description"
                  value={item.description ?? ''}
                  onChange={(val) => updateItem({ ...item, description: val })}
                  placeholder="Clear requirements and transparent guidance throughout the process."
                  required={true}
                  maxLength={300}
                  rows={2}
                  error={errors[`${errorPrefix}.items.${idx}.description`]}
                />

                <CMSIconSelect
                  label="Card Icon Badge"
                  value={item.icon}
                  onChange={(val) => updateItem({ ...item, icon: val as any })}
                  helperText="Select the Phosphor icon symbol shown in the round badge."
                />

                {/* Left Dynamic Image Asset */}
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <CMSImageField
                    label="Active Crossfade Image (Left Column)"
                    helperText={`Image revealed in the large left column when Card #${idx + 1} (${item.title || 'this card'}) is hovered.`}
                    value={item.image ?? { src: '', alt: '' }}
                    onChange={(updatedImg) => updateItem({ ...item, image: updatedImg })}
                    defaultSrcPlaceholder={`/images/about/confidence-${item.id || 'image'}.webp`}
                    defaultAltPlaceholder={item.title || 'Confidence Image'}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
