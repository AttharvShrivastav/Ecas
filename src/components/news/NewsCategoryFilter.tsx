import React from 'react';
import type { NewsCategory } from '../../cms/types';

export interface NewsCategoryFilterProps {
  categories: NewsCategory[];
  activeCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
}

/**
 * NewsCategoryFilter Component
 *
 * Restrained, accessible horizontal pill filter adhering to ECASEURO design system:
 * - Active: Deep navy (#082046) background with white text
 * - Inactive: Light neutral surface (#FFFFFF) with subtle border (#E2E8F0) and slate text (#475569)
 * - Single line scroll on mobile with hidden scrollbars
 * - Focus rings for keyboard navigation
 */
export const NewsCategoryFilter: React.FC<NewsCategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Filter news articles by category"
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth w-full"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer focus-ring shrink-0 ${
              isActive
                ? 'bg-[#082046] text-white shadow-xs'
                : 'bg-white border border-slate-200/90 text-[#475569] hover:bg-[#F4F7FD] hover:text-[#082046] hover:border-slate-300'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
