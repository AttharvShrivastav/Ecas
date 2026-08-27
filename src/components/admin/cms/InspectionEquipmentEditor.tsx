import React from 'react';
import { Gear } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type {
  EquipmentCoverageContent,
  EquipmentItem,
} from '../../../cms/types';

export interface InspectionEquipmentEditorProps {
  id?: string;
  content: EquipmentCoverageContent;
  onChange: (updated: EquipmentCoverageContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const InspectionEquipmentEditor: React.FC<InspectionEquipmentEditorProps> = ({
  id = 'section-equipment',
  content,
  onChange,
  errors = {},
  errorPrefix = 'equipmentCoverage',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const items = content.items || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleItemsChange = (updatedItems: EquipmentItem[]) => {
    const reordered = updatedItems.map((it, idx) => ({ ...it, order: idx + 1 }));
    onChange({ ...content, items: reordered });
  };

  const handleAddItem = (): EquipmentItem => {
    return {
      id: `equip-${Date.now()}`,
      title: 'New Equipment Class',
      iconKey: 'cylinder',
      order: items.length + 1,
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Equipment Coverage Matrix"
      subtitle="The comprehensive industrial equipment types inspected across energy, chemical, and heavy engineering facilities"
      icon={Gear}
      badge="Equipment Matrix"
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

        <CMSRepeater<EquipmentItem>
          id={`${id}-items-repeater`}
          title="Equipment Types"
          subtitle="Configure equipment coverage tiles, labels and Phosphor icons"
          items={items}
          onChange={handleItemsChange}
          onAdd={handleAddItem}
          addButtonLabel="Add Equipment Type"
          minItems={1}
          getItemKey={(item, idx) => item.id || `equip-${idx}`}
          renderItemSummary={(item) => (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#082046]">{item.title}</span>
              <span className="text-[11px] text-[#64748B]">({item.iconKey})</span>
            </div>
          )}
          renderItemForm={(item, index, updateItem) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <CMSField
                id={`equip-${index}-title`}
                label="Equipment Title"
                value={item.title}
                onChange={(val) => updateItem({ ...item, title: val })}
                required
                maxLength={80}
              />
              <CMSIconSelect
                id={`equip-${index}-icon`}
                label="Equipment Icon"
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
