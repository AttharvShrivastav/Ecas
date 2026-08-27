import React from 'react';
import { ShieldCheck, Stack } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSImageField } from './CMSImageField';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  ThirdPartyInspectionContent,
  ProjectStageItem,
  ImageAsset,
} from '../../../cms/types';

export interface InspectionThirdPartyEditorProps {
  id?: string;
  content: ThirdPartyInspectionContent;
  onChange: (updated: ThirdPartyInspectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionThirdPartyEditor: React.FC<InspectionThirdPartyEditorProps> = ({
  id = 'section-third-party',
  content,
  onChange,
  errors = {},
  errorPrefix = 'thirdParty',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const image: ImageAsset = typeof content.image === 'string'
    ? { src: content.image, alt: 'Industrial inspection photography' }
    : content.image || { src: '', alt: '' };

  const overlay = content.overlay || { heading: '', description: '', iconKey: 'shield' };
  const stages = content.stages || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleImageChange = (updatedImage: ImageAsset) => {
    onChange({ ...content, image: updatedImage });
  };

  const handleOverlayChange = (field: 'heading' | 'description' | 'iconKey', value: string) => {
    onChange({
      ...content,
      overlay: {
        ...overlay,
        [field]: value,
      },
    });
  };

  const handleStagesChange = (updatedStages: ProjectStageItem[]) => {
    onChange({ ...content, stages: updatedStages });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Third-Party Inspections & Asset Lifecycle"
      subtitle="Main inspection narrative, industrial photography asset with assurance overlay, and the 4-phase lifecycle stages"
      icon={ShieldCheck}
      badge="Hero Asset & 4 Stages"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Intro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CMSField
            id={`${id}-heading`}
            label="Section Heading"
            value={heading}
            onChange={handleHeadingChange}
            required
            maxLength={100}
            error={errors[`${errorPrefix}.heading`]}
          />
          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Description"
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            maxLength={250}
            error={errors[`${errorPrefix}.description`]}
          />
        </div>

        {/* Industrial Photography Asset & Overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0]">
          <div>
            <CMSImageField
              id={`${id}-image`}
              label="Industrial Photography Asset"
              value={image}
              onChange={handleImageChange}
              helperText="High-resolution photography representing plant, piping or industrial construction."
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider flex items-center gap-1.5">
              <Stack size={16} />
              Assurance Overlay Card
            </h4>
            <p className="text-xs text-[#64748B]">
              Floats over the industrial image on the public page to reinforce QA/QC credentials.
            </p>

            <CMSField
              id={`${id}-overlay-heading`}
              label="Overlay Heading"
              value={overlay.heading}
              onChange={(val) => handleOverlayChange('heading', val)}
              maxLength={80}
              placeholder="e.g. Independent. Impartial. Reliable."
            />
            <CMSTextarea
              id={`${id}-overlay-desc`}
              label="Overlay Description"
              value={overlay.description}
              onChange={(val) => handleOverlayChange('description', val)}
              rows={2}
              maxLength={250}
              placeholder="Describe on-site presence, witness points and verification protocols..."
            />
            <CMSIconSelect
              id={`${id}-overlay-icon`}
              label="Overlay Badge Icon"
              value={overlay.iconKey || 'shield'}
              onChange={(val) => handleOverlayChange('iconKey', val)}
            />
          </div>
        </div>

        {/* 4 Lifecycle Stages Repeater */}
        <CMSRepeater<ProjectStageItem>
          id={`${id}-stages-repeater`}
          title="Lifecycle Inspection Stages"
          subtitle="The 4 core stages of inspection: Design, Construction, Installation, and Commissioning"
          items={stages}
          onChange={handleStagesChange}
          minItems={4}
          maxItems={4}
          allowReorder={true}
          getItemKey={(stage, idx) => stage.id || `stage-${idx}`}
          renderItemSummary={(stage, idx) => (
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-[#082046] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {stage.number || `0${idx + 1}`}
              </span>
              <span className="text-xs font-bold text-[#082046]">{stage.title}</span>
              <span className="text-[11px] text-[#64748B]">({stage.iconKey})</span>
            </div>
          )}
          renderItemForm={(stage, index, updateStage) => (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CMSField
                  id={`stage-${index}-number`}
                  label="Stage Number"
                  value={stage.number || `0${index + 1}`}
                  onChange={(val) => updateStage({ ...stage, number: val })}
                  maxLength={10}
                  placeholder="01"
                />
                <CMSField
                  id={`stage-${index}-title`}
                  label="Stage Title"
                  value={stage.title}
                  onChange={(val) => updateStage({ ...stage, title: val })}
                  required
                  maxLength={60}
                />
                <CMSIconSelect
                  id={`stage-${index}-icon`}
                  label="Stage Icon"
                  value={stage.iconKey}
                  onChange={(val) => updateStage({ ...stage, iconKey: val })}
                />
              </div>
              <CMSTextarea
                id={`stage-${index}-desc`}
                label="Stage Description"
                value={stage.description}
                onChange={(val) => updateStage({ ...stage, description: val })}
                rows={2}
                required
                maxLength={200}
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
