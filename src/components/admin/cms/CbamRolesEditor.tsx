import React from 'react';
import { UserFocus } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type { CbamVerifierRoleContent, CbamVerifierRoleItem } from '../../../cms/types';

export interface CbamRolesEditorProps {
  id?: string;
  content: CbamVerifierRoleContent;
  onChange: (updated: CbamVerifierRoleContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const CbamRolesEditor: React.FC<CbamRolesEditorProps> = ({
  id = 'section-roles',
  content,
  onChange,
  errors = {},
  errorPrefix = 'roles',
}) => {
  const heading = content?.heading || '';
  const description = content?.description || '';
  const items = content?.items || [];

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

  const handleItemsChange = (newItems: CbamVerifierRoleItem[]) => {
    const updated = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    onChange({
      ...content,
      items: updated,
    });
  };

  const handleAddItem = (): CbamVerifierRoleItem => {
    const nextOrder = items.length + 1;
    return {
      id: `role-${Date.now()}`,
      title: '',
      description: '',
      iconKey: 'magnifying-glass',
      order: nextOrder,
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Role of the CBAM Verifier"
      subtitle="Audit activities, surveillance verification, site inspections, and formal declaration reports"
      icon={UserFocus}
      badge="Verification Scope"
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
            placeholder="e.g. Role of the CBAM Verifier"
            error={errors[`${errorPrefix}.heading`]}
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Section Introduction"
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            maxLength={300}
            placeholder="Introduce the verifier's statutory duties and technical obligations..."
            error={errors[`${errorPrefix}.description`]}
          />
        </div>

        {/* Verifier Role Items Repeater */}
        <CMSRepeater<CbamVerifierRoleItem>
          id={`${id}-items`}
          title="Verifier Audit Responsibilities"
          subtitle="Specific verification work packages and site visit scopes."
          items={items}
          onChange={handleItemsChange}
          onAdd={handleAddItem}
          addButtonLabel="Add Responsibility"
          minItems={1}
          getItemKey={(item, idx) => item.id || `role-${idx}`}
          getItemNumber={(item, idx) => String(item.order || idx + 1).padStart(2, '0')}
          renderItemSummary={(item) => (
            <div>
              <h4 className="text-sm font-semibold text-[#082046] tracking-tight truncate">
                {item.title ? item.title : <span className="text-slate-400 italic">(Empty Responsibility Title)</span>}
              </h4>
              <p className="text-[11px] text-[#64748B] line-clamp-1">
                {item.description ? item.description : '(No description provided)'}
              </p>
            </div>
          )}
          renderItemForm={(item, idx, updateItem) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <CMSField
                    label="Responsibility Title"
                    value={item.title}
                    onChange={(val) => updateItem({ ...item, title: val })}
                    required
                    maxLength={70}
                    placeholder="e.g. Data Review & Methodology Assessment"
                  />
                </div>
                <div>
                  <CMSField
                    label="Display Order"
                    type="number"
                    value={String(item.order || idx + 1)}
                    onChange={(val) => updateItem({ ...item, order: parseInt(val, 10) || idx + 1 })}
                  />
                </div>
              </div>

              <CMSTextarea
                label="Detailed Description"
                value={item.description}
                onChange={(val) => updateItem({ ...item, description: val })}
                rows={3}
                maxLength={400}
                required
                placeholder="Detail the technical tasks and evaluation scope performed by the verifier..."
              />

              <CMSIconSelect
                label="Icon Representation"
                value={item.iconKey || 'magnifying-glass'}
                onChange={(val) => updateItem({ ...item, iconKey: val })}
                helperText="Icon shown alongside this audit duty on the public page."
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
