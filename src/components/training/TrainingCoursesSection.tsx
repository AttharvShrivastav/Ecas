import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { TrainingIcon } from './TrainingIconMap';
import { defaultTrainingCoursesSectionContent } from '../../cms/trainingContent';
import type { TrainingCoursesSectionContent, TrainingCourse } from '../../cms/types';

export interface TrainingCoursesSectionProps {
  content?: TrainingCoursesSectionContent;
}

/**
 * TrainingCoursesSection Component
 *
 * "Courses based on recognised standards." Section
 *
 * Source of Truth: Approved Figma Desktop Composition & Screenshot
 * - Left Header: Semantic <h2> heading + supporting descriptive copy
 * - Right Header: In-memory frontend search input with MagnifyingGlass icon
 * - Informational course rows arranged in a clean 2-column layout
 * - Search Highlights:
 *   - Matching rows: Pale lavender/blue surface (#E8EEFC)
 *   - Non-matching rows: Subdued opacity (~40%) while preserving layout
 *   - Empty query: All rows return to clean default surface
 *   - No matches: Gentle feedback label near search input without hiding course list
 * - Informational only (no fake buttons, links, or navigation affordances)
 * - Safe CMS-driven icon mapping via Phosphor Icons
 */
export const TrainingCoursesSection: React.FC<TrainingCoursesSectionProps> = ({
  content = defaultTrainingCoursesSectionContent,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Lightweight 120ms debounce for smooth search response
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 120);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Evaluate matching items based on title, subtitle, and keywords
  const { matchingIds, isSearching, hasNoMatches } = useMemo(() => {
    if (!debouncedQuery) {
      return {
        matchingIds: new Set<string>(),
        isSearching: false,
        hasNoMatches: false,
      };
    }

    const matches = new Set<string>();
    content.courses.forEach((course) => {
      const titleMatch = course.title.toLowerCase().includes(debouncedQuery);
      const subtitleMatch = course.subtitle.toLowerCase().includes(debouncedQuery);
      const keywordMatch = course.keywords?.some((k) =>
        k.toLowerCase().includes(debouncedQuery)
      );

      if (titleMatch || subtitleMatch || keywordMatch) {
        matches.add(course.id);
      }
    });

    return {
      matchingIds: matches,
      isSearching: true,
      hasNoMatches: matches.size === 0,
    };
  }, [debouncedQuery, content.courses]);

  // Split courses for two-column desktop balance matching Figma
  // (Left column 6 items, Right column 5 items)
  const leftColumnCourses = useMemo(
    () => content.courses.slice(0, Math.ceil(content.courses.length / 2)),
    [content.courses]
  );
  const rightColumnCourses = useMemo(
    () => content.courses.slice(Math.ceil(content.courses.length / 2)),
    [content.courses]
  );

  const renderCourseItem = (course: TrainingCourse) => {
    const isMatch = isSearching && matchingIds.has(course.id);
    const isSubdued = isSearching && !matchingIds.has(course.id);

    return (
      <article
        key={course.id}
        role="listitem"
        className={`relative w-full rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-4.5 flex items-center gap-3.5 sm:gap-4 transition-all duration-200 border cursor-default select-none ${
          isMatch
            ? 'bg-[#E8EEFC] border-[#C2D6F6] shadow-xs'
            : isSubdued
            ? 'bg-white/60 border-slate-200/50 opacity-40'
            : 'bg-white border-slate-200/80 hover:bg-[#F4F7FC] hover:border-slate-300/80 shadow-xs'
        }`}
      >
        {/* Left Phosphor Icon Holder */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center transition-colors duration-200 ${
            isMatch ? 'text-[#032E64]' : 'text-[#082046]'
          }`}
          aria-hidden="true"
        >
          <TrainingIcon iconKey={course.iconKey} size={24} weight="regular" />
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0 pr-1">
          <h3 className="text-sm sm:text-base font-semibold text-[#082046] leading-snug tracking-tight truncate">
            {course.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#475569] leading-tight sm:leading-snug mt-0.5 sm:mt-1 truncate">
            {course.subtitle}
          </p>
        </div>
      </article>
    );
  };

  return (
    <section
      id="training-courses"
      aria-labelledby="training-courses-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-12 sm:py-16 lg:py-20"
    >
      {/* Top Header Row with Heading, Description & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start justify-between">
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h2
            id="training-courses-heading"
            className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-normal leading-[1.12] tracking-[-0.02em] text-[#082046] whitespace-pre-line"
          >
            {content.heading}
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed max-w-2xl font-normal">
            {content.description}
          </p>
        </div>

        {/* Right Column: Search Input */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end w-full">
          <div className="relative w-full max-w-md lg:max-w-[340px] xl:max-w-[380px]">
            <label htmlFor="course-search-input" className="sr-only">
              {content.searchPlaceholder}
            </label>
            <input
              id="course-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full bg-white border border-slate-200/90 rounded-lg sm:rounded-xl pl-3.5 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-[#082046] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 focus:border-[#032E64] transition-all shadow-2xs"
            />

            {/* Phosphor MagnifyingGlass / Clear Icon */}
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label="Clear course search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            ) : (
              <div
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              >
                <MagnifyingGlass size={18} />
              </div>
            )}
          </div>

          {/* No results feedback notice without altering layout */}
          {hasNoMatches && (
            <p
              role="status"
              className="text-xs text-slate-500 mt-2 font-normal animate-fade-in"
            >
              {content.noResultsText || 'No matching courses or standards.'}
            </p>
          )}
        </div>
      </div>

      {/* Two-Column Course Grid */}
      <div
        role="list"
        aria-label="Recognised standards courses"
        className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-4.5"
      >
        {/* Left Column Stack */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:gap-4.5">
          {leftColumnCourses.map(renderCourseItem)}
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:gap-4.5">
          {rightColumnCourses.map(renderCourseItem)}
        </div>
      </div>
    </section>
  );
};
