import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Newspaper,
  FloppyDisk,
  ArrowLeft,
  ArrowSquareOut,
  Trash,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle,
  WarningCircle,
  TextHTwo,
  TextHThree,
  ListBullets,
  Quotes,
  Lightbulb,
  TextAlignLeft,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Check,
} from '@phosphor-icons/react';
import { CMSSectionCard } from '../../components/admin/cms/CMSSectionCard';
import { CMSField } from '../../components/admin/cms/CMSField';
import { CMSTextarea } from '../../components/admin/cms/CMSTextarea';
import { CMSImageField } from '../../components/admin/cms/CMSImageField';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import {
  fetchAdminNewsArticle,
  createAdminNewsArticle,
  updateAdminNewsArticle,
  deleteAdminNewsArticle,
  type AdminNewsArticleDTO,
} from '../../services/adminCmsService';
import { NEWS_CATEGORIES } from '../../cms/newsContent';
import type { NewsCategory, NewsContentBlock, ImageAsset, SEOData } from '../../cms/types';

const SELECTABLE_CATEGORIES: NewsCategory[] = NEWS_CATEGORIES.filter(
  (c): c is NewsCategory => c !== 'All'
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export const AdminNewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const todayIso = new Date().toISOString().split('T')[0];

  const defaultArticleState: Partial<AdminNewsArticleDTO> = {
    title: '',
    slug: '',
    category: 'Regulatory Updates',
    publishedAt: todayIso,
    formattedDate: formatDate(todayIso),
    readTime: '4 min read',
    featured: false,
    featuredImage: '',
    featuredImageAlt: '',
    author: {
      name: 'ECAS EURO Technical Directorate',
      role: 'Regulatory & Compliance Team',
      organization: 'ECAS EURO',
      avatar: null,
    },
    excerpt: '',
    content: [
      {
        type: 'paragraph',
        text: '',
      },
    ],
    tags: ['Standards', 'Compliance'],
    seo: {
      title: '',
      description: '',
    },
    status: 'draft',
  };

  const [formState, setFormState] = useState<Partial<AdminNewsArticleDTO>>(defaultArticleState);
  const [initialState, setInitialState] = useState<Partial<AdminNewsArticleDTO>>(defaultArticleState);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(!isNew);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load article if editing
  useEffect(() => {
    if (!isNew && id) {
      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        setErrorMessage('Invalid article ID');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      fetchAdminNewsArticle(numId)
        .then((art) => {
          setFormState(art);
          setInitialState(art);
          setIsSlugManuallyEdited(true);
        })
        .catch((err) => {
          console.error('[Admin News Editor] Load failed:', err);
          setErrorMessage(err.message || 'Failed to load article from server.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isNew]);

  // Auto-generate slug when title changes (unless manually edited)
  const handleTitleChange = (val: string) => {
    const patch: Partial<AdminNewsArticleDTO> = { title: val };
    if (!isSlugManuallyEdited) {
      patch.slug = slugify(val);
    }
    setFormState((prev) => ({ ...prev, ...patch }));
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(initialState) !== JSON.stringify(formState);
  }, [initialState, formState]);

  // Validation
  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errs: Record<string, string> = {};

    if (!formState.title?.trim()) {
      errs['title'] = 'Article title is required.';
    }
    if (!formState.slug?.trim()) {
      errs['slug'] = 'Article URL slug is required.';
    }
    if (!formState.category?.trim()) {
      errs['category'] = 'Please select a category.';
    }
    if (!formState.publishedAt) {
      errs['publishedAt'] = 'Published date is required.';
    }
    if (!formState.excerpt?.trim()) {
      errs['excerpt'] = 'Excerpt summary is required.';
    }

    if (!formState.content || formState.content.length === 0) {
      errs['content'] = 'At least one content block is required.';
    } else {
      formState.content.forEach((block, idx) => {
        if (block.type === 'paragraph' && !block.text?.trim()) {
          errs[`content.${idx}.text`] = 'Paragraph text cannot be empty.';
        }
        if ((block.type === 'heading2' || block.type === 'heading3') && !block.heading?.trim()) {
          errs[`content.${idx}.heading`] = 'Section heading cannot be empty.';
        }
        if (block.type === 'callout' && !block.quote?.trim()) {
          errs[`content.${idx}.quote`] = 'Quote text cannot be empty.';
        }
        if (block.type === 'keyTakeaway' && !block.text?.trim()) {
          errs[`content.${idx}.text`] = 'Key takeaway text cannot be empty.';
        }
      });
    }

    return {
      isValid: Object.keys(errs).length === 0,
      errors: errs,
    };
  };

  // Handle Save (Create or Update)
  const handleSave = async (forceStatus?: 'published' | 'draft') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const targetStatus = forceStatus || formState.status || 'draft';
    const payload = {
      ...formState,
      status: targetStatus,
      formattedDate: formState.publishedAt ? formatDate(formState.publishedAt) : formState.formattedDate,
    };

    const { isValid, errors } = validateForm();
    if (!isValid) {
      setValidationErrors(errors);
      setErrorMessage(
        `Validation failed with ${Object.keys(errors).length} issue(s). Please review marked fields.`
      );
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(firstKey) || document.querySelector(`[id*="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        const created = await createAdminNewsArticle(payload);
        setSuccessMessage('News article created successfully.');
        setValidationErrors({});
        setTimeout(() => {
          navigate(`/admin/news/${created.id}`);
        }, 800);
      } else {
        const updated = await updateAdminNewsArticle(Number(id), payload);
        setFormState(updated);
        setInitialState(updated);
        setSuccessMessage(
          targetStatus === 'published'
            ? 'Article published and synchronized to live website.'
            : 'Draft saved successfully.'
        );
        setValidationErrors({});
      }
    } catch (err: any) {
      console.error('[Admin News Editor] Save failed:', err);
      setErrorMessage(err.message || 'Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (isNew || !id) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteAdminNewsArticle(Number(id));
      navigate('/admin/news');
    } catch (err: any) {
      console.error('[Admin News Editor] Delete failed:', err);
      setErrorMessage(err.message || 'Failed to delete article.');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Content Block Handlers
  const handleAddBlock = (type: NewsContentBlock['type']) => {
    const newBlock: NewsContentBlock = {
      type,
      text: type === 'paragraph' || type === 'keyTakeaway' ? '' : undefined,
      heading: type === 'heading2' || type === 'heading3' ? '' : undefined,
      items: type === 'list' ? [''] : undefined,
      quote: type === 'callout' ? '' : undefined,
      citation: type === 'callout' ? '' : undefined,
    };

    setFormState((prev) => ({
      ...prev,
      content: [...(prev.content || []), newBlock],
    }));
  };

  const handleUpdateBlock = (index: number, updatedBlock: NewsContentBlock) => {
    const updatedContent = [...(formState.content || [])];
    updatedContent[index] = updatedBlock;
    setFormState((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleRemoveBlock = (index: number) => {
    const updatedContent = (formState.content || []).filter((_, i) => i !== index);
    setFormState((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const content = [...(formState.content || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= content.length) return;
    const [moved] = content.splice(index, 1);
    content.splice(target, 0, moved);
    setFormState((prev) => ({ ...prev, content }));
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#082046] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#082046]">Loading article details...</p>
      </div>
    );
  }

  const isPublished = formState.status === 'published';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 font-['DM_Sans'] antialiased">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <Link to="/admin/news" className="hover:text-[#082046] transition-colors flex items-center gap-1">
            <ArrowLeft size={13} weight="bold" />
            <span>News & Insights</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#082046]">
            {isNew ? 'Create Article' : formState.title || 'Edit Article'}
          </span>
        </div>

        {!isNew && formState.slug && (
          <a
            href={`/news/${formState.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#00607A] hover:underline font-semibold"
          >
            <span>Preview Public View</span>
            <ArrowSquareOut size={13} weight="bold" />
          </a>
        )}
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <Newspaper size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                {isNew ? 'Create New Article' : 'Edit News Article'}
              </h1>

              {isPublished ? (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#ECFDF3] text-[#027A48] rounded-md border border-[#ABEFC6]">
                  Published
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FEF3F2] text-[#B42318] rounded-md border border-[#FDA29B]">
                  Draft
                </span>
              )}

              {isDirty && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#FEF0C7] text-[#B54708] rounded-md border border-[#FEDF89] animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>

            <p className="text-xs text-[#64748B]">
              {isNew
                ? 'Fill out required fields and publish to the live ECAS EURO public news portal.'
                : `Article #${id} &bull; ${formState.formattedDate || 'Unpublished'}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link
              to="/admin/news"
              className="px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all"
            >
              Cancel
            </Link>

            {!isNew && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-slate-400 hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-xl transition-colors border border-transparent hover:border-[#FDA29B] cursor-pointer"
                title="Delete Article"
              >
                <Trash size={16} />
              </button>
            )}

            {/* Save as Draft */}
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Save Draft
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-xl transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={15} weight="bold" />
                  <span>{isPublished ? 'Save Changes' : 'Publish Article'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Error/Success Message */}
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
      </div>

      {/* 1. Article Core Metadata */}
      <CMSSectionCard
        id="section-core"
        title="Article Essentials"
        subtitle="Title, custom slug, category, published date, and read time"
        icon={Newspaper}
        badge="Core"
      >
        <div className="space-y-4">
          <CMSField
            id="title"
            label="Article Title"
            value={formState.title || ''}
            onChange={handleTitleChange}
            placeholder="e.g. EU CBAM Definitive Regime Preparation Guide"
            required={true}
            maxLength={180}
            error={validationErrors['title']}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CMSField
                id="slug"
                label="URL Slug"
                value={formState.slug || ''}
                onChange={(val) => {
                  setIsSlugManuallyEdited(true);
                  setFormState((prev) => ({
                    ...prev,
                    slug: val.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
                  }));
                }}
                placeholder="e.g. eu-cbam-definitive-regime-preparation"
                required={true}
                error={validationErrors['slug']}
                description="Unique identifier for /news/:slug path."
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category-select" className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                Category <span className="text-[#B42318]">*</span>
              </label>
              <select
                id="category-select"
                value={formState.category || 'Regulatory Updates'}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, category: e.target.value as NewsCategory }))
                }
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046]"
              >
                {SELECTABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Published Date */}
            <div>
              <label htmlFor="published-date" className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                Publish Date <span className="text-[#B42318]">*</span>
              </label>
              <input
                id="published-date"
                type="date"
                value={formState.publishedAt || todayIso}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormState((prev) => ({
                    ...prev,
                    publishedAt: val,
                    formattedDate: formatDate(val),
                  }));
                }}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#082046] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046]"
              />
            </div>

            {/* Read Time */}
            <CMSField
              id="readTime"
              label="Estimated Read Time"
              value={formState.readTime || '5 min read'}
              onChange={(val) => setFormState((prev) => ({ ...prev, readTime: val }))}
              placeholder="e.g. 5 min read"
            />

            {/* Featured Article Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                Featured Flag
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({ ...prev, featured: !prev.featured }))
                }
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formState.featured
                    ? 'bg-[#FEF0C7] text-[#B54708] border-[#FEDF89] shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Star size={15} weight={formState.featured ? 'fill' : 'regular'} />
                <span>{formState.featured ? 'Featured on Top' : 'Standard Post'}</span>
              </button>
            </div>
          </div>

          {/* Excerpt Summary */}
          <CMSTextarea
            id="excerpt"
            label="Article Summary / Excerpt"
            value={formState.excerpt || ''}
            onChange={(val) => setFormState((prev) => ({ ...prev, excerpt: val }))}
            placeholder="A compelling 2-sentence summary displayed on card listings and meta previews..."
            required={true}
            maxLength={350}
            rows={3}
            error={validationErrors['excerpt']}
            description="Displayed on the main news cards and RSS/SEO summaries."
          />
        </div>
      </CMSSectionCard>

      {/* 2. Feature Image */}
      <CMSSectionCard
        id="section-media"
        title="Featured Image & Visual Asset"
        subtitle="Header image attached directly to this article"
        icon={ImageIcon}
        badge="Media"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSImageField
              id="featuredImage"
              label="Article Cover Photo"
              helperText="Upload or enter URL of article feature banner (.webp, .jpg, .png)"
              value={{
                src: formState.featuredImage || '',
                alt: formState.featuredImageAlt || formState.title || '',
              }}
              onChange={(img: ImageAsset) =>
                setFormState((prev) => ({
                  ...prev,
                  featuredImage: img.src,
                  featuredImageAlt: img.alt || prev.featuredImageAlt,
                }))
              }
              defaultSrcPlaceholder="/images/news/cbam-banner.webp"
              defaultAltPlaceholder="Regulatory compliance banner"
            />

            <div className="space-y-3">
              <CMSField
                id="featuredImageAlt"
                label="Cover Image Alt Text"
                value={formState.featuredImageAlt || ''}
                onChange={(val) => setFormState((prev) => ({ ...prev, featuredImageAlt: val }))}
                placeholder="e.g. EU CBAM compliance inspection and monitoring"
                description="Accessibility descriptive text for screen readers."
              />

              {formState.featuredImage && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                    Cover Preview
                  </span>
                  <img
                    src={formState.featuredImage}
                    alt={formState.featuredImageAlt || 'Preview'}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CMSSectionCard>

      {/* 3. Structured Article Content Blocks */}
      <CMSSectionCard
        id="section-content"
        title="Article Content Blocks"
        subtitle="Assemble formatted paragraphs, subheadings, bullet lists, callouts, and key takeaways"
        icon={TextAlignLeft}
        badge="Body Content"
        errorCount={Object.keys(validationErrors).filter((k) => k.startsWith('content')).length}
      >
        <div className="space-y-5">
          {/* Add Block Toolbar */}
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-[#082046] uppercase tracking-wider block">
              Add Content Element:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddBlock('paragraph')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <TextAlignLeft size={14} className="text-[#00607A]" />
                <span>+ Paragraph</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('heading2')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <TextHTwo size={14} className="text-[#00607A]" />
                <span>+ Heading 2</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('heading3')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <TextHThree size={14} className="text-[#00607A]" />
                <span>+ Heading 3</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('list')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <ListBullets size={14} className="text-[#00607A]" />
                <span>+ Bullet List</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('callout')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <Quotes size={14} className="text-[#00607A]" />
                <span>+ Callout / Quote</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('keyTakeaway')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <Lightbulb size={14} className="text-[#00607A]" />
                <span>+ Key Takeaway</span>
              </button>
            </div>
          </div>

          {/* Blocks List */}
          <div className="space-y-4">
            {(formState.content || []).map((block, idx) => {
              const prefix = `content.${idx}`;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-3"
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#F1F5F9] text-[#082046] flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#082046] uppercase tracking-wide">
                        {block.type === 'paragraph' && 'Paragraph'}
                        {block.type === 'heading2' && 'Section Heading (H2)'}
                        {block.type === 'heading3' && 'Subheading (H3)'}
                        {block.type === 'list' && 'Bullet List'}
                        {block.type === 'callout' && 'Quote / Callout'}
                        {block.type === 'keyTakeaway' && 'Key Takeaway Highlight'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, 'up')}
                        className={`p-1 rounded ${
                          idx === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-[#082046]'
                        }`}
                        title="Move block up"
                      >
                        <ArrowUp size={14} weight="bold" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === (formState.content || []).length - 1}
                        onClick={() => handleMoveBlock(idx, 'down')}
                        className={`p-1 rounded ${
                          idx === (formState.content || []).length - 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-[#082046]'
                        }`}
                        title="Move block down"
                      >
                        <ArrowDown size={14} weight="bold" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(idx)}
                        className="p-1 text-slate-400 hover:text-[#B42318] hover:bg-[#FEF3F2] rounded transition-colors ml-1"
                        title="Remove block"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Inputs based on Type */}
                  {block.type === 'paragraph' && (
                    <CMSTextarea
                      id={`${prefix}-text`}
                      label="Paragraph Body"
                      value={block.text || ''}
                      onChange={(val) => handleUpdateBlock(idx, { ...block, text: val })}
                      placeholder="Write your article paragraph here..."
                      rows={4}
                      error={validationErrors[`${prefix}.text`]}
                    />
                  )}

                  {(block.type === 'heading2' || block.type === 'heading3') && (
                    <CMSField
                      id={`${prefix}-heading`}
                      label={block.type === 'heading2' ? 'H2 Section Heading' : 'H3 Subheading'}
                      value={block.heading || ''}
                      onChange={(val) => handleUpdateBlock(idx, { ...block, heading: val })}
                      placeholder="e.g. Mandatory Compliance Thresholds"
                      error={validationErrors[`${prefix}.heading`]}
                    />
                  )}

                  {block.type === 'list' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                        Bullet Points (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(block.items || []).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n');
                          handleUpdateBlock(idx, { ...block, items: lines });
                        }}
                        placeholder="Point 1&#10;Point 2&#10;Point 3"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 font-normal leading-relaxed"
                      />
                    </div>
                  )}

                  {block.type === 'callout' && (
                    <div className="space-y-3 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                      <CMSTextarea
                        id={`${prefix}-quote`}
                        label="Callout Quote Text"
                        value={block.quote || ''}
                        onChange={(val) => handleUpdateBlock(idx, { ...block, quote: val })}
                        placeholder="Important takeaway statement or regulatory quote..."
                        rows={2}
                        error={validationErrors[`${prefix}.quote`]}
                      />
                      <CMSField
                        id={`${prefix}-citation`}
                        label="Attribution / Citation (Optional)"
                        value={block.citation || ''}
                        onChange={(val) => handleUpdateBlock(idx, { ...block, citation: val })}
                        placeholder="e.g. EU Regulation 2023/956, Article 8"
                      />
                    </div>
                  )}

                  {block.type === 'keyTakeaway' && (
                    <div className="space-y-2 p-3.5 bg-[#E6F4F8]/50 border border-[#00607A]/20 rounded-lg">
                      <CMSTextarea
                        id={`${prefix}-text`}
                        label="Key Takeaway Summary"
                        value={block.text || ''}
                        onChange={(val) => handleUpdateBlock(idx, { ...block, text: val })}
                        placeholder="Summarize the crucial recommendation for manufacturers..."
                        rows={3}
                        error={validationErrors[`${prefix}.text`]}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CMSSectionCard>

      {/* 4. Author & Attribution */}
      <CMSSectionCard
        id="section-author"
        title="Author Information & Topic Tags"
        subtitle="Editorial attribution and taxonomy tags for filtering"
        icon={User}
        badge="Author & Tags"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CMSField
              id="author-name"
              label="Author Name"
              value={formState.author?.name || ''}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  author: {
                    name: val,
                    role: prev.author?.role || '',
                    organization: prev.author?.organization || 'ECAS EURO',
                    avatar: prev.author?.avatar || null,
                  },
                }))
              }
              placeholder="e.g. Technical Sustainability Directorate"
            />

            <CMSField
              id="author-role"
              label="Author Role"
              value={formState.author?.role || ''}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  author: {
                    name: prev.author?.name || '',
                    role: val,
                    organization: prev.author?.organization || 'ECAS EURO',
                    avatar: prev.author?.avatar || null,
                  },
                }))
              }
              placeholder="e.g. Lead Emissions Auditor"
            />

            <CMSField
              id="author-org"
              label="Organization"
              value={formState.author?.organization || ''}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  author: {
                    name: prev.author?.name || '',
                    role: prev.author?.role || '',
                    organization: val,
                    avatar: prev.author?.avatar || null,
                  },
                }))
              }
              placeholder="e.g. ECAS EURO"
            />
          </div>

          {/* Tags */}
          <div>
            <CMSField
              id="tags"
              label="Article Tags (Comma-Separated)"
              value={(formState.tags || []).join(', ')}
              onChange={(val) => {
                const tags = val
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                setFormState((prev) => ({ ...prev, tags }));
              }}
              placeholder="CBAM, Carbon Verification, ISO 14064, EU Compliance"
              description="Used for search queries and related article exploration."
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(formState.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#082046] border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CMSSectionCard>

      {/* 5. SEO & Search Engine Preview */}
      <CMSSEOEditor
        id="section-seo"
        seo={formState.seo || { title: formState.title || '', description: formState.excerpt || '' }}
        onChange={(seo: SEOData) => setFormState((prev) => ({ ...prev, seo }))}
        errors={validationErrors}
        errorPrefix="seo"
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-[#B42318]">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3F2] border border-[#FDA29B] flex items-center justify-center shrink-0">
                <Trash size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#082046]">Delete Article</h3>
                <p className="text-xs text-[#64748B]">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed">
              Are you sure you want to permanently delete this article? All associated revisions and data will be removed.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
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
