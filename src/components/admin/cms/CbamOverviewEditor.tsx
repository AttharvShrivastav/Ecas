import React from 'react';
import { ShieldCheck, Plus, Trash } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type { CbamOverviewContent, CbamProcessStep } from '../../../cms/types';

export interface CbamOverviewEditorProps {
  id?: string;
  content: CbamOverviewContent;
  onChange: (updated: CbamOverviewContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const CbamOverviewEditor: React.FC<CbamOverviewEditorProps> = ({
  id = 'section-overview',
  content,
  onChange,
  errors = {},
  errorPrefix = 'overview',
}) => {
  const heading = content?.heading || '';
  const paragraphs = content?.paragraphs || [];
  const processSteps = content?.processSteps || [];

  const handleHeadingChange = (value: string) => {
    onChange({
      ...content,
      heading: value,
    });
  };

  const handleParagraphChange = (index: number, value: string) => {
    const nextParagraphs = [...paragraphs];
    nextParagraphs[index] = value;
    onChange({
      ...content,
      paragraphs: nextParagraphs,
    });
  };

  const handleAddParagraph = () => {
    onChange({
      ...content,
      paragraphs: [...paragraphs, ''],
    });
  };

  const handleRemoveParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    onChange({
      ...content,
      paragraphs: paragraphs.filter((_, i) => i !== index),
    });
  };

  const handleProcessStepsChange = (newSteps: CbamProcessStep[]) => {
    const updated = newSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    onChange({
      ...content,
      processSteps: updated,
    });
  };

  const handleAddProcessStep = (): CbamProcessStep => {
    const nextOrder = processSteps.length + 1;
    return {
      id: `step-${Date.now()}`,
      title: '',
      iconKey: 'shield-check',
      order: nextOrder,
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="CBAM Overview & Process Steps"
      subtitle="Regulatory background narrative and the 4-stage sequential verification workflow"
      icon={ShieldCheck}
      badge="Overview"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Heading */}
        <CMSField
          id={`${id}-heading`}
          label="Section Heading"
          value={heading}
          onChange={handleHeadingChange}
          required
          maxLength={120}
          placeholder="e.g. EU CBAM Verification: Scope and Application"
          description="Primary title displayed above the narrative paragraphs and process flowchart."
          error={errors[`${errorPrefix}.heading`]}
        />

        {/* Narrative Paragraphs */}
        <div className="space-y-3 pt-2 border-t border-[#F1F5F9]">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                Narrative Paragraphs ({paragraphs.length}) <span className="text-[#B42318]">*</span>
              </label>
              <p className="text-xs text-[#64748B] mt-0.5">
                Detailed textual explanation of CBAM obligations, reporting periods, and importer/producer requirements.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#00607A] hover:text-[#082046] transition-colors cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-3">
            {paragraphs.map((pText, idx) => (
              <div key={idx} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#082046] uppercase tracking-wide">
                    Paragraph #{idx + 1}
                  </span>
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded transition-colors"
                      title="Remove paragraph"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>
                <CMSTextarea
                  id={`${id}-para-${idx}`}
                  label=""
                  value={pText}
                  onChange={(val) => handleParagraphChange(idx, val)}
                  rows={3}
                  maxLength={600}
                  placeholder="Enter informative paragraph text..."
                  error={errors[`${errorPrefix}.paragraphs.${idx}`]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sequential Process Steps Flowchart */}
        <CMSRepeater<CbamProcessStep>
          id={`${id}-steps`}
          title="Process Workflow Steps"
          subtitle="The structured horizontal stages demonstrating how verified data moves from installation to declaration."
          items={processSteps}
          onChange={handleProcessStepsChange}
          onAdd={handleAddProcessStep}
          addButtonLabel="Add Process Step"
          minItems={1}
          maxItems={6}
          getItemKey={(item, idx) => item.id || `step-${idx}`}
          getItemNumber={(item, idx) => String(item.order || idx + 1).padStart(2, '0')}
          renderItemSummary={(item, idx) => (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-[#082046] truncate">
                {item.title ? item.title : <span className="text-slate-400 italic">(Empty Step Title)</span>}
              </span>
              <span className="text-[10px] text-[#64748B] font-mono shrink-0">
                Icon: {item.iconKey || 'factory'}
              </span>
            </div>
          )}
          renderItemForm={(item, idx, updateItem) => (
            <div className="space-y-4">
              <CMSField
                label="Step Title"
                value={item.title}
                onChange={(val) => updateItem({ ...item, title: val })}
                required
                maxLength={60}
                placeholder="e.g. Non-EU Producer / Installation"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CMSIconSelect
                  label="Step Icon"
                  value={item.iconKey || 'factory'}
                  onChange={(val) => updateItem({ ...item, iconKey: val })}
                  helperText="Choose the thematic icon representing this workflow milestone."
                />

                <CMSField
                  label="Display Order"
                  type="number"
                  value={String(item.order || idx + 1)}
                  onChange={(val) => updateItem({ ...item, order: parseInt(val, 10) || idx + 1 })}
                  description="Determines sequential position in the visual pipeline."
                />
              </div>
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
