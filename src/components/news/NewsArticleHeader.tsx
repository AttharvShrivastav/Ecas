import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarBlank, Clock, UserCircle, Tag } from '@phosphor-icons/react';
import type { NewsArticle } from '../../cms/types';

export interface NewsArticleHeaderProps {
  article: NewsArticle;
}

/**
 * NewsArticleHeader Component
 *
 * Semantic article header with back navigation, categorization, metadata, and author details.
 */
export const NewsArticleHeader: React.FC<NewsArticleHeaderProps> = ({ article }) => {
  return (
    <header className="mb-8 sm:mb-12">
      {/* Back Navigation & Breadcrumb */}
      <div className="mb-6 sm:mb-8">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#082046] transition-colors group focus-ring rounded-md py-1"
        >
          <ArrowLeft
            size={16}
            weight="bold"
            className="transform group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span>Back to News & Insights</span>
        </Link>
      </div>

      {/* Category, Date & Read Time */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#082046] text-white">
          <Tag size={13} weight="fill" />
          {article.category}
        </span>
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#64748B]">
          <CalendarBlank size={14} />
          {article.formattedDate}
        </span>
        <span className="text-[#CBD5E1] hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#64748B]">
          <Clock size={14} />
          {article.readTime}
        </span>
      </div>

      {/* Main Article Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#082046] tracking-[-0.02em] leading-[1.2] max-w-5xl xl:max-w-6xl">
        {article.title}
      </h1>

      {/* Lead Excerpt */}
      {article.excerpt && (
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#475569] leading-relaxed font-normal max-w-4xl lg:max-w-5xl xl:max-w-6xl border-l-2 border-[#082046]/30 pl-4 py-1">
          {article.excerpt}
        </p>
      )}

      {/* Author & Organization Strip */}
      {article.author && (
        <div className="mt-6 sm:mt-8 pt-5 border-t border-slate-200/80 flex items-center gap-3.5 max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <div className="w-10 h-10 rounded-full bg-[#082046] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {article.author.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#082046]">
              {article.author.name}
            </div>
            <div className="text-xs text-[#64748B]">
              {article.author.role}
              {article.author.organization && ` • ${article.author.organization}`}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
