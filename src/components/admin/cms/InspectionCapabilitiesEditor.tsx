import React from 'react';
import { Briefcase } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  InspectionCapabilitiesContent,
  InspectionCapabilityItem,
} from '../../../cms/types';

export interface InspectionCapabilitiesEditorProps {
  id?: string;
  content: InspectionCapabilitiesContent;
  onChange: (updated: InspectionCapabilitiesContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionCapabilitiesEditor: React.FC<InspectionCapabilitiesEditorProps> = ({
  id = 'section-capabilities',
  content,
  onChange,
  errors = {},
  errorPrefix = 'capabilities',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const capabilities = content.capabilities || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleCapabilitiesChange = (updatedCaps: InspectionCapabilityItem[]) => {
    const reordered = updatedCaps.map((c, idx) => ({ ...c, order: idx + 1 }));
    onChange({ ...content, capabilities: reordered });
  };

  const handleAddCapability = (): InspectionCapabilityItem => {
    return {
      id: `cap-${Date.now()}`,
      title: 'New Inspection Capability',
      description: 'Detailed description of specialized surveillance, auditing, or witness service.',
      iconKey: 'shield-check',
      order: capabilities.length + 1,
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Specialized Capabilities"
      subtitle="3-card section highlighting Vendor Expediting, Vendor Audits, and Mill Inspection expertise"
      icon={Briefcase}
      badge="3 Core Pillars"
      errorCount={errorCount}
    >
      <div className="space-y-6">
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

        <CMSRepeater<InspectionCapabilityItem>
          id={`${id}-items-repeater`}
          title="Capability Cards"
          subtitle="Configure capability pillars, descriptions and Phosphor icons"
          items={capabilities}
          onChange={handleCapabilitiesChange}
          onAdd={handleAddCapability}
          addButtonLabel="Add Capability Item"
          minItems={1}
          getItemKey={(item, idx) => item.id || `cap-${idx}`}
          renderItemSummary={(item) => (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#082046]">{item.title}</span>
              <span className="text-[11px] text-[#64748B]">({item.iconKey})</span>
            </div>
          )}
          renderItemForm={(item, index, updateItem) => (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CMSField
                  id={`cap-${index}-title`}
                  label="Capability Title"
                  value={item.title}
                  onChange={(val) => updateItem({ ...item, title: val })}
                  required
                  maxLength={70}
                />
                <CMSIconSelect
                  id={`cap-${index}-icon`}
                  label="Capability Icon"
                  value={item.iconKey}
                  onChange={(val) => updateItem({ ...item, iconKey: val })}
                />
              </div>
              <CMSTextarea
                id={`cap-${index}-desc`}
                label="Capability Description"
                value={item.description}
                onChange={(val) => updateItem({ ...item, description: val })}
                rows={2}
                required
                maxLength={250}
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
