import React, { useState } from 'react';
import { GraduationCap, Plus, X } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type { TrainingCoursesSectionContent, TrainingCourse } from '../../../cms/types';

export interface TrainingCoursesEditorProps {
  id?: string;
  content: TrainingCoursesSectionContent;
  onChange: (updated: TrainingCoursesSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const TrainingCoursesEditor: React.FC<TrainingCoursesEditorProps> = ({
  id = 'section-courses',
  content,
  onChange,
  errors = {},
  errorPrefix = 'courses',
}) => {
  const heading = content?.heading || '';
  const description = content?.description || '';
  const searchPlaceholder = content?.searchPlaceholder || '';
  const noResultsText = content?.noResultsText || '';
  const courses = content?.courses || [];

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

  const handleSearchPlaceholderChange = (value: string) => {
    onChange({
      ...content,
      searchPlaceholder: value,
    });
  };

  const handleNoResultsTextChange = (value: string) => {
    onChange({
      ...content,
      noResultsText: value,
    });
  };

  const handleCoursesChange = (newCourses: TrainingCourse[]) => {
    onChange({
      ...content,
      courses: newCourses,
    });
  };

  const handleAddCourse = (): TrainingCourse => {
    return {
      id: `course-${Date.now()}`,
      title: '',
      subtitle: '',
      iconKey: 'graduationcap',
      keywords: [],
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Training Courses Directory"
      subtitle="Interactive course catalog with live search filter and standard-specific curriculum tags"
      icon={GraduationCap}
      badge="Course Catalog"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Header Controls */}
        <div className="space-y-4">
          <CMSField
            id={`${id}-heading`}
            label="Directory Heading"
            value={heading}
            onChange={handleHeadingChange}
            required
            maxLength={100}
            placeholder="e.g. Training Courses & Curricula"
            error={errors[`${errorPrefix}.heading`]}
          />

          <CMSTextarea
            id={`${id}-description`}
            label="Directory Introduction"
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            maxLength={300}
            placeholder="Introductory text describing the scope of accredited training modules..."
            error={errors[`${errorPrefix}.description`]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CMSField
              id={`${id}-search-placeholder`}
              label="Search Input Placeholder"
              value={searchPlaceholder}
              onChange={handleSearchPlaceholderChange}
              maxLength={80}
              placeholder="e.g. Search courses by standard, keyword, or topic..."
            />

            <CMSField
              id={`${id}-no-results`}
              label="Empty Search Fallback Message"
              value={noResultsText}
              onChange={handleNoResultsTextChange}
              maxLength={120}
              placeholder="e.g. No courses found matching your query."
            />
          </div>
        </div>

        {/* Courses Repeater */}
        <CMSRepeater<TrainingCourse>
          id={`${id}-items`}
          title="Curriculum Modules"
          subtitle="Accredited courses listed in the searchable directory."
          items={courses}
          onChange={handleCoursesChange}
          onAdd={handleAddCourse}
          addButtonLabel="Add Course"
          minItems={1}
          getItemKey={(item, idx) => item.id || `course-${idx}`}
          getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
          renderItemSummary={(item) => (
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#082046] tracking-tight truncate">
                  {item.title ? item.title : <span className="text-slate-400 italic">(Empty Course Title)</span>}
                </h4>
                {item.subtitle && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6F4F8] text-[#00607A] font-semibold">
                    {item.subtitle}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] line-clamp-1">
                {item.keywords && item.keywords.length > 0
                  ? `Tags: ${item.keywords.join(', ')}`
                  : 'No search tags'}
              </p>
            </div>
          )}
          renderItemForm={(item, idx, updateItem) => (
            <CourseItemEditor item={item} onUpdate={updateItem} />
          )}
        />
      </div>
    </CMSSectionCard>
  );
};

interface CourseItemEditorProps {
  item: TrainingCourse;
  onUpdate: (updated: TrainingCourse) => void;
}

const CourseItemEditor: React.FC<CourseItemEditorProps> = ({ item, onUpdate }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const keywords = item.keywords || [];

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const splitWords = newKeyword
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !keywords.includes(w));

    if (splitWords.length > 0) {
      onUpdate({
        ...item,
        keywords: [...keywords, ...splitWords],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = keywords.filter((_, i) => i !== index);
    onUpdate({
      ...item,
      keywords: updated,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <CMSField
            label="Course Title"
            value={item.title}
            onChange={(val) => onUpdate({ ...item, title: val })}
            required
            maxLength={100}
            placeholder="e.g. ISO 9001:2015 Lead Auditor Course"
          />
        </div>
        <div>
          <CMSField
            label="Code / Standard Subtitle"
            value={item.subtitle}
            onChange={(val) => onUpdate({ ...item, subtitle: val })}
            maxLength={50}
            placeholder="e.g. Quality Management"
          />
        </div>
      </div>

      <CMSIconSelect
        label="Course Thematic Icon"
        value={item.iconKey || 'graduationcap'}
        onChange={(val) => onUpdate({ ...item, iconKey: val })}
        helperText="Icon badge representing this course topic."
      />

      {/* Keywords / Search Tags */}
      <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
        <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
          Search Keywords & Tags ({keywords.length})
        </label>
        <p className="text-xs text-[#64748B]">
          These terms match what users type into the real-time search bar.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            placeholder="Type tag (e.g. audit, iso, risk) and press Enter"
            className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            className="px-3 py-1.5 text-xs font-semibold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} weight="bold" />
            <span>Add Tag</span>
          </button>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white text-[#334155] border border-[#CBD5E1] rounded-md shadow-2xs"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(i)}
                  className="text-[#94A3B8] hover:text-[#B42318] focus:outline-none cursor-pointer"
                  aria-label={`Remove tag ${kw}`}
                >
                  <X size={11} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
