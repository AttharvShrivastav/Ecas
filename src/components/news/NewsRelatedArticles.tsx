import React from 'react';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '../../cms/types';

export interface NewsRelatedArticlesProps {
  currentArticleId: string;
  category: string;
  articles: NewsArticle[];
}

/**
 * NewsRelatedArticles Component
 *
 * Renders 2-3 contextual or recent articles at the bottom of the article view.
 */
export const NewsRelatedArticles: React.FC<NewsRelatedArticlesProps> = ({
  currentArticleId,
  category,
  articles,
}) => {
  // Filter out current article and prioritize same category
  const otherArticles = articles.filter((a) => a.id !== currentArticleId);
  const sameCategory = otherArticles.filter((a) => a.category === category);
  const differentCategory = otherArticles.filter((a) => a.category !== category);

  const related = [...sameCategory, ...differentCategory].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-articles-heading" className="mt-16 sm:mt-20 pt-12 border-t border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            id="related-articles-heading"
            className="text-xl sm:text-2xl font-semibold text-[#082046] tracking-[-0.02em]"
          >
            Related Updates & Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Explore more analyses across European standards, regulation, and verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};
