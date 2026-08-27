import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  House,
  ShieldCheck,
  Clock,
  User,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import {
  fetchAdminCmsPage,
  updateAdminCmsPage,
  resetAdminCmsPage,
} from '../../services/adminCmsService';
import { HomeHeroSectionEditor } from '../../components/admin/cms/HomeHeroSectionEditor';
import { HomeServicesSectionEditor } from '../../components/admin/cms/HomeServicesSectionEditor';
import { HomeCertificateShortcutEditor } from '../../components/admin/cms/HomeCertificateShortcutEditor';
import { HomeProcessSectionEditor } from '../../components/admin/cms/HomeProcessSectionEditor';
import { HomeTestimonialsSectionEditor } from '../../components/admin/cms/HomeTestimonialsSectionEditor';
import { CMSFAQEditor } from '../../components/admin/cms/CMSFAQEditor';
import { CMSCTAEditor } from '../../components/admin/cms/CMSCTAEditor';
import { HomeFooterSectionEditor } from '../../components/admin/cms/HomeFooterSectionEditor';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultHomePageContent, defaultHomeSEO } from '../../cms/homeContent';
import type { HomePageContent } from '../../cms/types';

export const AdminHomeEditorPage: React.FC = () => {
  // Page Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Home Page');
  const [version, setVersion] = useState<number>(1);
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<HomePageContent>(defaultHomePageContent);
  const [initialContent, setInitialContent] = useState<HomePageContent>(defaultHomePageContent);

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
      const data = await fetchAdminCmsPage<HomePageContent>('home');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'Home Page');
        setVersion(data.version || 1);
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        // Ensure safe fallback if any sub-property is missing
        const mergedContent: HomePageContent = {
          seo: { ...defaultHomeSEO, ...(data.content?.seo || {}) },
          hero: { ...defaultHomePageContent.hero, ...(data.content?.hero || {}) },
          services: { ...defaultHomePageContent.services, ...(data.content?.services || {}) },
          certificateShortcut: {
            ...defaultHomePageContent.certificateShortcut,
            ...(data.content?.certificateShortcut || {}),
          },
          process: { ...defaultHomePageContent.process, ...(data.content?.process || {}) },
          testimonials: {
            ...defaultHomePageContent.testimonials,
            ...(data.content?.testimonials || {}),
          },
          faq: { ...defaultHomePageContent.faq, ...(data.content?.faq || {}) },
          consultingCta: {
            ...defaultHomePageContent.consultingCta,
            ...(data.content?.consultingCta || {}),
          },
          footer: { ...defaultHomePageContent.footer, ...(data.content?.footer || {}) },
        };

        setFormContent(mergedContent);
        setInitialContent(mergedContent);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch Home page:', err);
      setErrorMessage(err.message || 'Failed to load Home page content from server.');
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
  const validateForm = (content: HomePageContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    // 1. Hero Validation
    const headingLines = content.hero?.headingLines || [];
    if (headingLines.length === 0 || !headingLines.some((l) => l.trim().length > 0)) {
      errors['hero.headingLines'] = 'At least one non-empty heading line is required.';
    }
    if (!content.hero?.description?.trim()) {
      errors['hero.description'] = 'Hero description is required.';
    }

    // 2. Services Validation
    if (!content.services?.heading?.trim()) {
      errors['services.heading'] = 'Services section heading is required.';
    }
    if (!content.services?.description?.trim()) {
      errors['services.description'] = 'Services section description is required.';
    }
    const servicesList = content.services?.services || [];
    if (servicesList.length === 0) {
      errors['services.items'] = 'At least one service card is required.';
    } else {
      servicesList.forEach((s, idx) => {
        if (!s.title?.trim()) {
          errors[`services.services.${idx}.title`] = `Service #${idx + 1} title is required.`;
        }
        if (!s.description?.trim()) {
          errors[`services.services.${idx}.description`] = `Service #${idx + 1} description is required.`;
        }
      });
    }

    // 3. Certificate Shortcut Validation
    if (!content.certificateShortcut?.heading?.trim()) {
      errors['certificateShortcut.heading'] = 'Verification banner heading is required.';
    }
    if (!content.certificateShortcut?.placeholder?.trim()) {
      errors['certificateShortcut.placeholder'] = 'Search placeholder is required.';
    }
    if (!content.certificateShortcut?.buttonLabel?.trim()) {
      errors['certificateShortcut.buttonLabel'] = 'Button label is required.';
    }

    // 4. Certification Process Validation
    if (!content.process?.heading?.trim()) {
      errors['process.heading'] = 'Process section heading is required.';
    }
    if (!content.process?.description?.trim()) {
      errors['process.description'] = 'Process section description is required.';
    }
    const steps = content.process?.steps || [];
    if (steps.length === 0) {
      errors['process.steps'] = 'At least one process step is required.';
    } else {
      steps.forEach((step, idx) => {
        if (!step.title?.trim()) {
          errors[`process.steps.${idx}.title`] = `Step #${idx + 1} title is required.`;
        }
        if (!step.description?.trim()) {
          errors[`process.steps.${idx}.description`] = `Step #${idx + 1} description is required.`;
        }
      });
    }

    // 5. Testimonials Validation
    if (!content.testimonials?.heading?.trim()) {
      errors['testimonials.heading'] = 'Testimonials section heading is required.';
    }
    if (!content.testimonials?.description?.trim()) {
      errors['testimonials.description'] = 'Testimonials section description is required.';
    }
    const testimonialsList = content.testimonials?.testimonials || [];
    if (testimonialsList.length === 0) {
      errors['testimonials.items'] = 'At least one testimonial card is required.';
    } else {
      testimonialsList.forEach((t, idx) => {
        if (!t.quote?.trim()) {
          errors[`testimonials.testimonials.${idx}.quote`] = `Testimonial #${idx + 1} quote cannot be empty.`;
        }
        if (!t.personName?.trim()) {
          errors[`testimonials.testimonials.${idx}.personName`] = `Testimonial #${idx + 1} client name is required.`;
        }
      });
    }

    // 6. FAQ Validation
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

    // 7. Consulting CTA Validation
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

    // 8. Footer Validation
    if (!content.footer?.brandHeading?.trim()) {
      errors['footer.brandHeading'] = 'Footer brand heading is required.';
    }
    if (!content.footer?.description?.trim()) {
      errors['footer.description'] = 'Footer description is required.';
    }

    // 9. SEO Validation
    if (content.seo) {
      if (!content.seo.title?.trim()) {
        errors['seo.title'] = 'Meta page title is required.';
      }
      if (!content.seo.description?.trim()) {
        errors['seo.description'] = 'Meta description is required.';
      }
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
      const updated = await updateAdminCmsPage<HomePageContent>('home', formContent);
      setVersion(updated.version);
      setUpdatedBy(updated.updatedBy);
      setUpdatedAt(updated.updatedAt);
      setInitialContent(formContent);
      setSuccessMessage('Home Page content updated successfully.');
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
      const reset = await resetAdminCmsPage<HomePageContent>('home');
      setVersion(reset.version);
      setUpdatedBy(reset.updatedBy);
      setUpdatedAt(reset.updatedAt);
      setFormContent(reset.content);
      setInitialContent(reset.content);
      setIsResetModalOpen(false);
      setValidationErrors({});
      setSuccessMessage('Home Page content has been reset to system defaults.');
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
          Loading Home Page Content Model...
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
        <span>Main Website</span>
        <span>/</span>
        <span className="font-semibold text-[#082046]">Home Page CMS</span>
      </nav>

      {/* Main Header & Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <House size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                Home Page Content Editor
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
              href="/"
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
                  ? 'bg-[#082046] hover:bg-[#0F1B4A] text-white cursor-pointer'
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
            href="#section-home-hero"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Hero
          </a>
          <a
            href="#section-home-services"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Services ({formContent.services?.services?.length || 0})
          </a>
          <a
            href="#section-home-cert-shortcut"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Verify Shortcut
          </a>
          <a
            href="#section-home-process"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Process Steps ({formContent.process?.steps?.length || 0})
          </a>
          <a
            href="#section-home-testimonials"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Testimonials ({formContent.testimonials?.testimonials?.length || 0})
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
            href="#section-home-footer"
            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#082046] transition-colors shrink-0"
          >
            Footer & Legal
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
        <HomeHeroSectionEditor
          id="section-home-hero"
          content={formContent.hero}
          onChange={(hero) => setFormContent((prev) => ({ ...prev, hero }))}
          errors={validationErrors}
        />

        {/* Section 2: Featured Services */}
        <HomeServicesSectionEditor
          id="section-home-services"
          content={formContent.services}
          onChange={(services) => setFormContent((prev) => ({ ...prev, services }))}
          errors={validationErrors}
        />

        {/* Section 3: Certificate Verification Shortcut */}
        <HomeCertificateShortcutEditor
          id="section-home-cert-shortcut"
          content={formContent.certificateShortcut}
          onChange={(certificateShortcut) =>
            setFormContent((prev) => ({ ...prev, certificateShortcut }))
          }
          errors={validationErrors}
        />

        {/* Section 4: Certification Process */}
        <HomeProcessSectionEditor
          id="section-home-process"
          content={formContent.process}
          onChange={(process) => setFormContent((prev) => ({ ...prev, process }))}
          errors={validationErrors}
        />

        {/* Section 5: Client Testimonials */}
        <HomeTestimonialsSectionEditor
          id="section-home-testimonials"
          content={formContent.testimonials}
          onChange={(testimonials) => setFormContent((prev) => ({ ...prev, testimonials }))}
          errors={validationErrors}
        />

        {/* Section 6: FAQ (Reusable CMSFAQEditor) */}
        <CMSFAQEditor
          id="section-faq"
          content={formContent.faq}
          onChange={(faq) => setFormContent((prev) => ({ ...prev, faq }))}
          errors={validationErrors}
        />

        {/* Section 7: Consulting CTA (Reusable CMSCTAEditor) */}
        <CMSCTAEditor
          id="section-cta"
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent((prev) => ({ ...prev, consultingCta }))}
          errors={validationErrors}
        />

        {/* Section 8: Global Footer */}
        <HomeFooterSectionEditor
          id="section-home-footer"
          content={formContent.footer}
          onChange={(footer) => setFormContent((prev) => ({ ...prev, footer }))}
          errors={validationErrors}
        />

        {/* Section 9: SEO & Metadata (Reusable CMSSEOEditor) */}
        <CMSSEOEditor
          id="section-seo"
          content={formContent.seo || defaultHomeSEO}
          onChange={(seo) => setFormContent((prev) => ({ ...prev, seo }))}
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
        pageTitle="Home Page"
        isResetting={isResetting}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
