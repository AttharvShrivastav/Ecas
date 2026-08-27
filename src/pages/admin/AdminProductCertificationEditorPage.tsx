import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  SealCheck,
  Clock,
  User,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { fetchAdminCmsPage, updateAdminCmsPage, resetAdminCmsPage } from '../../services/adminCmsService';
import { ProductCertHeroEditor } from '../../components/admin/cms/ProductCertHeroEditor';
import { ProductCertExplorerEditor } from '../../components/admin/cms/ProductCertExplorerEditor';
import { ProductCertCategoriesEditor } from '../../components/admin/cms/ProductCertCategoriesEditor';
import { ProductCertMarketsEditor } from '../../components/admin/cms/ProductCertMarketsEditor';
import { CMSFAQEditor } from '../../components/admin/cms/CMSFAQEditor';
import { CMSCTAEditor } from '../../components/admin/cms/CMSCTAEditor';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultProductCertificationContent } from '../../cms/productCertificationContent';
import type { ProductCertificationPageContent } from '../../cms/types';

export const AdminProductCertificationEditorPage: React.FC = () => {
  // Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Product Certification');
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<ProductCertificationPageContent>(defaultProductCertificationContent);
  const [initialContent, setInitialContent] = useState<ProductCertificationPageContent>(defaultProductCertificationContent);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loadPageContent = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminCmsPage<ProductCertificationPageContent>('product-certification');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'Product Certification');
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        const merged: ProductCertificationPageContent = {
          seo: { ...defaultProductCertificationContent.seo, ...(data.content?.seo || {}) },
          hero: { ...defaultProductCertificationContent.hero, ...(data.content?.hero || {}) },
          explorer: { ...defaultProductCertificationContent.explorer, ...(data.content?.explorer || {}) },
          categories: { ...defaultProductCertificationContent.categories, ...(data.content?.categories || {}) },
          internationalMarkets: { ...defaultProductCertificationContent.internationalMarkets, ...(data.content?.internationalMarkets || {}) },
          faq: { ...defaultProductCertificationContent.faq, ...(data.content?.faq || {}) },
          consultingCta: { ...defaultProductCertificationContent.consultingCta, ...(data.content?.consultingCta || {}) },
        };

        setFormContent(merged);
        setInitialContent(merged);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch Product Certification page:', err);
      setErrorMessage(err.message || 'Failed to load page content from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageContent();
  }, [loadPageContent]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formContent) !== JSON.stringify(initialContent);
  }, [formContent, initialContent]);

  const validateForm = (content: ProductCertificationPageContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Hero
    const headingLines = content.hero?.headingLines || [];
    if (headingLines.length === 0 || !headingLines.some((l) => l.trim().length > 0)) {
      errors['hero.headingLines'] = 'At least one non-empty heading line is required.';
    }
    if (!content.hero?.description?.trim()) {
      errors['hero.description'] = 'Hero description is required.';
    }

    // Explorer
    if (!content.explorer?.heading?.trim()) {
      errors['explorer.heading'] = 'Explorer heading is required.';
    }
    const schemes = content.explorer?.schemes || [];
    if (schemes.length === 0) {
      errors['explorer.schemes'] = 'At least one certification scheme is required.';
    } else {
      schemes.forEach((s, idx) => {
        if (!s.name?.trim()) {
          errors[`explorer.schemes.${idx}.name`] = `Scheme #${idx + 1} must have a name.`;
        }
        if (!s.slug?.trim()) {
          errors[`explorer.schemes.${idx}.slug`] = `Scheme #${idx + 1} must have a slug.`;
        }
        if (!s.summary?.trim()) {
          errors[`explorer.schemes.${idx}.summary`] = `Scheme #${idx + 1} must have a summary.`;
        }
      });
    }

    // Categories
    if (!content.categories?.heading?.trim()) {
      errors['categories.heading'] = 'Categories section heading is required.';
    }

    // Markets
    if (!content.internationalMarkets?.heading?.trim()) {
      errors['internationalMarkets.heading'] = 'International markets section heading is required.';
    }

    // FAQ
    if (!content.faq?.heading?.trim()) {
      errors['faq.heading'] = 'FAQ section heading is required.';
    }

    // CTA
    if (!content.consultingCta?.heading?.trim()) {
      errors['consultingCta.heading'] = 'Consulting CTA banner heading is required.';
    }

    return errors;
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errors = validateForm(formContent);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage(`Please resolve the ${Object.keys(errors).length} highlighted validation error(s) before saving.`);
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateAdminCmsPage<ProductCertificationPageContent>('product-certification', formContent);
      if (result) {
        setUpdatedBy(result.updatedBy || 'ADMIN');
        setUpdatedAt(result.updatedAt || new Date().toISOString());
        setInitialContent(formContent);
        setSuccessMessage('Product Certification page changes saved and published successfully.');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Save failed:', err);
      setErrorMessage(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await resetAdminCmsPage<ProductCertificationPageContent>('product-certification');
      if (result) {
        const merged: ProductCertificationPageContent = {
          seo: { ...defaultProductCertificationContent.seo, ...(result.content?.seo || {}) },
          hero: { ...defaultProductCertificationContent.hero, ...(result.content?.hero || {}) },
          explorer: { ...defaultProductCertificationContent.explorer, ...(result.content?.explorer || {}) },
          categories: { ...defaultProductCertificationContent.categories, ...(result.content?.categories || {}) },
          internationalMarkets: { ...defaultProductCertificationContent.internationalMarkets, ...(result.content?.internationalMarkets || {}) },
          faq: { ...defaultProductCertificationContent.faq, ...(result.content?.faq || {}) },
          consultingCta: { ...defaultProductCertificationContent.consultingCta, ...(result.content?.consultingCta || {}) },
        };

        setFormContent(merged);
        setInitialContent(merged);
        setUpdatedBy(result.updatedBy || 'ADMIN_RESET');
        setUpdatedAt(result.updatedAt || new Date().toISOString());
        setValidationErrors({});
        setIsResetModalOpen(false);
        setSuccessMessage('Content successfully reset to system default values.');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Reset failed:', err);
      setErrorMessage(err.message || 'Failed to reset page content.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDiscardChanges = () => {
    if (window.confirm('Discard all uncommitted changes and reload the last saved version?')) {
      setFormContent(initialContent);
      setValidationErrors({});
      setErrorMessage(null);
      setSuccessMessage('Unsaved changes discarded.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'System Initialization';

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#082046] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#082046]">Loading Product Certification CMS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-['DM_Sans'] antialiased">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/admin/certificates" className="hover:text-[#082046] transition-colors">
          Admin Portal
        </Link>
        <span>/</span>
        <span>Services</span>
        <span>/</span>
        <span className="font-semibold text-[#082046]">Product Certification CMS</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <SealCheck size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                Product Certification
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-[#E6F4F8] text-[#00607A] rounded-md border border-[#00607A]/20">
                Controlled CMS
              </span>
              {isDirty ? (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#FEF3F2] text-[#B42318] rounded-md border border-[#FDA29B] animate-pulse">
                  Unsaved Changes
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-medium bg-[#ECFDF3] text-[#027A48] rounded-md border border-[#ABEFC6]">
                  Live / Synchronized
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-[#64748B] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#94A3B8]" />
                Last updated: {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[#94A3B8]" />
                Editor: <span className="font-semibold text-[#334155]">{updatedBy}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <a
              href="/services/product-certification"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg transition-colors shadow-2xs"
            >
              <ArrowSquareOut size={15} />
              <span>Preview Live ↗</span>
            </a>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#FEF3F2] border border-[#FDA29B] rounded-lg transition-colors shadow-2xs disabled:opacity-50"
              title="Reset all fields to factory defaults"
            >
              <ArrowClockwise size={15} />
              <span>Reset Defaults</span>
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg transition-colors"
                title="Discard uncommitted changes"
              >
                <ArrowCounterClockwise size={14} />
                <span>Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#082046] hover:bg-[#00607A] rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={16} weight="bold" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-3.5 bg-[#ECFDF3] border border-[#ABEFC6] text-[#027A48] rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle size={18} weight="fill" className="shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] rounded-xl text-xs flex items-center gap-2.5">
            <WarningCircle size={18} weight="fill" className="shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Editor Sections Form */}
      <form onSubmit={handleSaveChanges} className="space-y-6">
        {/* 1. Hero Section */}
        <ProductCertHeroEditor
          content={formContent.hero}
          onChange={(hero) => setFormContent({ ...formContent, hero })}
          errors={validationErrors}
        />

        {/* 2. Route Explorer Section */}
        <ProductCertExplorerEditor
          content={formContent.explorer}
          onChange={(explorer) => setFormContent({ ...formContent, explorer })}
          errors={validationErrors}
        />

        {/* 3. Product Categories Section */}
        <ProductCertCategoriesEditor
          content={formContent.categories}
          onChange={(categories) => setFormContent({ ...formContent, categories })}
          errors={validationErrors}
        />

        {/* 4. International Markets Section */}
        <ProductCertMarketsEditor
          content={formContent.internationalMarkets}
          onChange={(internationalMarkets) => setFormContent({ ...formContent, internationalMarkets })}
          errors={validationErrors}
        />

        {/* 5. FAQs Section */}
        <CMSFAQEditor
          id="section-faq"
          title="Frequently Asked Questions"
          subtitle="Common questions addressing CE marking directives, mandatory conformity and technical file audits"
          defaultCategory="Product Certification"
          content={formContent.faq}
          onChange={(faq) => setFormContent({ ...formContent, faq })}
          errors={validationErrors}
        />

        {/* 6. Consulting CTA Banner */}
        <CMSCTAEditor
          id="section-cta"
          title="Consulting CTA Banner"
          subtitle="Bottom-of-page conversion block prompting manufacturers to initiate certification assessment"
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent({ ...formContent, consultingCta })}
          errors={validationErrors}
        />

        {/* 7. SEO & Metadata */}
        <CMSSEOEditor
          id="section-seo"
          title="SEO & Metadata"
          subtitle="Search engine indexing, title tags and social graph optimization for the Product Certification page"
          defaultTitlePlaceholder="Product Certification & CE Marking | ECAS EURO"
          defaultDescriptionPlaceholder="International product certification, CE marking assessment, and regulatory market access services by ECAS EURO..."
          seo={formContent.seo}
          onChange={(seo) => setFormContent({ ...formContent, seo })}
          errors={validationErrors}
        />

        {/* Bottom Floating/Sticky Action Bar when Dirty */}
        {isDirty && (
          <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#082046]/20 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B42318] animate-ping" />
              <p className="text-xs font-bold text-[#082046]">
                You have unsaved changes in Product Certification CMS.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#082046] hover:bg-[#00607A] rounded-lg transition-all"
              >
                <FloppyDisk size={15} weight="bold" />
                <span>Publish Changes</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Reset Confirmation Modal */}
      <CmsResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        isResetting={isResetting}
        pageTitle="Product Certification"
      />
    </div>
  );
};
