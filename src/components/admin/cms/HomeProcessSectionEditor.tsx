import React from 'react';
import { Steps } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { HomeCertificationProcessContent, ProcessStep } from '../../../cms/types';

export interface HomeProcessSectionEditorProps {
  id?: string;
  content: HomeCertificationProcessContent;
  onChange: (updated: HomeCertificationProcessContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeProcessSectionEditor: React.FC<HomeProcessSectionEditorProps> = ({
  id = 'section-home-process',
  content,
  onChange,
  errors = {},
  errorPrefix = 'process',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const steps = content.steps || [];

  const handleHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      heading: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      description: e.target.value,
    });
  };

  const handleStepsChange = (newSteps: ProcessStep[]) => {
    // Automatically keep step numbering tidy
    const reindexed = newSteps.map((step, idx) => ({
      ...step,
      number: step.number?.trim() ? step.number : String(idx + 1).padStart(2, '0'),
    }));
    onChange({
      ...content,
      steps: reindexed,
    });
  };

  const handleAddStep = (): ProcessStep => {
    const nextNum = String(steps.length + 1).padStart(2, '0');
    return {
      number: nextNum,
      title: `Step ${steps.length + 1}`,
      description: 'Describe the requirements and actions for this certification milestone.',
    };
  };

  const headingError = errors[`${errorPrefix}.heading`];
  const descError = errors[`${errorPrefix}.description`];
  const stepsError = errors[`${errorPrefix}.steps`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Certification Process Section"
      subtitle="Homepage 5-step milestone process path explaining client audit & certification stages"
      icon={Steps}
      badge="Workflow"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Header Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          {/* Heading */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-heading`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Section Heading <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={heading.length} max={100} />
            </div>
            <p className="text-xs text-[#64748B] mb-1.5">
              Use a line break to match the editorial layout.
            </p>
            <textarea
              id={`${id}-heading`}
              rows={2}
              value={heading}
              onChange={handleHeadingChange}
              placeholder="A clear path from&#10;Enquiry to Certification"
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                headingError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {headingError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{headingError}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-description`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Supporting Description <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={description.length} max={300} />
            </div>
            <textarea
              id={`${id}-description`}
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="We keep every stage structured and transparent..."
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                descError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {descError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{descError}</p>
            )}
          </div>
        </div>

        {/* Steps Repeater */}
        <div>
          {stepsError && (
            <div className="p-3 mb-3 text-xs font-semibold text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg">
              {stepsError}
            </div>
          )}

          <CMSRepeater<ProcessStep>
            id="process-steps-repeater"
            title="Process Stage Milestones"
            subtitle="Configure sequential steps rendered inside the right-hand gradient container."
            items={steps}
            onChange={handleStepsChange}
            onAdd={handleAddStep}
            addButtonLabel="Add Process Step"
            minItems={1}
            maxItems={10}
            getItemKey={(item, idx) => `step-${item.number || idx}`}
            getItemNumber={(item, idx) => item.number || String(idx + 1).padStart(2, '0')}
            renderItemSummary={(item) => (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-[#082046] truncate">{item.title}</span>
                <span className="text-xs text-[#64748B] truncate max-w-[300px]">
                  {item.description}
                </span>
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => {
              const stepTitleError = errors[`${errorPrefix}.steps.${idx}.title`];
              const stepDescError = errors[`${errorPrefix}.steps.${idx}.description`];

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                        Step Number
                      </label>
                      <input
                        type="text"
                        value={item.number}
                        onChange={(e) => updateItem({ ...item, number: e.target.value })}
                        placeholder="01"
                        maxLength={4}
                        className="w-full px-3 py-2 text-sm font-mono font-bold rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                          Step Title <span className="text-[#B42318]">*</span>
                        </label>
                        <CMSCharacterCounter current={item.title.length} max={60} />
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem({ ...item, title: e.target.value })}
                        placeholder="e.g. Enquiry and Scope"
                        className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                          stepTitleError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                        } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                      />
                      {stepTitleError && (
                        <p className="mt-1 text-xs font-semibold text-[#B42318]">{stepTitleError}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                        Step Description <span className="text-[#B42318]">*</span>
                      </label>
                      <CMSCharacterCounter current={item.description.length} max={250} />
                    </div>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateItem({ ...item, description: e.target.value })}
                      placeholder="Share your organisation’s details, required standard..."
                      className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                        stepDescError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                      } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                    />
                    {stepDescError && (
                      <p className="mt-1 text-xs font-semibold text-[#B42318]">{stepDescError}</p>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};
