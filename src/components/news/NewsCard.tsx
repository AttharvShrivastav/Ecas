import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarBlank, Clock } from '@phosphor-icons/react';
import type { NewsArticle } from '../../cms/types';

export interface NewsCardProps {
  article: NewsArticle;
}

/**
 * NewsCard Component
 *
 * Standard article card for the News & Insights grid:
 * - Category badge with distinct styling
 * - Formatted date and reading time metadata
 * - High-contrast DM Sans typography and excerpt
 * - Smooth hover transition with established soft gradient highlight
 */
export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="news-card relative flex flex-col justify-between h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs transition-all duration-300 overflow-hidden group"
    >
      {/* Subtle Hover Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#F2F5FB] to-[#DCDEFA] transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Category & Date Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F4F7FD] text-[#082046] border border-slate-200/60">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <CalendarBlank size={13} />
              {article.formattedDate}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-[#082046] tracking-[-0.01em] leading-snug group-hover:text-[#0B1642] transition-colors mt-1">
          <Link
            to={`/news/${article.slug}`}
            className="focus:outline-none focus-visible:underline"
          >
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mt-2.5 text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3 font-normal flex-grow">
          {article.excerpt}
        </p>

        {/* Bottom Metadata & Read More */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-[#64748B]">
            <Clock size={13} />
            {article.readTime}
          </span>

          <Link
            to={`/news/${article.slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-[#082046] group-hover:text-[#00607A] transition-colors"
            aria-label={`Read full article: ${article.title}`}
          >
            <span>Read article</span>
            <ArrowRight
              size={14}
              weight="bold"
              className="transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};
