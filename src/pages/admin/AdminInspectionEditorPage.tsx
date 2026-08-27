import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  Clock,
  User,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { fetchAdminCmsPage, updateAdminCmsPage, resetAdminCmsPage } from '../../services/adminCmsService';
import { InspectionHeroEditor } from '../../components/admin/cms/InspectionHeroEditor';
import { InspectionThirdPartyEditor } from '../../components/admin/cms/InspectionThirdPartyEditor';
import { InspectionCapabilitiesEditor } from '../../components/admin/cms/InspectionCapabilitiesEditor';
import { InspectionEquipmentEditor } from '../../components/admin/cms/InspectionEquipmentEditor';
import { InspectionMillEditor } from '../../components/admin/cms/InspectionMillEditor';
import { InspectionLiftingEditor } from '../../components/admin/cms/InspectionLiftingEditor';
import { CMSCTAEditor } from '../../components/admin/cms/CMSCTAEditor';
import { CMSSEOEditor } from '../../components/admin/cms/CMSSEOEditor';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultInspectionPageContent } from '../../cms/inspectionContent';
import type { InspectionPageContent } from '../../cms/types';

export const AdminInspectionEditorPage: React.FC = () => {
  // Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Technical Inspection');
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<InspectionPageContent>(defaultInspectionPageContent);
  const [initialContent, setInitialContent] = useState<InspectionPageContent>(defaultInspectionPageContent);

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
      const data = await fetchAdminCmsPage<InspectionPageContent>('inspection');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'Technical Inspection');
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        const merged: InspectionPageContent = {
          seo: { ...defaultInspectionPageContent.seo, ...(data.content?.seo || {}) },
          hero: { ...defaultInspectionPageContent.hero, ...(data.content?.hero || {}) },
          thirdParty: {
            ...defaultInspectionPageContent.thirdParty,
            ...(data.content?.thirdParty || (data.content as any)?.thirdPartyInspections || {}),
          },
          capabilities: {
            ...defaultInspectionPageContent.capabilities,
            ...(data.content?.capabilities || {}),
          },
          equipmentCoverage: {
            ...defaultInspectionPageContent.equipmentCoverage,
            ...(data.content?.equipmentCoverage || {}),
          },
          millInspection: {
            ...defaultInspectionPageContent.millInspection,
            ...(data.content?.millInspection || {}),
          },
          liftingEquipment: {
            ...defaultInspectionPageContent.liftingEquipment,
            ...(data.content?.liftingEquipment || {}),
          },
          consultingCta: {
            ...defaultInspectionPageContent.consultingCta,
            ...(data.content?.consultingCta || {}),
          },
        };

        setFormContent(merged);
        setInitialContent(merged);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch Inspection page:', err);
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

  const validateForm = (content: InspectionPageContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Hero
    const headingLines = content.hero?.headingLines || [];
    if (headingLines.length === 0 || !headingLines.some((l) => l.trim().length > 0)) {
      errors['hero.headingLines'] = 'At least one non-empty heading line is required.';
    }
    if (!content.hero?.description?.trim()) {
      errors['hero.description'] = 'Hero description is required.';
    }

    // Third Party
    if (!content.thirdParty?.heading?.trim()) {
      errors['thirdParty.heading'] = 'Third-party inspections heading is required.';
    }

    // Capabilities
    if (!content.capabilities?.heading?.trim()) {
      errors['capabilities.heading'] = 'Capabilities heading is required.';
    }

    // Equipment Coverage
    if (!content.equipmentCoverage?.heading?.trim()) {
      errors['equipmentCoverage.heading'] = 'Equipment coverage heading is required.';
    }

    // Mill Inspection
    if (!content.millInspection?.heading?.trim()) {
      errors['millInspection.heading'] = 'Mill inspection heading is required.';
    }

    // Lifting Equipment
    if (!content.liftingEquipment?.heading?.trim()) {
      errors['liftingEquipment.heading'] = 'Lifting equipment heading is required.';
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
      const result = await updateAdminCmsPage<InspectionPageContent>('inspection', formContent);
      if (result) {
        setUpdatedBy(result.updatedBy || 'ADMIN');
        setUpdatedAt(result.updatedAt || new Date().toISOString());
        setInitialContent(formContent);
        setSuccessMessage('Technical Inspection page changes saved and published successfully.');
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
      const result = await resetAdminCmsPage<InspectionPageContent>('inspection');
      if (result) {
        const merged: InspectionPageContent = {
          seo: { ...defaultInspectionPageContent.seo, ...(result.content?.seo || {}) },
          hero: { ...defaultInspectionPageContent.hero, ...(result.content?.hero || {}) },
          thirdParty: {
            ...defaultInspectionPageContent.thirdParty,
            ...(result.content?.thirdParty || (result.content as any)?.thirdPartyInspections || {}),
          },
          capabilities: {
            ...defaultInspectionPageContent.capabilities,
            ...(result.content?.capabilities || {}),
          },
          equipmentCoverage: {
            ...defaultInspectionPageContent.equipmentCoverage,
            ...(result.content?.equipmentCoverage || {}),
          },
          millInspection: {
            ...defaultInspectionPageContent.millInspection,
            ...(result.content?.millInspection || {}),
          },
          liftingEquipment: {
            ...defaultInspectionPageContent.liftingEquipment,
            ...(result.content?.liftingEquipment || {}),
          },
          consultingCta: {
            ...defaultInspectionPageContent.consultingCta,
            ...(result.content?.consultingCta || {}),
          },
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
        <p className="text-sm font-semibold text-[#082046]">Loading Technical Inspection CMS...</p>
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
        <span className="font-semibold text-[#082046]">Technical Inspection CMS</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold">
                <MagnifyingGlass size={20} weight="fill" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight">
                Technical Inspection
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
              href="/services/inspection"
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
        <InspectionHeroEditor
          content={formContent.hero}
          onChange={(hero) => setFormContent({ ...formContent, hero })}
          errors={validationErrors}
        />

        {/* 2. Third-Party Inspections & 4 Lifecycle Stages */}
        <InspectionThirdPartyEditor
          content={formContent.thirdParty}
          onChange={(thirdParty) => setFormContent({ ...formContent, thirdParty })}
          errors={validationErrors}
        />

        {/* 3. Specialized Capabilities */}
        <InspectionCapabilitiesEditor
          content={formContent.capabilities}
          onChange={(capabilities) => setFormContent({ ...formContent, capabilities })}
          errors={validationErrors}
        />

        {/* 4. Equipment Coverage Matrix */}
        <InspectionEquipmentEditor
          content={formContent.equipmentCoverage}
          onChange={(equipmentCoverage) => setFormContent({ ...formContent, equipmentCoverage })}
          errors={validationErrors}
        />

        {/* 5. Mill Inspection & Timeline */}
        <InspectionMillEditor
          content={formContent.millInspection}
          onChange={(millInspection) => setFormContent({ ...formContent, millInspection })}
          errors={validationErrors}
        />

        {/* 6. Lifting Equipment Inspection */}
        <InspectionLiftingEditor
          content={formContent.liftingEquipment}
          onChange={(liftingEquipment) => setFormContent({ ...formContent, liftingEquipment })}
          errors={validationErrors}
        />

        {/* 7. Consulting CTA Banner */}
        <CMSCTAEditor
          id="section-cta"
          title="Consulting CTA Banner"
          subtitle="Bottom-of-page conversion block guiding clients to technical inspection and surveillance proposals"
          content={formContent.consultingCta}
          onChange={(consultingCta) => setFormContent({ ...formContent, consultingCta })}
          errors={validationErrors}
        />

        {/* 8. SEO & Metadata */}
        <CMSSEOEditor
          id="section-seo"
          title="SEO & Metadata"
          subtitle="Search engine indexing, title tags and metadata for Technical Inspection Services"
          defaultTitlePlaceholder="Third-Party Technical Inspection & QA/QC Services | ECAS EURO"
          defaultDescriptionPlaceholder="Independent technical inspection, vendor expediting, mill surveillance, and lifting equipment testing services."
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
                You have unsaved changes in Technical Inspection CMS.
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
        pageTitle="Technical Inspection"
      />
    </div>
  );
};
