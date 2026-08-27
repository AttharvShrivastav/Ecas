import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarBlank, Clock, Sparkle } from '@phosphor-icons/react';
import type { NewsArticle } from '../../cms/types';

export interface NewsFeaturedCardProps {
  article: NewsArticle;
}

/**
 * NewsFeaturedCard Component
 *
 * Prominent featured article presentation for the News & Insights hub:
 * - Clear editorial hierarchy with category badge, reading time, and date
 * - Restrained ECASEURO card container with soft gradient hover effect
 * - Accessible keyboard navigation and semantic link
 */
export const NewsFeaturedCard: React.FC<NewsFeaturedCardProps> = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-2xs transition-all duration-300 overflow-hidden group"
    >
      {/* Subtle Hover Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#F2F5FB] to-[#DCDEFA] transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Header Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">

            {/* Category Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F4F7FD] text-[#082046] border border-slate-200/60">
              {article.category}
            </span>

            {/* Date & Read Time */}
            <div className="flex items-center gap-3 text-xs text-[#64748B] ml-auto">
              <span className="inline-flex items-center gap-1">
                <CalendarBlank size={14} />
                {article.formattedDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#082046] tracking-[-0.02em] leading-snug group-hover:text-[#0B1642] transition-colors">
            <Link
              to={`/news/${article.slug}`}
              className="focus:outline-none focus-visible:underline"
            >
              {article.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-[#475569] leading-relaxed font-normal max-w-4xl">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Area: Author & CTA */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {article.author ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#082046] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {article.author.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-[#082046] leading-tight">
                  {article.author.name}
                </span>
                <span className="text-[11px] sm:text-xs text-[#64748B]">
                  {article.author.role}
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}

          <Link
            to={`/news/${article.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#082046] group-hover:text-[#00607A] transition-colors self-start sm:self-auto"
          >
            <span>Read full article</span>
            <ArrowRight
              size={16}
              weight="bold"
              className="transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
