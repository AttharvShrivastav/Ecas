import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Handshake,
  FloppyDisk,
  ArrowCounterClockwise,
  ArrowSquareOut,
  Clock,
  User,
  WarningCircle,
  CheckCircle,
} from '@phosphor-icons/react';
import { AssociationsHeroSectionEditor } from '../../components/admin/cms/AssociationsHeroSectionEditor';
import { AssociationsIntroSectionEditor } from '../../components/admin/cms/AssociationsIntroSectionEditor';
import { AssociationsPartnersSectionEditor } from '../../components/admin/cms/AssociationsPartnersSectionEditor';
import { CMSCTAEditor } from '../../components/admin/cms/CMSCTAEditor';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import {
  fetchAdminCmsPage,
  updateAdminCmsPage,
  resetAdminCmsPage,
} from '../../services/adminCmsService';
import { defaultAssociationsPageContent } from '../../cms/associationsContent';
import type { AssociationsPageContent } from '../../cms/types';

export const AdminAssociationsEditorPage: React.FC = () => {
  const [initialContent, setInitialContent] = useState<AssociationsPageContent>(
    defaultAssociationsPageContent
  );
  const [formContent, setFormContent] = useState<AssociationsPageContent>(
    defaultAssociationsPageContent
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load content from server
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const pageData = await fetchAdminCmsPage<AssociationsPageContent>('associations');
        if (mounted) {
          const content = pageData.content || defaultAssociationsPageContent;
          setInitialContent(content);
          setFormContent(content);
          setUpdatedBy(pageData.updatedBy || 'Administrator');
          setUpdatedAt(pageData.updatedAt || new Date().toISOString());
        }
      } catch (err: any) {
        console.warn('[Admin CMS] Failed to fetch server content, falling back to defaults:', err);
        if (mounted) {
          setInitialContent(defaultAssociationsPageContent);
          setFormContent(defaultAssociationsPageContent);
          setUpdatedBy('Local System Initializer');
          setUpdatedAt(new Date().toISOString());
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Dirty tracking
  const isDirty = useMemo(() => {
    return JSON.stringify(initialContent) !== JSON.stringify(formContent);
  }, [initialContent, formContent]);

  // Comprehensive Form Validation
  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errs: Record<string, string> = {};

    // Hero Validation
    if (!formContent.hero?.headingLines || formContent.hero.headingLines.length === 0) {
      errs['hero.headingLines'] = 'At least one hero heading line is required.';
    } else {
      formContent.hero.headingLines.forEach((line, idx) => {
        if (!line.trim()) {
          errs[`hero.headingLines.${idx}`] = 'Heading line cannot be empty.';
        }
      });
    }

    if (!formContent.hero?.description?.trim()) {
      errs['hero.description'] = 'Hero description is required.';
    }

    // Intro Validation
    if (!formContent.intro?.heading?.trim()) {
      errs['intro.heading'] = 'Network introduction heading is required.';
    }
    if (!formContent.intro?.description?.trim()) {
      errs['intro.description'] = 'Network introduction description is required.';
    }

    // Partners Validation
    if (!formContent.partners || formContent.partners.length === 0) {
      errs['partners'] = 'At least 1 partner organisation card is required.';
    } else {
      const slugSet = new Set<string>();
      formContent.partners.forEach((partner, idx) => {
        const prefix = `partners.${idx}`;
        if (!partner.name?.trim()) {
          errs[`${prefix}.name`] = 'Partner name is required.';
        }
        if (!partner.slug?.trim()) {
          errs[`${prefix}.slug`] = 'Partner slug is required.';
        } else {
          const normSlug = partner.slug.trim().toLowerCase();
          if (slugSet.has(normSlug)) {
            errs[`${prefix}.slug`] = `Slug "${normSlug}" is duplicated. Each partner must have a unique slug.`;
          }
          slugSet.add(normSlug);
        }
        if (!partner.shortDescription?.trim()) {
          errs[`${prefix}.shortDescription`] = 'Partner card short description is required.';
        }
        if (!partner.profile?.overview?.trim()) {
          errs[`${prefix}.profile.overview`] = 'Full organisation overview is required for the detail modal.';
        }
      });
    }

    // Consulting CTA Validation
    if (!formContent.consultingCta?.heading?.trim()) {
      errs['consultingCta.heading'] = 'Partner CTA heading is required.';
    }
    if (!formContent.consultingCta?.buttonLabel?.trim()) {
      errs['consultingCta.buttonLabel'] = 'Partner CTA button label is required.';
    }

    // SEO Validation
    if (!formContent.seo?.title?.trim()) {
      errs['seo.title'] = 'Meta title is required for SEO.';
    }
    if (!formContent.seo?.description?.trim()) {
      errs['seo.description'] = 'Meta description is required for SEO.';
    }

    return {
      isValid: Object.keys(errs).length === 0,
      errors: errs,
    };
  };

  // Handle Save
  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const { isValid, errors } = validateForm();
    if (!isValid) {
      setValidationErrors(errors);
      setErrorMessage(
        `Validation failed with ${Object.keys(errors).length} issue(s). Please correct marked fields.`
      );
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(firstKey) || document.querySelector(`[id*="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateAdminCmsPage<AssociationsPageContent>('associations', formContent);
      setUpdatedBy(updated.updatedBy);
      setUpdatedAt(updated.updatedAt);
      setInitialContent(formContent);
      setSuccessMessage('Associations & Partners content updated successfully.');
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
      const reset = await resetAdminCmsPage<AssociationsPageContent>('associations');
      setUpdatedBy(reset.updatedBy);
      setUpdatedAt(reset.updatedAt);
      setFormContent(reset.content);
      setInitialContent(reset.content);
      setIsResetModalOpen(false);
      setValidationErrors({});
      setSuccessMessage('Associations page content has been reset to system defaults.');
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
          Loading Associations & Partners Content Model...
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
        <span>Network</span>
        <span>/</span>
        <span className="font-semibold text-[#082046]">Associations & Partners CMS</span>
      </nav>

      {/* Main Header & Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <Handshake size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                Associations & Partners
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
              href="/associations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <span>View Live Page</span>
              <ArrowSquareOut size={14} weight="bold" />
            </a>

            {/* Reset to Defaults Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#B42318] bg-white border border-[#CBD5E1] hover:border-[#FDA29B] hover:bg-[#FEF3F2] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <ArrowCounterClockwise size={14} weight="bold" />
              <span>Reset Defaults</span>
            </button>

            {/* Discard Changes (if dirty) */}
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all cursor-pointer"
              >
                <span>Discard</span>
              </button>
            )}

            {/* Save / Publish */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer ${
                isDirty
                  ? 'text-white bg-[#082046] hover:bg-[#0F1B4A] active:scale-[0.98]'
                  : 'text-[#94A3B8] bg-[#F1F5F9] border border-[#E2E8F0] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

        {/* Global Feedback Banner: Errors / Success */}
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

      {/* Structured Section Editors */}
      <div className="space-y-6">
        {/* 1. Hero Section */}
        <AssociationsHeroSectionEditor
          content={formContent.hero}
          onChange={(hero) => setFormContent({ ...formContent, hero })}
          errors={validationErrors}
        />

        {/* 2. Introduction Section */}
        <AssociationsIntroSectionEditor
          content={formContent.intro}
          onChange={(intro) => setFormContent({ ...formContent, intro })}
          errors={validationErrors}
        />

        {/* 3. Partner Organisations Repeater */}
        <AssociationsPartnersSectionEditor
          partners={formContent.partners}
          onChange={(partners) => setFormContent({ ...formContent, partners })}
          errors={validationErrors}
        />

        {/* 4. Consulting / Partner Call to Action */}
        <CMSCTAEditor
          id="section-cta"
          title="Network Partner Call to Action (CTA)"
          subtitle="Consulting and partnership invitation strip at bottom of the Associations page"
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent({ ...formContent, consultingCta })}
          errors={validationErrors}
          errorPrefix="consultingCta"
        />

        {/* 5. SEO & Metadata */}
        <CMSSEOEditor
          id="section-seo"
          content={formContent.seo}
          seo={formContent.seo}
          onChange={(seo) => setFormContent({ ...formContent, seo })}
          errors={validationErrors}
          errorPrefix="seo"
        />
      </div>

      {/* Sticky Bottom Save Bar on Dirty State */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#082046] text-white px-6 py-3 rounded-2xl shadow-xl border border-[#1E3A8A] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="font-semibold">You have unsaved changes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 text-xs font-bold bg-[#00607A] hover:bg-[#007A9B] text-white rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? 'Saving...' : 'Save & Publish'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting to Defaults */}
      <CmsResetConfirmModal
        isOpen={isResetModalOpen}
        isResetting={isResetting}
        pageTitle="Associations & Technical Partners"
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};
