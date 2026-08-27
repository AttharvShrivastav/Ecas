import React from 'react';
import { Quotes, CheckCircle, Lightbulb } from '@phosphor-icons/react';
import type { NewsContentBlock } from '../../cms/types';

export interface NewsArticleBodyProps {
  content: NewsContentBlock[];
  tags?: string[];
}

/**
 * NewsArticleBody Component
 *
 * Semantic, accessible structured block renderer for editorial articles:
 * - High readability line heights (1.7) and line length constraints
 * - Proper heading hierarchy (H2, H3)
 * - Styled lists, callout quotes, and key takeaway boxes
 * - Tag list at bottom
 */
export const NewsArticleBody: React.FC<NewsArticleBodyProps> = ({
  content,
  tags,
}) => {
  return (
    <div className="article-body w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={index}
                className="text-base sm:text-[17px] text-[#334155] leading-[1.75] mb-6 font-normal"
              >
                {block.text}
              </p>
            );

          case 'heading2':
            return (
              <h2
                key={index}
                className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-[#082046] tracking-[-0.02em] leading-snug mt-10 mb-4 pt-2"
              >
                {block.heading}
              </h2>
            );

          case 'heading3':
            return (
              <h3
                key={index}
                className="text-lg sm:text-xl font-semibold text-[#082046] tracking-[-0.01em] leading-snug mt-8 mb-3"
              >
                {block.heading}
              </h3>
            );

          case 'list':
            return (
              <ul key={index} className="space-y-3 my-6 pl-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#082046] mt-2.5 shrink-0" />
                    <span className="text-sm sm:text-base text-[#334155] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case 'callout':
            return (
              <blockquote
                key={index}
                className="relative my-8 p-6 sm:p-7 rounded-2xl bg-[#F4F7FD] border-l-4 border-[#082046] overflow-hidden"
              >
                <Quotes
                  size={36}
                  weight="fill"
                  className="absolute right-4 top-4 text-[#082046]/10"
                />
                <p className="text-base sm:text-lg text-[#082046] font-medium italic leading-relaxed relative z-10">
                  "{block.quote}"
                </p>
                {block.citation && (
                  <cite className="block not-italic text-xs sm:text-sm text-[#64748B] mt-3 font-semibold">
                    — {block.citation}
                  </cite>
                )}
              </blockquote>
            );

          case 'keyTakeaway':
            return (
              <div
                key={index}
                className="my-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 text-[#082046] font-semibold text-base sm:text-lg mb-4">
                  <Lightbulb size={22} weight="fill" className="text-amber-500 shrink-0" />
                  <span>{block.heading || 'Key Takeaways'}</span>
                </div>
                <ul className="space-y-3">
                  {block.items?.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#334155] leading-relaxed">
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-[#082046] mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* Tags footer if provided */}
      {tags && tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] mr-1">Topics:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F1F5F9] text-[#334155]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
