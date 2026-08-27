import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, WarningCircle } from '@phosphor-icons/react';
import { Navbar } from '../components/common/Navbar';
import { NewsArticleHeader } from '../components/news/NewsArticleHeader';
import { NewsArticleBody } from '../components/news/NewsArticleBody';
import { NewsRelatedArticles } from '../components/news/NewsRelatedArticles';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getNewsArticleBySlug, getAllNewsArticles } from '../cms/queries';
import { sampleNewsArticles } from '../cms/newsContent';
import type { ConsultingCTAContent, NewsArticle } from '../cms/types';

const defaultArticleCTA: ConsultingCTAContent = {
  heading: 'Need advice on this standard or regulation?',
  description:
    'Our conformity assessment auditors and verification specialists are available to discuss specific project requirements.',
  buttonLabel: 'REQUEST TECHNICAL CONSULTATION',
  buttonHref: '/contact?service=general-inquiry',
};

/**
 * News Article Detail Page (/news/:slug)
 *
 * Dedicated editorial view for in-depth technical analysis:
 * - Direct URL routing & crawlable structure
 * - Connected to CMS API with instant static fallback
 * - SEO meta and title injection
 * - Structured content blocks rendering
 * - Contextual related articles recommendation
 * - Reusable ConsultingCTA & Footer with Globe
 */
export const NewsArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Instant fallback initialization
  const fallbackArticle = sampleNewsArticles.find((a) => a.slug === slug) || null;
  const [article, setArticle] = useState<NewsArticle | null>(fallbackArticle);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>(sampleNewsArticles);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    // Fetch live article and all articles for related recommendations
    getNewsArticleBySlug(slug)
      .then((fetched) => {
        if (isMounted && fetched) {
          setArticle(fetched);
        }
      })
      .catch((err) => {
        console.warn(`[NewsDetail] Failed to load live article "${slug}":`, err);
      });

    getAllNewsArticles()
      .then((articles) => {
        if (isMounted && articles.length > 0) {
          setAllArticles(articles);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // SEO document title & scroll reset on slug change
  useEffect(() => {
    if (article) {
      document.title = article.seo.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && article.seo.description) {
        metaDescription.setAttribute('content', article.seo.description);
      }
    } else {
      document.title = 'Article Not Found | ECASEURO';
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [article, slug]);

  if (!article) {
    return (
      <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col justify-between">
        {/* 1. Global Navbar */}
        <div className="w-full pt-3 sm:pt-4">
          <Navbar />
        </div>

        <div className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-xl mx-auto border border-slate-200/80 shadow-2xs">
            <WarningCircle size={48} weight="duotone" className="text-[#082046] mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-[#082046] mb-3">
              Article Not Found
            </h1>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              The article you are looking for does not exist or may have been moved.
            </p>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#082046] text-white text-sm font-semibold hover:bg-[#0B1642] transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Return to News & Insights</span>
            </Link>
          </div>
        </div>

        <div className="w-full">
          <ConsultingCTA content={defaultArticleCTA} />
          <Footer withGlobe={true} />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Global Navbar */}
      <div className="w-full pt-3 sm:pt-4">
        <Navbar />
      </div>

      {/* 2. Article Content Wrapper */}
      <div className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-6 sm:py-8 flex-grow">
        {/* Main Article Inset Container */}
        <article className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-10 lg:p-14 border border-slate-200/80 shadow-2xs">
          {/* Header */}
          <NewsArticleHeader article={article} />

          {/* Structured Content Body */}
          <NewsArticleBody content={article.content} tags={article.tags} />

          {/* Related Articles Section */}
          <NewsRelatedArticles
            currentArticleId={article.id}
            category={article.category}
            articles={allArticles}
          />
        </article>
      </div>

      {/* 3. Reusable Closing Sequence */}
      <div className="w-full">
        <ConsultingCTA content={defaultArticleCTA} />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

