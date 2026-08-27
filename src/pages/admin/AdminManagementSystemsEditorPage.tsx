import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  TreeStructure,
  Clock,
  User,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { fetchAdminCmsPage, updateAdminCmsPage, resetAdminCmsPage } from '../../services/adminCmsService';
import { ManagementSystemHeroEditor } from '../../components/admin/cms/ManagementSystemHeroEditor';
import { ManagementStandardsSectionEditor } from '../../components/admin/cms/ManagementStandardsSectionEditor';
import { CMSFAQEditor } from '../../components/admin/cms/CMSFAQEditor';
import { CMSCTAEditor } from '../../components/admin/cms/CMSCTAEditor';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultManagementSystemPageContent } from '../../cms/managementSystemContent';
import type { ManagementSystemPageContent } from '../../cms/types';

export const AdminManagementSystemsEditorPage: React.FC = () => {
  // Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Management Systems Certification');
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<ManagementSystemPageContent>(defaultManagementSystemPageContent);
  const [initialContent, setInitialContent] = useState<ManagementSystemPageContent>(defaultManagementSystemPageContent);

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
      // Supports both 'management-systems' and 'management-system' keys
      const data = await fetchAdminCmsPage<ManagementSystemPageContent>('management-system');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'Management Systems Certification');
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        const merged: ManagementSystemPageContent = {
          seo: { ...defaultManagementSystemPageContent.seo, ...(data.content?.seo || {}) },
          hero: { ...defaultManagementSystemPageContent.hero, ...(data.content?.hero || {}) },
          standardsSection: {
            ...defaultManagementSystemPageContent.standardsSection,
            ...(data.content?.standardsSection || {}),
          },
          faq: { ...defaultManagementSystemPageContent.faq, ...(data.content?.faq || {}) },
          consultingCta: { ...defaultManagementSystemPageContent.consultingCta, ...(data.content?.consultingCta || {}) },
        };

        setFormContent(merged);
        setInitialContent(merged);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch Management Systems page:', err);
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

  const validateForm = (content: ManagementSystemPageContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Hero
    const headingLines = content.hero?.headingLines || [];
    if (headingLines.length === 0 || !headingLines.some((l) => l.trim().length > 0)) {
      errors['hero.headingLines'] = 'At least one non-empty heading line is required.';
    }
    if (!content.hero?.description?.trim()) {
      errors['hero.description'] = 'Hero description is required.';
    }

    // Standards Section
    if (!content.standardsSection?.heading?.trim()) {
      errors['standardsSection.heading'] = 'Standards section heading is required.';
    }
    const standards = content.standardsSection?.standards || [];
    if (standards.length === 0) {
      errors['standardsSection.standards'] = 'At least one ISO standard is required in the registry.';
    } else {
      standards.forEach((std, idx) => {
        if (!std.title?.trim()) {
          errors[`standardsSection.standards.${idx}.title`] = `Standard #${idx + 1} must have a title.`;
        }
        if (!std.slug?.trim()) {
          errors[`standardsSection.standards.${idx}.slug`] = `Standard #${idx + 1} must have a slug.`;
        }
        if (!std.shortDescription?.trim()) {
          errors[`standardsSection.standards.${idx}.shortDescription`] = `Standard #${idx + 1} must have a summary.`;
        }
      });
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
      const result = await updateAdminCmsPage<ManagementSystemPageContent>('management-system', formContent);
      if (result) {
        setUpdatedBy(result.updatedBy || 'ADMIN');
        setUpdatedAt(result.updatedAt || new Date().toISOString());
        setInitialContent(formContent);
        setSuccessMessage('Management Systems page changes saved and published successfully.');
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
      const result = await resetAdminCmsPage<ManagementSystemPageContent>('management-system');
      if (result) {
        const merged: ManagementSystemPageContent = {
          seo: { ...defaultManagementSystemPageContent.seo, ...(result.content?.seo || {}) },
          hero: { ...defaultManagementSystemPageContent.hero, ...(result.content?.hero || {}) },
          standardsSection: {
            ...defaultManagementSystemPageContent.standardsSection,
            ...(result.content?.standardsSection || {}),
          },
          faq: { ...defaultManagementSystemPageContent.faq, ...(result.content?.faq || {}) },
          consultingCta: { ...defaultManagementSystemPageContent.consultingCta, ...(result.content?.consultingCta || {}) },
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
        <p className="text-sm font-semibold text-[#082046]">Loading Management Systems CMS...</p>
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
        <span className="font-semibold text-[#082046]">Management Systems CMS</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <TreeStructure size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                Management Systems Certification
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
              href="/services/management-system-certification"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg transition-colors"
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
        <ManagementSystemHeroEditor
          content={formContent.hero}
          onChange={(hero) => setFormContent({ ...formContent, hero })}
          errors={validationErrors}
        />

        {/* 2. Standards Registry Section */}
        <ManagementStandardsSectionEditor
          content={formContent.standardsSection}
          onChange={(standardsSection) => setFormContent({ ...formContent, standardsSection })}
          errors={validationErrors}
        />

        {/* 3. FAQs Section */}
        <CMSFAQEditor
          id="section-faq"
          title="Frequently Asked Questions"
          subtitle="Accreditation pathways, two-stage audits, surveillance cycles and certification validity"
          defaultCategory="Management Systems"
          content={formContent.faq}
          onChange={(faq) => setFormContent({ ...formContent, faq })}
          errors={validationErrors}
        />

        {/* 4. Consulting CTA Banner */}
        <CMSCTAEditor
          id="section-cta"
          title="Consulting CTA Banner"
          subtitle="Bottom-of-page conversion block guiding clients to ISO audit planning and certification proposals"
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent({ ...formContent, consultingCta })}
          errors={validationErrors}
        />

        {/* 5. SEO & Metadata */}
        <CMSSEOEditor
          id="section-seo"
          title="SEO & Metadata"
          subtitle="Search engine indexing, title tags and metadata for Management System Certification"
          defaultTitlePlaceholder="Management System Certification (ISO) | ECAS EURO"
          defaultDescriptionPlaceholder="Accredited ISO certification services: ISO 9001, ISO 14001, ISO 45001, ISO 27001, and ISO 50001 with global recognition."
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
                You have unsaved changes in Management Systems CMS.
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
        pageTitle="Management Systems Certification"
      />
    </div>
  );
};
