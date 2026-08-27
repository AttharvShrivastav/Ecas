import React from 'react';
import { Question } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { HomeFAQContent, FAQItem } from '../../../cms/types';

export interface CMSFAQEditorProps {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  defaultCategory?: string;
  content: HomeFAQContent;
  onChange: (updated: HomeFAQContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const CMSFAQEditor: React.FC<CMSFAQEditorProps> = ({
  id = 'section-faq',
  title = 'Frequently Asked Questions',
  subtitle = 'Public accordion items addressing common client questions',
  badge = 'Accordion',
  defaultCategory = 'General',
  content,
  onChange,
  errors = {},
  errorPrefix = 'faq',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const items = content.items ?? [];

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleItemsChange = (newItems: FAQItem[]) => {
    // Re-index item numbers cleanly when order/count changes
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      number: item.number?.trim() ? item.number : String(idx + 1).padStart(2, '0'),
    }));
    onChange({
      ...content,
      items: reindexed,
    });
  };

  const handleAddFaqItem = (): FAQItem => {
    const nextNumber = String(items.length + 1).padStart(2, '0');
    return {
      id: `faq-${Date.now()}`,
      number: nextNumber,
      question: '',
      answer: '',
      category: defaultCategory,
    };
  };

  const headingErrorKey = `${errorPrefix}.heading`;
  const itemsErrorKey = `${errorPrefix}.items`;

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title={title}
      subtitle={subtitle}
      icon={Question}
      badge={badge}
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Header Controls */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-heading`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
              >
                Section Heading <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={heading.length} max={100} />
            </div>
            <input
              id={`${id}-heading`}
              type="text"
              value={heading}
              maxLength={100}
              onChange={handleHeadingChange}
              placeholder="e.g. Commonly Asked Questions"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors[headingErrorKey]
                  ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                  : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
              }`}
            />
            {errors[headingErrorKey] && (
              <p className="text-xs text-[#B42318] mt-1 font-medium">
                {errors[headingErrorKey]}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-desc`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
              >
                Section Description (Optional)
              </label>
              <CMSCharacterCounter current={description.length} max={300} />
            </div>
            <textarea
              id={`${id}-desc`}
              rows={2}
              value={description}
              maxLength={300}
              onChange={handleDescriptionChange}
              placeholder="Enter brief intro narrative for the FAQ section..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 resize-y"
            />
          </div>
        </div>

        {/* FAQ Items Repeater */}
        <CMSRepeater<FAQItem>
          id={`${id}-items`}
          title="FAQ Items"
          subtitle="Questions are displayed as interactive accordions on the public page."
          items={items}
          onChange={handleItemsChange}
          onAdd={handleAddFaqItem}
          addButtonLabel="Add Question"
          minItems={1}
          error={errors[itemsErrorKey]}
          getItemKey={(item, idx) => item.id || `faq-${idx}`}
          getItemNumber={(item, idx) => item.number || String(idx + 1).padStart(2, '0')}
          renderItemSummary={(item) => (
            <div>
              <h4 className="text-sm font-semibold text-[#082046] tracking-tight truncate">
                {item.question ? item.question : <span className="text-slate-400 italic">(Empty Question)</span>}
              </h4>
              <span className="text-[11px] text-[#64748B] line-clamp-1">
                {item.answer ? item.answer.slice(0, 75) + '...' : '(No answer yet)'}
              </span>
            </div>
          )}
          renderItemForm={(item, _idx, updateItem) => (
            <div className="space-y-3">
              {/* Question Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#082046] uppercase">
                    Question <span className="text-[#B42318]">*</span>
                  </label>
                  <CMSCharacterCounter current={(item.question ?? '').length} max={200} />
                </div>
                <input
                  type="text"
                  value={item.question ?? ''}
                  maxLength={200}
                  onChange={(e) => updateItem({ ...item, question: e.target.value })}
                  placeholder="e.g. What is the scope of ESG verification?"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 font-medium"
                />
              </div>

              {/* Answer Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#082046] uppercase">
                    Answer <span className="text-[#B42318]">*</span>
                  </label>
                  <CMSCharacterCounter current={(item.answer ?? '').length} max={1000} />
                </div>
                <textarea
                  rows={4}
                  value={item.answer ?? ''}
                  maxLength={1000}
                  onChange={(e) => updateItem({ ...item, answer: e.target.value })}
                  placeholder="Provide a clear, authoritative answer..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 resize-y"
                />
              </div>

              {/* Metadata Row: Number & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#082046] uppercase mb-1">
                    Index / Number
                  </label>
                  <input
                    type="text"
                    value={item.number ?? ''}
                    maxLength={10}
                    onChange={(e) => updateItem({ ...item, number: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#082046] uppercase mb-1">
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    value={item.category ?? ''}
                    maxLength={40}
                    onChange={(e) => updateItem({ ...item, category: e.target.value })}
                    placeholder="e.g. Assurance, General"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};
