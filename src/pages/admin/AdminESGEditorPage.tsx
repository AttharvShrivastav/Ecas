import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  Leaf,
  ShieldCheck,
  Clock,
  User,
  ArrowCounterClockwise
} from '@phosphor-icons/react';
import { fetchAdminCmsPage, updateAdminCmsPage, resetAdminCmsPage } from '../../services/adminCmsService';
import { EsgHeroSectionEditor } from '../../components/admin/cms/EsgHeroSectionEditor';
import { EsgPillarsSectionEditor } from '../../components/admin/cms/EsgPillarsSectionEditor';
import { EsgFaqSectionEditor } from '../../components/admin/cms/EsgFaqSectionEditor';
import { EsgConsultingCtaEditor } from '../../components/admin/cms/EsgConsultingCtaEditor';
import { EsgSeoEditor } from '../../components/admin/cms/EsgSeoEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultESGPageContent } from '../../cms/esgContent';
import type { ESGPageContent } from '../../cms/types';

export const AdminESGEditorPage: React.FC = () => {
  // Page Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('ESG Assurance and Support');
  const [version, setVersion] = useState<number>(1);
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<ESGPageContent>(defaultESGPageContent);
  const [initialContent, setInitialContent] = useState<ESGPageContent>(defaultESGPageContent);

  // Status & Feedback State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch page content on mount
  const loadPageContent = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminCmsPage<ESGPageContent>('esg');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'ESG Assurance and Support');
        setVersion(data.version || 1);
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        // Ensure safe fallback if any sub-property is missing
        const mergedContent: ESGPageContent = {
          seo: { ...defaultESGPageContent.seo, ...(data.content?.seo || {}) },
          hero: { ...defaultESGPageContent.hero, ...(data.content?.hero || {}) },
          esgSection: { ...defaultESGPageContent.esgSection, ...(data.content?.esgSection || {}) },
          faq: { ...defaultESGPageContent.faq, ...(data.content?.faq || {}) },
          consultingCta: { ...defaultESGPageContent.consultingCta, ...(data.content?.consultingCta || {}) },
        };

        setFormContent(mergedContent);
        setInitialContent(mergedContent);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch ESG page:', err);
      setErrorMessage(err.message || 'Failed to load ESG page content from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageContent();
  }, [loadPageContent]);

  // Dirty detection
  const isDirty = useMemo(() => {
    return JSON.stringify(formContent) !== JSON.stringify(initialContent);
  }, [formContent, initialContent]);

  // Client-side validation function
  const validateForm = (content: ESGPageContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    // 1. Hero Validation
    const headingLines = content.hero?.headingLines || [];
    if (headingLines.length === 0 || !headingLines.some((l) => l.trim().length > 0)) {
      errors['hero.headingLines'] = 'At least one non-empty heading line is required.';
    }
    if (!content.hero?.description?.trim()) {
      errors['hero.description'] = 'Hero description is required.';
    }

    // 2. Pillars Section Validation
    if (!content.esgSection?.heading?.trim()) {
      errors['esgSection.heading'] = 'Section heading is required.';
    }
    if (!content.esgSection?.description?.trim()) {
      errors['esgSection.description'] = 'Section description is required.';
    }
    const pillars = content.esgSection?.pillars || [];
    if (pillars.length === 0) {
      errors['esgSection.pillars'] = 'At least one ESG pillar card is required.';
    } else {
      pillars.forEach((p, idx) => {
        if (!p.title?.trim()) {
          errors[`esgSection.pillars.${idx}.title`] = `Pillar #${idx + 1} must have a title.`;
        }
      });
    }

    // 3. FAQ Validation
    if (!content.faq?.heading?.trim()) {
      errors['faq.heading'] = 'FAQ section heading is required.';
    }
    const faqItems = content.faq?.items || [];
    if (faqItems.length === 0) {
      errors['faq.items'] = 'At least one FAQ item is required.';
    } else {
      faqItems.forEach((item, idx) => {
        if (!item.question?.trim()) {
          errors[`faq.items.${idx}.question`] = `FAQ #${idx + 1} question cannot be empty.`;
        }
        if (!item.answer?.trim()) {
          errors[`faq.items.${idx}.answer`] = `FAQ #${idx + 1} answer cannot be empty.`;
        }
      });
    }

    // 4. Consulting CTA Validation
    if (!content.consultingCta?.heading?.trim()) {
      errors['consultingCta.heading'] = 'CTA banner heading is required.';
    }
    if (!content.consultingCta?.description?.trim()) {
      errors['consultingCta.description'] = 'CTA banner description is required.';
    }
    if (!content.consultingCta?.buttonLabel?.trim()) {
      errors['consultingCta.buttonLabel'] = 'Button label is required.';
    }
    if (!content.consultingCta?.buttonHref?.trim()) {
      errors['consultingCta.buttonHref'] = 'Button destination URL is required.';
    }

    // 5. SEO Validation
    if (!content.seo?.title?.trim()) {
      errors['seo.title'] = 'Meta page title is required.';
    }
    if (!content.seo?.description?.trim()) {
      errors['seo.description'] = 'Meta description is required.';
    }

    return errors;
  };

  // Handle Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errors = validateForm(formContent);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please correct the highlighted validation errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateAdminCmsPage<ESGPageContent>('esg', formContent);
      setVersion(updated.version);
      setUpdatedBy(updated.updatedBy);
      setUpdatedAt(updated.updatedAt);
      setInitialContent(formContent);
      setSuccessMessage('ESG Page content updated successfully.');
      setValidationErrors({});
    } catch (err: any) {
      console.error('[Admin CMS] Save failed:', err);
      setErrorMessage(err.message || 'Failed to save page changes to server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset to Defaults
  const handleConfirmReset = async () => {
    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const reset = await resetAdminCmsPage<ESGPageContent>('esg');
      setVersion(reset.version);
      setUpdatedBy(reset.updatedBy);
      setUpdatedAt(reset.updatedAt);
      setFormContent(reset.content);
      setInitialContent(reset.content);
      setIsResetModalOpen(false);
      setValidationErrors({});
      setSuccessMessage('ESG Page content has been reset to system defaults.');
    } catch (err: any) {
      console.error('[Admin CMS] Reset failed:', err);
      setErrorMessage(err.message || 'Failed to reset page content.');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Discard Changes
  const handleDiscardChanges = () => {
    setFormContent(initialContent);
    setValidationErrors({});
    setErrorMessage(null);
    setSuccessMessage('Unsaved changes discarded.');
  };

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleString('en-GB', {
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
        <p className="text-sm font-semibold text-[#082046]">
          Loading ESG Page Content Model...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-['DM_Sans'] antialiased">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/admin/certificates" className="hover:text-[#082046] transition-colors">
          Admin Portal
        </Link>
        <span>/</span>
        <span>Services</span>
        <span>/</span>
        <span className="font-semibold text-[#082046]">ESG Verification CMS</span>
      </nav>

      {/* Main Header & Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <Leaf size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                ESG Assurance and Support
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

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* View Live Public Page */}
            <a
              href="/services/esg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg transition-colors shadow-2xs"
            >
              <ArrowSquareOut size={15} />
              <span>Preview Live ↗</span>
            </a>

            {/* Reset to Factory Defaults */}
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

            {/* Discard Edits */}
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

            {/* Save Changes Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-xs ${
                isDirty
                  ? 'bg-[#082046] hover:bg-[#0F1B4A] text-white'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <ArrowClockwise size={15} className="animate-spin" weight="bold" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={15} weight="bold" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Anchor Navigation */}
        <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
          <span className="text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider shrink-0">
            Jump to:
          </span>
          <a
            href="#section-hero"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Hero
          </a>
          <a
            href="#section-pillars"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Pillars ({formContent.esgSection?.pillars?.length || 0})
          </a>
          <a
            href="#section-faq"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            FAQs ({formContent.faq?.items?.length || 0})
          </a>
          <a
            href="#section-cta"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Consulting CTA
          </a>
          <a
            href="#section-seo"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            SEO & Metadata
          </a>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 bg-[#ECFDF3] border border-[#ABEFC6] rounded-xl flex items-center justify-between gap-3 text-xs text-[#027A48] animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle size={18} weight="fill" className="text-[#12B76A] shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-[#027A48] hover:text-[#054F31] font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="p-4 bg-[#FEF3F2] border border-[#FDA29B] rounded-xl flex items-start justify-between gap-3 text-xs text-[#B42318] animate-fadeIn">
          <div className="flex items-start gap-2 font-medium">
            <WarningCircle size={18} weight="fill" className="text-[#D92D20] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
              {Object.keys(validationErrors).length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-[#912018]">
                  {Object.entries(validationErrors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[#B42318] hover:text-[#7A271A] font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Sections Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero */}
        <EsgHeroSectionEditor
          content={formContent.hero}
          onChange={(hero) => setFormContent({ ...formContent, hero })}
          errors={validationErrors}
        />

        {/* Section 2: Pillars */}
        <EsgPillarsSectionEditor
          content={formContent.esgSection}
          onChange={(esgSection) => setFormContent({ ...formContent, esgSection })}
          errors={validationErrors}
        />

        {/* Section 3: FAQ */}
        <EsgFaqSectionEditor
          content={formContent.faq}
          onChange={(faq) => setFormContent({ ...formContent, faq })}
          errors={validationErrors}
        />

        {/* Section 4: Consulting CTA */}
        <EsgConsultingCtaEditor
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent({ ...formContent, consultingCta })}
          errors={validationErrors}
        />

        {/* Section 5: SEO & Metadata */}
        <EsgSeoEditor
          content={formContent.seo}
          onChange={(seo) => setFormContent({ ...formContent, seo })}
          errors={validationErrors}
        />

        {/* Sticky Bottom Save Bar for Ergonomics */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] p-4 rounded-xl shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B42318]">
                <span className="w-2 h-2 rounded-full bg-[#B42318] animate-ping" />
                Unsaved modifications detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                <CheckCircle size={14} className="text-[#12B76A]" weight="fill" />
                All changes saved to database
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-semibold text-[#475467] hover:bg-[#F1F5F9] rounded-lg transition-colors border border-[#CBD5E1]"
              >
                Discard
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-lg transition-all shadow-xs ${
                isDirty
                  ? 'bg-[#082046] hover:bg-[#0F1B4A] text-white cursor-pointer'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <ArrowClockwise size={14} className="animate-spin" weight="bold" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={14} weight="bold" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      <CmsResetConfirmModal
        isOpen={isResetModalOpen}
        pageTitle="ESG Assurance and Support"
        isResetting={isResetting}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
