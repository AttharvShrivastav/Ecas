import React from 'react';
import { Factory, Info } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  MillInspectionContent,
  MillInspectionProcessStage,
} from '../../../cms/types';

export interface InspectionMillEditorProps {
  id?: string;
  content: MillInspectionContent;
  onChange: (updated: MillInspectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionMillEditor: React.FC<InspectionMillEditorProps> = ({
  id = 'section-mill',
  content,
  onChange,
  errors = {},
  errorPrefix = 'millInspection',
}) => {
  const heading = content.heading || '';
  const paragraph1 = content.paragraph1 || '';
  const paragraph2 = content.paragraph2 || '';
  const stages = content.stages || [];
  const infoStripText = content.infoStripText || '';
  const infoStripIconKey = content.infoStripIconKey || 'shield-check';

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleParagraph1Change = (value: string) => {
    onChange({ ...content, paragraph1: value });
  };

  const handleParagraph2Change = (value: string) => {
    onChange({ ...content, paragraph2: value });
  };

  const handleStagesChange = (updatedStages: MillInspectionProcessStage[]) => {
    const reordered = updatedStages.map((s, idx) => ({ ...s, order: idx + 1 }));
    onChange({ ...content, stages: reordered });
  };

  const handleAddTimelineStage = (): MillInspectionProcessStage => {
    return {
      id: `mill-stage-${Date.now()}`,
      title: 'New Process Verification Stage',
      iconKey: 'scroll',
      order: stages.length + 1,
    };
  };

  const handleInfoStripTextChange = (value: string) => {
    onChange({ ...content, infoStripText: value });
  };

  const handleInfoStripIconChange = (value: string) => {
    onChange({ ...content, infoStripIconKey: value });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Mill Inspection & Pipeline Quality Surveillance"
      subtitle="Detailed metallurgical surveillance narratives, horizontal manufacturing timeline stages, and the assurance info strip"
      icon={Factory}
      badge="Process Timeline"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Heading & Dual Narrative Paragraphs */}
        <CMSField
          id={`${id}-heading`}
          label="Section Heading"
          value={heading}
          onChange={handleHeadingChange}
          required
          maxLength={100}
          error={errors[`${errorPrefix}.heading`]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CMSTextarea
            id={`${id}-paragraph1`}
            label="Narrative Paragraph 1"
            value={paragraph1}
            onChange={handleParagraph1Change}
            rows={3}
            maxLength={350}
            description="Overview of mill surveillance, quality plans and NDT witnessing."
          />
          <CMSTextarea
            id={`${id}-paragraph2`}
            label="Narrative Paragraph 2"
            value={paragraph2}
            onChange={handleParagraph2Change}
            rows={3}
            maxLength={350}
            description="Detailed metallurgical testing, tracking and dimensional verification."
          />
        </div>

        {/* Manufacturing Timeline Stages Repeater */}
        <CMSRepeater<MillInspectionProcessStage>
          id={`${id}-timeline-repeater`}
          title="Manufacturing Process Timeline"
          subtitle="Sequential quality control stages executed directly at the fabrication mill"
          items={stages}
          onChange={handleStagesChange}
          onAdd={handleAddTimelineStage}
          addButtonLabel="Add Process Stage"
          minItems={1}
          getItemKey={(stage, idx) => stage.id || `stage-${idx}`}
          renderItemSummary={(stage, idx) => (
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#00607A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="text-xs font-bold text-[#082046]">{stage.title}</span>
              <span className="text-[11px] text-[#64748B]">({stage.iconKey})</span>
            </div>
          )}
          renderItemForm={(stage, index, updateStage) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <CMSField
                id={`mill-stage-${index}-title`}
                label="Process Stage Title"
                value={stage.title}
                onChange={(val) => updateStage({ ...stage, title: val })}
                required
                maxLength={80}
              />
              <CMSIconSelect
                id={`mill-stage-${index}-icon`}
                label="Process Stage Icon"
                value={stage.iconKey}
                onChange={(val) => updateStage({ ...stage, iconKey: val })}
              />
            </div>
          )}
        />

        {/* Info Strip */}
        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-4">
          <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider flex items-center gap-1.5">
            <Info size={16} />
            Compliance & Standards Info Strip
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <CMSField
                id={`${id}-info-text`}
                label="Info Strip Text"
                value={infoStripText}
                onChange={handleInfoStripTextChange}
                maxLength={200}
                placeholder="Specialist surveillance across mill processes..."
              />
            </div>
            <div>
              <CMSIconSelect
                id={`${id}-info-icon`}
                label="Info Strip Icon"
                value={infoStripIconKey}
                onChange={handleInfoStripIconChange}
              />
            </div>
          </div>
        </div>
      </div>
    </CMSSectionCard>
  );
};
