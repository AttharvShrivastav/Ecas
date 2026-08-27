import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Newspaper,
  Plus,
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  ArrowSquareOut,
  Star,
  CheckCircle,
  Clock,
  WarningCircle,
  FileText,
} from '@phosphor-icons/react';
import {
  fetchAdminNewsList,
  deleteAdminNewsArticle,
  type AdminNewsArticleDTO,
} from '../../services/adminCmsService';
import { NEWS_CATEGORIES } from '../../cms/newsContent';

export const AdminNewsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AdminNewsArticleDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Deletion modal state
  const [deletingArticle, setDeletingArticle] = useState<AdminNewsArticleDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load articles
  const loadArticles = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchAdminNewsList();
      setArticles(result.articles);
    } catch (err: any) {
      console.error('[Admin News] Fetch failed:', err);
      setErrorMessage(err.message || 'Failed to load news articles from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        !searchQuery.trim() ||
        art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'All' || art.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || art.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategory, selectedStatus]);

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingArticle) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await deleteAdminNewsArticle(deletingArticle.id);
      setArticles((prev) => prev.filter((a) => a.id !== deletingArticle.id));
      setSuccessMessage(`Article "${deletingArticle.title}" has been deleted.`);
      setDeletingArticle(null);
    } catch (err: any) {
      console.error('[Admin News] Delete failed:', err);
      setErrorMessage(err.message || 'Failed to delete article.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-['DM_Sans'] antialiased">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/admin/certificates" className="hover:text-[#082046] transition-colors">
          Admin Portal
        </Link>
        <span>/</span>
        <span>Content</span>
        <span>/</span>
        <span className="font-semibold text-[#082046]">News & Insights CMS</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <Newspaper size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                News & Insights Articles
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-[#E6F4F8] text-[#00607A] rounded-md border border-[#00607A]/20">
                {articles.length} Total
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Publish regulatory updates, technical articles, CBAM guidance, and corporate announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/news"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <span>View Public News</span>
              <ArrowSquareOut size={14} weight="bold" />
            </a>

            <Link
              to="/admin/news/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-xl transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              <Plus size={15} weight="bold" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>

        {/* Global Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FDA29B] flex items-start gap-2.5 text-xs text-[#B42318]">
            <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5 text-[#D92D20]" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-[#ECFDF3] border border-[#ABEFC6] flex items-start gap-2.5 text-xs text-[#027A48]">
            <CheckCircle size={16} weight="fill" className="shrink-0 mt-0.5 text-[#12B76A]" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="pt-3 border-t border-[#F1F5F9] flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <MagnifyingGlass
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, slug, excerpt, tags..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-colors"
            />
          </div>

          {/* Category & Status Selectors */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Funnel size={14} />
              <span className="font-medium">Filters:</span>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046]"
            >
              {NEWS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStatus('all');
                }}
                className="text-xs text-[#00607A] hover:underline font-semibold cursor-pointer px-1"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#082046] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#082046]">Loading news articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-bold text-[#082046]">No articles found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all'
                ? 'No news articles match your filter criteria. Try clearing search filters.'
                : 'No articles exist in the CMS yet. Click "Create Article" to write your first post.'}
            </p>
            {!searchQuery && selectedCategory === 'All' && selectedStatus === 'all' && (
              <Link
                to="/admin/news/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-xl transition-all shadow-2xs"
              >
                <Plus size={14} weight="bold" />
                <span>Create First Article</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Publish Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {filteredArticles.map((article) => {
                  const isPublished = article.status === 'published';
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-[#F8FAFC]/70 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/admin/news/${article.id}`)}
                    >
                      {/* Article Title & Thumbnail */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-start gap-3">
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt={article.featuredImageAlt || article.title}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#00607A]/10">
                              <Newspaper size={20} />
                            </div>
                          )}

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#082046] text-sm group-hover:text-[#00607A] transition-colors line-clamp-1">
                                {article.title}
                              </span>
                              {article.featured && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF0C7] text-[#B54708] border border-[#FEDF89]">
                                  <Star size={11} weight="fill" /> Featured
                                </span>
                              )}
                            </div>

                            <p className="text-[#64748B] text-[11px] line-clamp-1">
                              {article.excerpt || 'No excerpt summary provided.'}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>slug: /{article.slug}</span>
                              {article.author?.name && (
                                <span>&bull; By {article.author.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#082046] border border-[#E2E8F0]">
                          {article.category}
                        </span>
                      </td>

                      {/* Publish Date & Read Time */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#64748B]">
                        <div className="font-medium text-[#082046]">
                          {article.formattedDate || article.publishedAt}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          <span>{article.readTime || '3 min read'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FDA29B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-4 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Public View Link */}
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-[#082046] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Preview Public Article"
                          >
                            <ArrowSquareOut size={16} />
                          </a>

                          {/* Edit Link */}
                          <Link
                            to={`/admin/news/${article.id}`}
                            className="p-1.5 text-[#00607A] hover:bg-[#E6F4F8] rounded-lg transition-colors font-semibold"
                            title="Edit Article"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </Link>

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => setDeletingArticle(article)}
                            className="p-1.5 text-slate-400 hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-[#B42318]">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3F2] border border-[#FDA29B] flex items-center justify-center shrink-0">
                <Trash size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#082046]">Delete News Article</h3>
                <p className="text-xs text-[#64748B]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-[#082046]">"{deletingArticle.title}"</strong> from the ECAS EURO News CMS?
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-[#D92D20] hover:bg-[#B42318] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
