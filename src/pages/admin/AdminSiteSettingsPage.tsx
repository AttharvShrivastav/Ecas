import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FloppyDisk,
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  Gear,
  Buildings,
  MapPin,
  Globe,
  Clock,
  User,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import {
  fetchAdminCmsPage,
  updateAdminCmsPage,
  resetAdminCmsPage,
} from '../../services/adminCmsService';
import { CMSSectionCard } from '../../components/admin/cms/CMSSectionCard';
import { CMSField } from '../../components/admin/cms/CMSField';
import { CMSRepeater } from '../../components/admin/cms/CMSRepeater';
import { CmsResetConfirmModal } from '../../components/admin/cms/CmsResetConfirmModal';
import { defaultSiteSettingsContent } from '../../cms/siteSettingsContent';
import type { SiteSettingsContent, ContactOffice } from '../../cms/types';

export const AdminSiteSettingsPage: React.FC = () => {
  // Page Server State
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Site Settings & Global Contact');
  const [version, setVersion] = useState<number>(1);
  const [updatedBy, setUpdatedBy] = useState<string>('System Default');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Form State
  const [formContent, setFormContent] = useState<SiteSettingsContent>(defaultSiteSettingsContent);
  const [initialContent, setInitialContent] = useState<SiteSettingsContent>(defaultSiteSettingsContent);

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
      const data = await fetchAdminCmsPage<SiteSettingsContent>('settings');
      if (data) {
        setPageId(data.id);
        setPageTitle(data.title || 'Site Settings & Global Contact');
        setVersion(data.version || 1);
        setUpdatedBy(data.updatedBy || 'ADMIN');
        setUpdatedAt(data.updatedAt || new Date().toISOString());

        // Safe merge fallback
        const mergedContent: SiteSettingsContent = {
          company: {
            ...defaultSiteSettingsContent.company,
            ...(data.content?.company || {}),
            address: {
              ...defaultSiteSettingsContent.company.address,
              ...(data.content?.company?.address || {}),
            },
          },
          offices: Array.isArray(data.content?.offices) && data.content.offices.length > 0
            ? data.content.offices
            : defaultSiteSettingsContent.offices,
        };

        setFormContent(mergedContent);
        setInitialContent(mergedContent);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to fetch Site Settings:', err);
      setErrorMessage(err.message || 'Failed to load Site Settings content from server.');
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
  const validateForm = (content: SiteSettingsContent): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!content.company.organizationName || !content.company.organizationName.trim()) {
      errors['company.organizationName'] = 'Organization name is required.';
    }

    if (!content.company.email || !content.company.email.trim()) {
      errors['company.email'] = 'Primary company email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.company.email.trim())) {
      errors['company.email'] = 'Please provide a valid email address.';
    }

    if (!content.company.phone || !content.company.phone.trim()) {
      errors['company.phone'] = 'Primary phone number is required.';
    }

    if (!content.company.address.city || !content.company.address.city.trim()) {
      errors['company.address.city'] = 'Headquarters city is required.';
    }

    if (!content.company.address.country || !content.company.address.country.trim()) {
      errors['company.address.country'] = 'Headquarters country is required.';
    }

    if (!content.offices || content.offices.length === 0) {
      errors['offices'] = 'At least one regional office must be configured.';
    } else {
      content.offices.forEach((office, index) => {
        if (!office.title || !office.title.trim()) {
          errors[`offices[${index}].title`] = 'Office title is required.';
        }
        if (!office.address?.city || !office.address.city.trim()) {
          errors[`offices[${index}].city`] = 'Office city is required.';
        }
        if (!office.address?.country || !office.address.country.trim()) {
          errors[`offices[${index}].country`] = 'Office country is required.';
        }
      });
    }

    return errors;
  };

  // Form field update helpers
  const handleCompanyChange = (key: string, value: any) => {
    setFormContent((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [key]: value,
      },
    }));
    if (validationErrors[`company.${key}`]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[`company.${key}`];
        return next;
      });
    }
  };

  const handleCompanyAddressChange = (key: string, value: string) => {
    setFormContent((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        address: {
          ...prev.company.address,
          [key]: value,
        },
      },
    }));
    if (validationErrors[`company.address.${key}`]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[`company.address.${key}`];
        return next;
      });
    }
  };

  const handleOfficesChange = (updatedOffices: ContactOffice[]) => {
    // Maintain 1-based order
    const ordered = updatedOffices.map((off, idx) => ({
      ...off,
      order: idx + 1,
    }));
    setFormContent((prev) => ({
      ...prev,
      offices: ordered,
    }));
    if (validationErrors['offices']) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next['offices'];
        return next;
      });
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setFormContent(initialContent);
    setValidationErrors({});
    setErrorMessage(null);
    setSuccessMessage('Unsaved changes discarded.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    const errors = validateForm(formContent);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage('Please correct the validation errors before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await updateAdminCmsPage('settings', formContent);
      if (response) {
        setVersion(response.version);
        setUpdatedBy(response.updatedBy || 'ADMIN');
        setUpdatedAt(response.updatedAt);
        setInitialContent(formContent);
        setSuccessMessage('Site Settings & Global Contact details saved successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to save Site Settings:', err);
      setErrorMessage(err.message || 'An error occurred while saving Site Settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default configuration
  const handleResetToDefaults = async () => {
    setIsResetting(true);
    setErrorMessage(null);
    try {
      const response = await resetAdminCmsPage('settings');
      if (response) {
        setVersion(response.version);
        setUpdatedBy(response.updatedBy || 'SYSTEM_RESET');
        setUpdatedAt(response.updatedAt);
        setFormContent(defaultSiteSettingsContent);
        setInitialContent(defaultSiteSettingsContent);
        setValidationErrors({});
        setIsResetModalOpen(false);
        setSuccessMessage('Site Settings restored to default system values.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('[Admin CMS] Failed to reset Site Settings:', err);
      setErrorMessage(err.message || 'Failed to reset Site Settings.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ArrowClockwise size={32} className="text-[#082046] animate-spin" />
        <p className="text-sm font-medium text-[#64748B]">Loading Site Settings editor...</p>
      </div>
    );
  }

  const companyErrorsCount = Object.keys(validationErrors).filter(
    (k) => k.startsWith('company.')
  ).length;

  const officesErrorsCount = Object.keys(validationErrors).filter(
    (k) => k.startsWith('offices')
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-['DM_Sans']">
      {/* 1. Header & Navigation Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
              <Link to="/admin" className="hover:text-[#082046]">
                ECAS EURO Admin
              </Link>
              <span>/</span>
              <span>Administration</span>
              <span>/</span>
              <span className="text-[#082046]">Site Settings</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#082046] tracking-tight flex items-center gap-2.5">
              <Gear size={24} weight="fill" className="text-[#00607A]" />
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Single source of truth for organization metadata, head office details, and regional office directory across the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Preview Button */}
            <Link
              to="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#082046] rounded-lg transition-colors shadow-2xs"
            >
              <ArrowSquareOut size={15} />
              <span>Preview Contact Page</span>
            </Link>

            {/* Reset to Defaults */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#B42318] bg-white border border-[#E2E8F0] hover:border-[#FECDCA] hover:bg-[#FEF3F2] rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowCounterClockwise size={15} />
              <span>Reset Defaults</span>
            </button>

            {/* Discard changes */}
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
              >
                Discard
              </button>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
                isDirty
                  ? 'bg-[#082046] text-white hover:bg-[#0F1B4A]'
                  : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <ArrowClockwise size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={15} weight="bold" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metadata Status Strip */}
        <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDirty ? 'bg-[#F79009]' : 'bg-[#12B76A]'
                }`}
              />
              <span className="font-medium text-[#334155]">
                {isDirty ? 'Unsaved Changes' : 'All Changes Published'}
              </span>
            </span>

            {updatedAt && (
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#94A3B8]" />
                <span className="text-[#94A3B8]">Updated:</span>
                <span className="font-medium text-[#334155]">
                  {new Date(updatedAt).toLocaleString('en-GB', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </span>
            )}

            {updatedBy && (
              <span className="flex items-center gap-1">
                <User size={13} className="text-[#94A3B8]" />
                <span className="text-[#94A3B8]">By:</span>
                <span className="font-medium text-[#334155]">{updatedBy}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Notification / Alert Banners */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn">
          <CheckCircle size={20} weight="fill" className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn">
          <WarningCircle size={20} weight="fill" className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3. Section 1: Company Profile & Primary Contact */}
      <CMSSectionCard
        id="section-company"
        title="Primary Company & Head Office Information"
        subtitle="Core legal entity and official communications channels used globally"
        icon={Buildings}
        badge="Global Metadata"
        badgeVariant="info"
        errorCount={companyErrorsCount}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CMSField
            label="Organization Name"
            value={formContent.company.organizationName}
            onChange={(val) => handleCompanyChange('organizationName', val)}
            error={validationErrors['company.organizationName']}
            required
            placeholder="e.g. ECAS EURO Certification & Verification"
            description="Official brand and legal registration name"
          />

          <CMSField
            label="Primary Public Email"
            type="email"
            value={formContent.company.email}
            onChange={(val) => handleCompanyChange('email', val)}
            error={validationErrors['company.email']}
            required
            placeholder="e.g. info@ecaseuro.com"
            description="Primary general inbox for inbound enquiries"
          />

          <CMSField
            label="Primary Phone Number"
            type="tel"
            value={formContent.company.phone}
            onChange={(val) => handleCompanyChange('phone', val)}
            error={validationErrors['company.phone']}
            required
            placeholder="e.g. +32 2 808 12 34"
            description="Main switchboard / headquarters telephone"
          />

          <CMSField
            label="Operational / Business Hours"
            value={formContent.company.businessHours || ''}
            onChange={(val) => handleCompanyChange('businessHours', val)}
            placeholder="e.g. Monday – Friday: 08:30 – 17:30 CET"
            description="Standard office hours displayed on footer and contact pages"
          />

          <CMSField
            label="Emergency / Urgent Technical Contact"
            type="tel"
            value={formContent.company.emergencyContact || ''}
            onChange={(val) => handleCompanyChange('emergencyContact', val)}
            placeholder="e.g. +32 2 808 12 34"
            description="Direct hotline for urgent audit, CBAM, or certificate verification matters"
            className="md:col-span-2"
          />
        </div>
      </CMSSectionCard>

      {/* 4. Section 2: Headquarters Physical Address */}
      <CMSSectionCard
        id="section-address"
        title="Headquarters Physical Address"
        subtitle="Registered European headquarters in Brussels, Belgium"
        icon={MapPin}
        badge="Physical Location"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CMSField
            label="Street Address"
            value={formContent.company.address.street}
            onChange={(val) => handleCompanyAddressChange('street', val)}
            placeholder="e.g. Avenue Louise 367"
            className="sm:col-span-2"
          />

          <CMSField
            label="City"
            value={formContent.company.address.city}
            onChange={(val) => handleCompanyAddressChange('city', val)}
            error={validationErrors['company.address.city']}
            required
            placeholder="e.g. Brussels"
          />

          <CMSField
            label="Postal Code"
            value={formContent.company.address.postalCode}
            onChange={(val) => handleCompanyAddressChange('postalCode', val)}
            placeholder="e.g. 1050"
          />

          <CMSField
            label="Country"
            value={formContent.company.address.country}
            onChange={(val) => handleCompanyAddressChange('country', val)}
            error={validationErrors['company.address.country']}
            required
            placeholder="e.g. Belgium"
            className="sm:col-span-2 lg:col-span-4"
          />
        </div>
      </CMSSectionCard>

      {/* 5. Section 3: Global Office Directory & Regional Hubs */}
      <CMSSectionCard
        id="section-offices"
        title="Global Office Directory & Regional Hubs"
        subtitle="Manage the directory of regional offices shown on the public Contact page"
        icon={Globe}
        badge="Public Directory"
        badgeVariant="info"
        errorCount={officesErrorsCount}
      >
        <CMSRepeater<ContactOffice>
          id="offices-repeater"
          title="Regional Offices"
          subtitle="Add, reorder, or update regional offices and international hubs"
          items={formContent.offices}
          onChange={handleOfficesChange}
          onAdd={() => ({
            id: `office-${Date.now()}`,
            title: 'New Regional Office',
            region: 'Regional Operations Hub',
            address: {
              street: '',
              city: 'City Name',
              postalCode: '',
              country: 'Country',
            },
            email: 'office@ecaseuro.com',
            phone: '+32 2 808 12 34',
            order: formContent.offices.length + 1,
          })}
          addButtonLabel="Add Regional Office"
          minItems={1}
          error={validationErrors['offices']}
          getItemKey={(item) => item.id}
          getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
          renderItemSummary={(item) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#082046]">
                  {item.title || 'Untitled Office'}
                </span>
                {item.region && (
                  <span className="ml-2 text-[11px] text-[#64748B] font-medium">
                    • {item.region}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#00607A] font-medium">
                {item.address?.city ? `${item.address.city}, ${item.address.country}` : item.email || ''}
              </span>
            </div>
          )}
          renderItemForm={(item, idx, updateItem) => (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CMSField
                  label="Office Title / Name"
                  value={item.title}
                  onChange={(val) => updateItem({ ...item, title: val })}
                  error={validationErrors[`offices[${idx}].title`]}
                  required
                  placeholder="e.g. Brussels / Head Office or India Office"
                />

                <CMSField
                  label="Region / Hub Designation"
                  value={item.region || ''}
                  onChange={(val) => updateItem({ ...item, region: val })}
                  placeholder="e.g. European Operations or South Asia Regional Hub"
                />

                <CMSField
                  label="Street Address"
                  value={item.address?.street || ''}
                  onChange={(val) =>
                    updateItem({
                      ...item,
                      address: {
                        city: item.address?.city || '',
                        country: item.address?.country || '',
                        postalCode: item.address?.postalCode || '',
                        ...item.address,
                        street: val,
                      },
                    })
                  }
                  placeholder="e.g. Avenue Louise 367"
                  className="md:col-span-2"
                />

                <CMSField
                  label="City"
                  value={item.address?.city || ''}
                  onChange={(val) =>
                    updateItem({
                      ...item,
                      address: {
                        street: item.address?.street || '',
                        country: item.address?.country || '',
                        postalCode: item.address?.postalCode || '',
                        ...item.address,
                        city: val,
                      },
                    })
                  }
                  error={validationErrors[`offices[${idx}].city`]}
                  required
                  placeholder="e.g. Brussels or Mumbai"
                />

                <CMSField
                  label="Postal Code"
                  value={item.address?.postalCode || ''}
                  onChange={(val) =>
                    updateItem({
                      ...item,
                      address: {
                        street: item.address?.street || '',
                        city: item.address?.city || '',
                        country: item.address?.country || '',
                        ...item.address,
                        postalCode: val,
                      },
                    })
                  }
                  placeholder="e.g. 1050"
                />

                <CMSField
                  label="Country"
                  value={item.address?.country || ''}
                  onChange={(val) =>
                    updateItem({
                      ...item,
                      address: {
                        street: item.address?.street || '',
                        city: item.address?.city || '',
                        postalCode: item.address?.postalCode || '',
                        ...item.address,
                        country: val,
                      },
                    })
                  }
                  error={validationErrors[`offices[${idx}].country`]}
                  required
                  placeholder="e.g. Belgium or India"
                  className="md:col-span-2"
                />

                <CMSField
                  label="Office Public Email"
                  type="email"
                  value={item.email || ''}
                  onChange={(val) => updateItem({ ...item, email: val })}
                  placeholder="e.g. info@ecaseuro.com"
                />

                <CMSField
                  label="Office Direct Phone"
                  type="tel"
                  value={item.phone || ''}
                  onChange={(val) => updateItem({ ...item, phone: val })}
                  placeholder="e.g. +32 2 808 12 34"
                />
              </div>
            </div>
          )}
        />
      </CMSSectionCard>

      {/* 6. Sticky Bottom Action Bar (when unsaved) */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#082046] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-4 animate-slideUp">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#F79009] animate-pulse" />
            <span className="font-semibold">Unsaved changes in Site Settings</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#082046] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isSaving ? (
                <>
                  <ArrowClockwise size={14} className="animate-spin" />
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
      )}

      {/* 7. Reset Confirm Modal */}
      <CmsResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetToDefaults}
        pageTitle="Site Settings & Global Contact"
        isResetting={isResetting}
      />
    </div>
  );
};
