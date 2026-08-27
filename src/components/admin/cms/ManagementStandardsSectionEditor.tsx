import React, { useState } from 'react';
import { Certificate, Plus, Trash, X, ListChecks } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import type {
  ManagementStandardsSectionContent,
  ManagementStandard,
} from '../../../cms/types';

export interface ManagementStandardsSectionEditorProps {
  id?: string;
  content: ManagementStandardsSectionContent;
  onChange: (updated: ManagementStandardsSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const ManagementStandardsSectionEditor: React.FC<ManagementStandardsSectionEditorProps> = ({
  id = 'section-standards',
  content,
  onChange,
  errors = {},
  errorPrefix = 'standardsSection',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const searchPlaceholder = content.searchPlaceholder || '';
  const noResultsText = content.noResultsText || '';
  const standards = content.standards || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleSearchPlaceholderChange = (value: string) => {
    onChange({ ...content, searchPlaceholder: value });
  };

  const handleNoResultsTextChange = (value: string) => {
    onChange({ ...content, noResultsText: value });
  };

  const handleStandardsChange = (updatedStandards: ManagementStandard[]) => {
    // Re-index standard numbers cleanly
    const reindexed = updatedStandards.map((std, idx) => ({
      ...std,
      number: std.number?.trim() ? std.number : String(idx + 1).padStart(2, '0'),
    }));
    onChange({ ...content, standards: reindexed });
  };

  const handleAddStandard = (): ManagementStandard => {
    const nextNum = String(standards.length + 1).padStart(2, '0');
    return {
      id: `iso-${Date.now()}`,
      slug: `iso-${Date.now()}`,
      number: nextNum,
      title: 'ISO Standard Title',
      shortDescription: 'Executive summary of the management system standard.',
      keywords: ['ISO', 'Management System'],
      modal: {
        overview: 'Comprehensive background and framework requirements for this ISO standard.',
        applicability: 'Target industry sectors and organizational scopes suitable for certification.',
        focusAreas: ['Core Requirement 1', 'Core Requirement 2', 'Risk Assessment'],
      },
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="ISO Standards Registry"
      subtitle="The 3-column card grid and route-backed detail modal content across all accredited management systems"
      icon={Certificate}
      badge="3-Col Grid & Modals"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Intro & Search Bar Setup */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CMSField
            id={`${id}-search-placeholder`}
            label="Live Search Placeholder"
            value={searchPlaceholder}
            onChange={handleSearchPlaceholderChange}
            placeholder="Search Courses or Standards..."
          />
          <CMSField
            id={`${id}-no-results`}
            label="No Search Results Text"
            value={noResultsText}
            onChange={handleNoResultsTextChange}
            placeholder="No matching ISO standards found."
          />
        </div>

        {/* Standards Repeater */}
        <CMSRepeater<ManagementStandard>
          id={`${id}-standards-repeater`}
          title="Management System Standards"
          subtitle="Add, edit, reorder or remove ISO standards and their detailed modal profiles"
          items={standards}
          onChange={handleStandardsChange}
          onAdd={handleAddStandard}
          addButtonLabel="Add ISO Standard"
          minItems={1}
          getItemKey={(std, idx) => std.id || std.slug || `std-${idx}`}
          renderItemSummary={(std, idx) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#082046] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {std.number || String(idx + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#082046] truncate">
                  {std.title || `Standard #${idx + 1}`}
                </div>
                <p className="text-xs text-[#64748B] truncate">
                  Slug: /{std.slug} • {(std.modal?.focusAreas?.length || 0)} focus areas
                </p>
              </div>
            </div>
          )}
          renderItemForm={(std, index, updateStd) => {
            const stdErrorKey = `${errorPrefix}.standards.${index}`;
            const [newKeywordInput, setNewKeywordInput] = useState('');
            const [newFocusAreaInput, setNewFocusAreaInput] = useState('');

            const handleAddKeyword = () => {
              const trimmed = newKeywordInput.trim();
              if (trimmed && !std.keywords?.includes(trimmed)) {
                updateStd({
                  ...std,
                  keywords: [...(std.keywords || []), trimmed],
                });
                setNewKeywordInput('');
              }
            };

            const handleRemoveKeyword = (kw: string) => {
              updateStd({
                ...std,
                keywords: (std.keywords || []).filter((k) => k !== kw),
              });
            };

            const handleAddFocusArea = () => {
              const trimmed = newFocusAreaInput.trim();
              if (trimmed) {
                const currentFocus = std.modal?.focusAreas || [];
                updateStd({
                  ...std,
                  modal: {
                    ...(std.modal || { overview: '', applicability: '' }),
                    focusAreas: [...currentFocus, trimmed],
                  },
                });
                setNewFocusAreaInput('');
              }
            };

            const handleRemoveFocusArea = (fIdx: number) => {
              const currentFocus = std.modal?.focusAreas || [];
              updateStd({
                ...std,
                modal: {
                  ...(std.modal || { overview: '', applicability: '' }),
                  focusAreas: currentFocus.filter((_, i) => i !== fIdx),
                },
              });
            };

            return (
              <div className="space-y-6 pt-2">
                {/* Standard Card Basics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CMSField
                    id={`std-${index}-number`}
                    label="Index Number"
                    value={std.number}
                    onChange={(val) => updateStd({ ...std, number: val })}
                    required
                    maxLength={10}
                    placeholder="01"
                  />
                  <CMSField
                    id={`std-${index}-title`}
                    label="Standard Title"
                    value={std.title}
                    onChange={(val) => updateStd({ ...std, title: val })}
                    required
                    maxLength={100}
                    error={errors[`${stdErrorKey}.title`]}
                  />
                  <CMSField
                    id={`std-${index}-slug`}
                    label="URL Slug"
                    value={std.slug}
                    onChange={(val) =>
                      updateStd({
                        ...std,
                        slug: val.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    required
                    description="Used in modal deep links"
                    error={errors[`${stdErrorKey}.slug`]}
                  />
                </div>

                <CMSTextarea
                  id={`std-${index}-shortDesc`}
                  label="Card Summary Description"
                  value={std.shortDescription}
                  onChange={(val) => updateStd({ ...std, shortDescription: val })}
                  rows={2}
                  required
                  maxLength={250}
                  description="Displays on the public 3-column card front."
                  error={errors[`${stdErrorKey}.shortDescription`]}
                />

                {/* Search Keywords Tags */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                    Search Keywords / Synonyms
                  </label>
                  <p className="text-xs text-[#64748B]">
                    Indexed by the public frontend search filter for fast matching.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[36px] p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg">
                    {(std.keywords || []).map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-white border border-[#CBD5E1] text-[#082046] rounded-md shadow-2xs"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="hover:text-[#B42318] transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="Add keyword + Enter..."
                        className="flex-1 px-2 py-1 text-xs bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-2 py-0.5 text-xs font-bold text-[#00607A] hover:bg-white rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Route-Backed Detail Modal Content */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-4">
                  <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider flex items-center gap-1.5">
                    <ListChecks size={16} />
                    Detail Modal Content (/services/management-system-certification/{std.slug})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CMSTextarea
                      id={`std-${index}-overview`}
                      label="Standard Overview"
                      value={std.modal?.overview || ''}
                      onChange={(val) =>
                        updateStd({
                          ...std,
                          modal: { ...(std.modal || { focusAreas: [] }), overview: val },
                        })
                      }
                      rows={3}
                      maxLength={400}
                    />
                    <CMSTextarea
                      id={`std-${index}-applicability`}
                      label="Industry Applicability"
                      value={std.modal?.applicability || ''}
                      onChange={(val) =>
                        updateStd({
                          ...std,
                          modal: { ...(std.modal || { focusAreas: [] }), applicability: val },
                        })
                      }
                      rows={3}
                      maxLength={400}
                    />
                  </div>

                  {/* Key Focus Areas List */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                      Key Focus Areas (Bullet Points)
                    </label>
                    <div className="space-y-2">
                      {(std.modal?.focusAreas || []).map((area, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#082046] shrink-0" />
                          <input
                            type="text"
                            value={area}
                            onChange={(e) => {
                              const nextAreas = [...(std.modal?.focusAreas || [])];
                              nextAreas[aIdx] = e.target.value;
                              updateStd({
                                ...std,
                                modal: { ...(std.modal || { overview: '' }), focusAreas: nextAreas },
                              });
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082046]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFocusArea(aIdx)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded transition-colors"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newFocusAreaInput}
                        onChange={(e) => setNewFocusAreaInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFocusArea();
                          }
                        }}
                        placeholder="Add new focus area bullet point..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082046]"
                      />
                      <button
                        type="button"
                        onClick={handleAddFocusArea}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#082046] hover:bg-[#00607A] rounded-lg transition-colors"
                      >
                        <Plus size={14} weight="bold" />
                        <span>Add Bullet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </CMSSectionCard>
  );
};
