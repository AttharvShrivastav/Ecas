import React from 'react';
import { Target, Eye, ShieldCheck } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import { CMSImageField } from './CMSImageField';
import type { AboutVisionMissionContent, AboutValueItem, ImageAsset } from '../../../cms/types';

export interface AboutVisionMissionSectionEditorProps {
  id?: string;
  content: AboutVisionMissionContent;
  onChange: (updated: AboutVisionMissionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const AboutVisionMissionSectionEditor: React.FC<AboutVisionMissionSectionEditorProps> = ({
  id = 'section-vision-mission',
  content,
  onChange,
  errors = {},
  errorPrefix = 'visionMission',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const items = content.items || [];
  const supportStatement = content.supportStatement ?? '';
  const supportMapAsset = content.supportMapAsset ?? { src: '', alt: '' };

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

  const handleItemsChange = (nextItems: AboutValueItem[]) => {
    onChange({
      ...content,
      items: nextItems,
    });
  };

  const handleSupportStatementChange = (val: string) => {
    onChange({
      ...content,
      supportStatement: val,
    });
  };

  const handleSupportMapAssetChange = (updatedImage: ImageAsset) => {
    onChange({
      ...content,
      supportMapAsset: updatedImage,
    });
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const descErrorKey = `${errorPrefix}.description`;
  const supportStmtErrorKey = `${errorPrefix}.supportStatement`;
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Vision & Mission"
      subtitle="Vision & mission statements, value cards (fixed 2 items), and bottom assurance banner"
      icon={Target}
      badge="Core Identity"
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
            placeholder="Vision shapes our&#10;direction. Mission&#10;defines our purpose."
            required={true}
            maxLength={160}
            rows={3}
            error={errors[headingErrorKey]}
            description="Use newlines to break semantic heading lines."
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Paragraph"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="We believe standards and assurance create a better, safer and more sustainable world..."
            required={true}
            maxLength={300}
            rows={3}
            error={errors[descErrorKey]}
            description="Overview copy displayed beside the main heading."
          />
        </div>

        {/* Vision & Mission Cards - Fixed 2 items */}
        <div className="pt-2">
          <CMSRepeater<AboutValueItem>
            id={`${id}-items`}
            title="Vision & Mission Cards"
            subtitle="Fixed 2 core value cards (01 Our Vision, 02 Our Mission)"
            items={items}
            onChange={handleItemsChange}
            fixedItems={2}
            allowReorder={false}
            getItemKey={(item, idx) => item.id || `value-card-${idx}`}
            getItemNumber={(item, idx) => item.number || `0${idx + 1}`}
            renderItemSummary={(item, idx) => (
              <div>
                <span className="text-xs font-bold text-[#082046] block truncate">
                  {item.title || (idx === 0 ? 'Our Vision' : 'Our Mission')}
                </span>
                <span className="text-[11px] text-[#64748B] block truncate max-w-md">
                  {item.description || 'Value card description statement...'}
                </span>
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <CMSField
                      label="Card Number"
                      value={item.number ?? ''}
                      onChange={(val) => updateItem({ ...item, number: val })}
                      placeholder={idx === 0 ? '01' : '02'}
                      required={true}
                    />
                  </div>
                  <div className="sm:col-span-9">
                    <CMSField
                      label="Card Title"
                      value={item.title ?? ''}
                      onChange={(val) => updateItem({ ...item, title: val })}
                      placeholder={idx === 0 ? 'Our Vision' : 'Our Mission'}
                      required={true}
                      error={errors[`${errorPrefix}.items.${idx}.title`]}
                    />
                  </div>
                </div>

                <CMSTextarea
                  label="Card Description Statement"
                  value={item.description ?? ''}
                  onChange={(val) => updateItem({ ...item, description: val })}
                  placeholder="Enter value proposition statement..."
                  required={true}
                  maxLength={400}
                  rows={3}
                  error={errors[`${errorPrefix}.items.${idx}.description`]}
                />

                <CMSIconSelect
                  label="Card Icon"
                  value={item.icon}
                  onChange={(val) => updateItem({ ...item, icon: val as any })}
                  helperText="Visual icon symbol displayed inside the round badge."
                />
              </div>
            )}
          />
        </div>

        {/* Bottom Assurance Support Banner */}
        <div className="pt-4 border-t border-[#F1F5F9] space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#082046] uppercase tracking-wider mb-1">
              Bottom Support Statement Banner
            </h3>
            <p className="text-xs text-[#64748B]">
              Wide pale-blue statement strip rendered with shield icon and decorative map asset.
            </p>
          </div>

          <CMSTextarea
            id={`${id}-support-statement`}
            label="Support Statement Text"
            value={supportStatement}
            onChange={handleSupportStatementChange}
            placeholder="We make standards easier to understand, processes easier to navigate and assurance easier to trust."
            required={true}
            maxLength={250}
            rows={2}
            error={errors[supportStmtErrorKey]}
          />

          <CMSImageField
            id={`${id}-support-map`}
            label="Support Banner Decorative Map (Right edge)"
            helperText="Decorative background map asset anchored to the right side of the support banner."
            value={supportMapAsset}
            onChange={handleSupportMapAssetChange}
            defaultSrcPlaceholder="/images/about/about-support-map.webp"
            defaultAltPlaceholder="ECAS EURO Support Map Graphic"
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
