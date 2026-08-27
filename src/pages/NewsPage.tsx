import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { PageHero } from '../components/common/PageHero';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { NewsCategoryFilter } from '../components/news/NewsCategoryFilter';
import { NewsFeaturedCard } from '../components/news/NewsFeaturedCard';
import { NewsCard } from '../components/news/NewsCard';
import { getNewsPageContent } from '../cms/queries';
import { defaultNewsPageContent } from '../cms/newsContent';
import { useCMSPage } from '../cms/useCMS';
import type { NewsCategory, NewsPageContent } from '../cms/types';
import { gsap, prefersReducedMotion } from '../animations/gsap';

export interface NewsPageProps {
  content?: NewsPageContent;
}

/**
 * News & Insights Listing Page (/news)
 *
 * Connected to controlled CMS Query layer fetching published articles from /api/cms/news
 * with instant fallback to default static articles.
 */
export const NewsPage: React.FC<NewsPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getNewsPageContent,
    defaultNewsPageContent,
    initialContent
  );

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');

  const gridSectionRef = useRef<HTMLElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  // SEO document title and scroll reset
  useEffect(() => {
    document.title = content.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && content.seo.description) {
      metaDescription.setAttribute('content', content.seo.description);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') {
      return content.articles;
    }
    return content.articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, content.articles]);

  // Featured article (first featured or first in list if All, or null if filtered category has no featured)
  const featuredArticle = useMemo(() => {
    if (activeCategory === 'All') {
      return content.articles.find((a) => a.featured) || content.articles[0] || null;
    }
    // When filtered, show top article in the category as prominent if available
    return filteredArticles[0] || null;
  }, [activeCategory, content.articles, filteredArticles]);

  // Remaining articles for grid (excluding the featured one if shown above)
  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  // Restrained GSAP entrance motion for cards
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !gridSectionRef.current) return;

    const cards = cardsContainerRef.current?.querySelectorAll('.news-card');
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0 });

      gsap.to(cards, {
        opacity: 1,
        duration: 0.35,
        stagger: 0.08,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: gridSectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridSectionRef);

    return () => ctx.revert();
  }, [gridArticles]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared PageHero */}
      <PageHero
        headingLines={content.hero.headingLines}
        description={content.hero.description}
        ariaLabel="News and insights header"
        heroVariant = "compact"
      />

      {/* 2. Main Content Container */}
      <section
        ref={gridSectionRef}
        aria-label="News and articles feed"
        className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-8 sm:py-12 flex-grow"
      >
        {/* Category Filter Bar */}
        <div className="mb-8 sm:mb-10">
          <NewsCategoryFilter
            categories={content.categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Featured Article Section */}
        {featuredArticle && (
          <div className="mb-8 sm:mb-12">
            <NewsFeaturedCard article={featuredArticle} />
          </div>
        )}

        {/* Article Grid Header / Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#082046] tracking-[-0.01em]">
            {activeCategory === 'All' ? 'Latest Publications' : `${activeCategory} Articles`}
          </h2>
          <span className="text-xs sm:text-sm text-[#64748B]">
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {/* Article Cards Grid */}
        {gridArticles.length > 0 ? (
          <div
            ref={cardsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gridArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : gridArticles.length === 0 && !featuredArticle ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 my-8">
            <h3 className="text-lg font-semibold text-[#082046] mb-2">
              No articles found in this category
            </h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">
              We are regularly publishing new regulatory updates and sector insights. Please select another category.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="px-5 py-2.5 rounded-xl bg-[#082046] text-white text-xs sm:text-sm font-semibold hover:bg-[#0B1642] transition-colors"
            >
              View All Articles
            </button>
          </div>
        ) : null}
      </section>

      {/* 3. Reusable Consulting CTA & Footer with Globe */}
      <div className="w-full">
        <ConsultingCTA content={content.consultingCta} />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};
