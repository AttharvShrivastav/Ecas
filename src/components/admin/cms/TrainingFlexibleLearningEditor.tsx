import React from 'react';
import { Presentation } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type { FlexibleLearningSectionContent, FlexibleLearningFormat } from '../../../cms/types';

export interface TrainingFlexibleLearningEditorProps {
  id?: string;
  content: FlexibleLearningSectionContent;
  onChange: (updated: FlexibleLearningSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const TrainingFlexibleLearningEditor: React.FC<TrainingFlexibleLearningEditorProps> = ({
  id = 'section-learning-formats',
  content,
  onChange,
  errors = {},
  errorPrefix = 'flexibleLearning',
}) => {
  const heading = content?.heading || '';
  const description = content?.description || '';
  const formats = content?.formats || [];

  const handleHeadingChange = (value: string) => {
    onChange({
      ...content,
      heading: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({
      ...content,
      description: value,
    });
  };

  const handleFormatsChange = (newFormats: FlexibleLearningFormat[]) => {
    onChange({
      ...content,
      formats: newFormats,
    });
  };

  const handleAddFormat = (): FlexibleLearningFormat => {
    return {
      id: `format-${Date.now()}`,
      title: '',
      description: '',
      iconKey: 'presentation',
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Flexible Learning Formats"
      subtitle="Delivery options including in-person classroom, live virtual sessions, self-paced e-learning and custom in-house corporate workshops"
      icon={Presentation}
      badge="Delivery Modes"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Header Controls */}
        <div className="space-y-4">
          <CMSField
            id={`${id}-heading`}
            label="Section Heading"
            value={heading}
            onChange={handleHeadingChange}
            required
            maxLength={100}
            placeholder="e.g. Flexible Learning Formats"
            error={errors[`${errorPrefix}.heading`]}
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Introduction"
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            maxLength={300}
            placeholder="Introductory text describing flexible learning pathways..."
            error={errors[`${errorPrefix}.description`]}
          />
        </div>

        {/* Formats Repeater */}
        <CMSRepeater<FlexibleLearningFormat>
          id={`${id}-items`}
          title="Delivery Modes"
          subtitle="Different channels and structures available for students and corporate teams."
          items={formats}
          onChange={handleFormatsChange}
          onAdd={handleAddFormat}
          addButtonLabel="Add Format"
          minItems={1}
          getItemKey={(item, idx) => item.id || `format-${idx}`}
          getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
          renderItemSummary={(item) => (
            <div>
              <h4 className="text-sm font-semibold text-[#082046] tracking-tight truncate">
                {item.title ? item.title : <span className="text-slate-400 italic">(Empty Format Title)</span>}
              </h4>
              <p className="text-[11px] text-[#64748B] line-clamp-1">
                {item.description ? item.description : '(No description provided)'}
              </p>
            </div>
          )}
          renderItemForm={(item, _idx, updateItem) => (
            <div className="space-y-4">
              <CMSField
                label="Format Title"
                value={item.title}
                onChange={(val) => updateItem({ ...item, title: val })}
                required
                maxLength={60}
                placeholder="e.g. Classroom Training"
              />

              <CMSTextarea
                label="Format Description"
                value={item.description}
                onChange={(val) => updateItem({ ...item, description: val })}
                rows={3}
                maxLength={300}
                required
                placeholder="Detail the logistics, interactive environment, and benefits of this delivery method..."
              />

              <CMSIconSelect
                label="Format Icon"
                value={item.iconKey || 'presentation'}
                onChange={(val) => updateItem({ ...item, iconKey: val })}
                helperText="Visual icon displayed in the delivery format card."
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
