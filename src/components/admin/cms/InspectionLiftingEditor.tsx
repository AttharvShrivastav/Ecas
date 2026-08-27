import React from 'react';
import { Crane } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSImageField } from './CMSImageField';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  LiftingEquipmentContent,
  LiftingEquipmentServiceItem,
  ImageAsset,
} from '../../../cms/types';

export interface InspectionLiftingEditorProps {
  id?: string;
  content: LiftingEquipmentContent;
  onChange: (updated: LiftingEquipmentContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionLiftingEditor: React.FC<InspectionLiftingEditorProps> = ({
  id = 'section-lifting',
  content,
  onChange,
  errors = {},
  errorPrefix = 'liftingEquipment',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const image: ImageAsset = typeof content.image === 'string'
    ? { src: content.image, alt: content.imageAlt || 'Lifting equipment inspection' }
    : content.image || { src: '', alt: '' };

  const services = content.services || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleImageChange = (updatedImage: ImageAsset) => {
    onChange({
      ...content,
      image: updatedImage.src,
      imageAlt: updatedImage.alt || content.imageAlt || '',
    });
  };

  const handleServicesChange = (updatedServices: LiftingEquipmentServiceItem[]) => {
    const reordered = updatedServices.map((s, idx) => ({ ...s, order: idx + 1 }));
    onChange({ ...content, services: reordered });
  };

  const handleAddService = (): LiftingEquipmentServiceItem => {
    return {
      id: `lifting-${Date.now()}`,
      title: 'New Lifting Equipment Inspection Service',
      iconKey: 'crane',
      order: services.length + 1,
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Lifting Equipment & Heavy Machinery Inspection"
      subtitle="Statutory crane, rigging, proof load testing and lifting gear inspection services with visual site photography"
      icon={Crane}
      badge="Lifting & Rigging"
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

        {/* Industrial Crane Image Field */}
        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0]">
          <CMSImageField
            id={`${id}-image`}
            label="Crane & Lifting Photography Asset"
            value={image}
            onChange={handleImageChange}
            helperText="Photography showing cranes, rigging, maritime lifting or heavy industrial handling gear."
          />
        </div>

        {/* Lifting Services Repeater */}
        <CMSRepeater<LiftingEquipmentServiceItem>
          id={`${id}-services-repeater`}
          title="Lifting Inspection Scope Services"
          subtitle="Specific statutory and proof-load inspection items displayed in the list"
          items={services}
          onChange={handleServicesChange}
          onAdd={handleAddService}
          addButtonLabel="Add Lifting Service"
          minItems={1}
          getItemKey={(item, idx) => item.id || `lifting-${idx}`}
          renderItemSummary={(item) => (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#082046]">{item.title}</span>
              <span className="text-[11px] text-[#64748B]">({item.iconKey})</span>
            </div>
          )}
          renderItemForm={(item, index, updateItem) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <CMSField
                id={`lifting-${index}-title`}
                label="Inspection Scope Title"
                value={item.title}
                onChange={(val) => updateItem({ ...item, title: val })}
                required
                maxLength={90}
              />
              <CMSIconSelect
                id={`lifting-${index}-icon`}
                label="Lifting Scope Icon"
                value={item.iconKey}
                onChange={(val) => updateItem({ ...item, iconKey: val })}
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
