import React, { useState, useRef } from 'react';
import {
  Handshake,
  Buildings,
  Sparkle,
  Check,
  UploadSimple,
  ArrowsClockwise,
  Trash,
  CheckCircle,
  WarningCircle,
  SpinnerGap,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { uploadAdminCmsImage } from '../../../services/adminCmsService';
import type { AssociationPartner } from '../../../cms/types';

export interface AssociationsPartnersSectionEditorProps {
  partners: AssociationPartner[];
  onChange: (updated: AssociationPartner[]) => void;
  errors?: Record<string, string>;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

interface PartnerLogoEditorProps {
  prefix: string;
  partnerName: string;
  logo: string;
  logoAlt: string;
  websiteUrl: string;
  isGrayscale: boolean;
  onLogoChange: (logoSrc: string, logoAlt?: string) => void;
  onAltChange: (alt: string) => void;
  onWebsiteUrlChange: (url: string) => void;
  onGrayscaleToggle: () => void;
}

const PartnerLogoEditor: React.FC<PartnerLogoEditorProps> = ({
  prefix,
  partnerName,
  logo,
  logoAlt,
  websiteUrl,
  isGrayscale,
  onLogoChange,
  onAltChange,
  onWebsiteUrlChange,
  onGrayscaleToggle,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDirectPath, setShowDirectPath] = useState<boolean>(false);

  const hasLogo = Boolean(logo && logo.trim().length > 0);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    setImageLoadError(false);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError(
        `Unsupported file type (${file.type || 'unknown'}). Please upload JPEG, PNG, WEBP, SVG, or GIF.`
      );
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is 10 MB.`
      );
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadAdminCmsImage(file);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);

      const generatedAlt = logoAlt || `${partnerName || 'Partner'} logo`;
      onLogoChange(result.url, generatedAlt);
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Failed to upload logo. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setImageLoadError(false);
    setUploadError(null);
    setUploadSuccess(false);
    onLogoChange('');
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Top Row: Title + Grayscale Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#082046] uppercase tracking-wider">
          <Buildings size={16} className="text-[#032E64]" />
          <span>Logo & Brand Styling</span>
        </div>

        {/* Grayscale Toggle */}
        <button
          type="button"
          onClick={onGrayscaleToggle}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
            isGrayscale
              ? 'bg-[#082046] text-white border-[#082046] shadow-2xs'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] ${
              isGrayscale ? 'bg-white/20' : 'border border-slate-300'
            }`}
          >
            {isGrayscale && <Check size={12} weight="bold" />}
          </div>
          <span>Use Grayscale Logo (Invert on hover)</span>
        </button>
      </div>

      {/* Main Content: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Column: Logo Preview / Upload */}
        <div>
          {hasLogo ? (
            <div className="border border-[#CBD5E1] bg-white rounded-xl p-3.5 space-y-3 shadow-2xs">
              <div className="relative h-44 sm:h-48 w-full bg-[#F8FAFC] rounded-lg overflow-hidden border border-[#E2E8F0] flex items-center justify-center p-3">
                {!imageLoadError ? (
                  <img
                    src={logo}
                    alt={logoAlt || `${partnerName} logo`}
                    onError={() => setImageLoadError(true)}
                    className={`max-h-full max-w-full object-contain transition-all ${
                      isGrayscale ? 'grayscale contrast-125' : ''
                    }`}
                  />
                ) : (
                  <div className="text-center p-3 text-[#B42318] space-y-1">
                    <WarningCircle size={24} weight="bold" className="mx-auto text-[#FDA29B]" />
                    <p className="text-xs font-semibold">Image failed to load</p>
                    <p className="text-[10px] text-[#64748B]">Verify asset path or replace image</p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-[#082046]/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <SpinnerGap size={26} className="animate-spin text-[#00607A]" />
                    <span className="text-xs font-bold">Uploading new logo...</span>
                  </div>
                )}
              </div>

              {/* Status & Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#027A48] font-bold">
                    <CheckCircle size={14} weight="fill" />
                    <span>Image uploaded</span>
                  </div>
                  {isGrayscale && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Grayscale mode
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <ArrowsClockwise size={14} weight="bold" />
                    <span>Replace Image</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#FEF3F2] border border-[#FDA29B]/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Remove logo"
                  >
                    <Trash size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-44 sm:h-48 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center p-4 ${
                isDragging
                  ? 'border-[#00607A] bg-[#E6F4F8]'
                  : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#082046] hover:bg-[#F1F5F9]'
              }`}
            >
              {isUploading ? (
                <div className="space-y-2 text-[#082046]">
                  <SpinnerGap size={28} className="animate-spin mx-auto text-[#00607A]" />
                  <p className="text-xs font-bold">Uploading logo...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center mx-auto text-[#00607A] shadow-2xs">
                    <UploadSimple size={20} weight="bold" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#082046]">Upload Logo</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">JPEG, PNG, WEBP, SVG • Max 10MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-lg transition-colors shadow-2xs mt-1"
                  >
                    <UploadSimple size={13} weight="bold" />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Image Metadata */}
        <div className="space-y-4">
          {/* Alternative Text */}
          <div>
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1">
              Alternative Text
            </label>
            <input
              id={`${prefix}-logoAlt`}
              type="text"
              value={logoAlt}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="e.g. Dedal certification and inspection logo"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00607A]/20 focus:border-[#00607A] transition-colors"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Describes the image for search engines and screen-reader users.
            </p>
          </div>

          {/* Official Website URL */}
          <div>
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1">
              Official Website URL
            </label>
            <input
              id={`${prefix}-websiteUrl`}
              type="url"
              value={websiteUrl}
              onChange={(e) => onWebsiteUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00607A]/20 focus:border-[#00607A] transition-colors font-mono text-xs"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Outbound link opened in a new tab from card & modal
            </p>
          </div>

          {/* Direct Path Fallback Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowDirectPath(!showDirectPath)}
              className="inline-flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#00607A] font-medium transition-colors"
            >
              <SlidersHorizontal size={12} />
              <span>{showDirectPath ? 'Hide direct asset path' : 'Direct asset path fallback'}</span>
            </button>

            {showDirectPath && (
              <div className="mt-2 p-2.5 bg-white border border-[#CBD5E1] rounded-lg space-y-1">
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Direct Path / URL
                </label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => onLogoChange(e.target.value)}
                  placeholder="/images/associations/dedal.webp"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:outline-none focus:border-[#00607A]"
                />
                <p className="text-[10px] text-[#64748B]">
                  Manual reference for static files (e.g. <code>/images/associations/dedal.webp</code>)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Errors */}
      {uploadError && (
        <div className="p-2.5 bg-[#FEF3F2] border border-[#FDA29B] rounded-lg flex items-center gap-2 text-xs text-[#B42318]">
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export const AssociationsPartnersSectionEditor: React.FC<AssociationsPartnersSectionEditorProps> = ({
  partners = [],
  onChange,
  errors = {},
}) => {
  const handleAddPartner = (): AssociationPartner => {
    const nextOrder = partners.length + 1;
    const newId = `partner-${Date.now()}`;
    return {
      id: newId,
      slug: `partner-${nextOrder}`,
      order: nextOrder,
      name: `New Partner Organization ${nextOrder}`,
      location: '',
      logo: '',
      logoAlt: '',
      useGrayscaleLogo: false,
      grayscaleOnHover: false,
      shortDescription: '',
      profile: {
        overview: '',
        services: [],
        specialties: [],
      },
      websiteUrl: '',
      seo: {
        title: '',
        description: '',
      },
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith('partners.')).length;

  return (
    <CMSSectionCard
      id="section-partners"
      title="Partner & Association Organisations"
      subtitle="Manage partner network cards, logos, grayscale hover effects, and institutional profiles"
      icon={Handshake}
      badge="Partner Network"
      errorCount={errorCount}
    >
      <CMSRepeater<AssociationPartner>
        id="partners-repeater"
        title="Network Partner Cards"
        subtitle="Manage dynamic partner list. Add, edit, reorder, or delete partner organizations."
        items={partners}
        onChange={onChange}
        onAdd={handleAddPartner}
        addButtonLabel="Add Partner Organisation"
        minItems={1}
        allowReorder={true}
        getItemKey={(item, idx) => item.id || item.slug || `partner-${idx}`}
        getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
        renderItemSummary={(item) => (
          <div className="flex items-center justify-between gap-3 pr-2">
            <div className="flex items-center gap-3 min-w-0">
              {item.logo ? (
                <div className="w-10 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-10 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  LOGO
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#082046] truncate">{item.name || 'Untitled Partner'}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">/{item.slug || 'no-slug'}</span>
                </div>
                <p className="text-[11px] text-[#64748B] truncate">
                  {item.location || 'Global / Unspecified'} &bull; {item.shortDescription || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(item.useGrayscaleLogo || item.grayscaleOnHover) && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-300">
                  Grayscale Logo
                </span>
              )}
            </div>
          </div>
        )}
        renderItemForm={(item, index, updateItem) => {
          const prefix = `partners.${index}`;
          const isGrayscale = Boolean(item.useGrayscaleLogo ?? item.grayscaleOnHover);

          const handleFieldChange = <K extends keyof AssociationPartner>(field: K, value: AssociationPartner[K]) => {
            updateItem({
              ...item,
              [field]: value,
            });
          };

          const handleProfileChange = (patch: Partial<NonNullable<AssociationPartner['profile']>>) => {
            updateItem({
              ...item,
              profile: {
                overview: item.profile?.overview || '',
                services: item.profile?.services || [],
                specialties: item.profile?.specialties || [],
                ...patch,
              },
            });
          };

          const handleGrayscaleToggle = () => {
            const nextVal = !isGrayscale;
            updateItem({
              ...item,
              useGrayscaleLogo: nextVal,
              grayscaleOnHover: nextVal,
            });
          };

          const servicesList = item.profile?.services || [];
          const specialtiesList = item.profile?.specialties || [];

          return (
            <div className="space-y-6 pt-2">
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CMSField
                  id={`${prefix}-name`}
                  label="Organisation Name"
                  value={item.name}
                  onChange={(val) => handleFieldChange('name', val)}
                  placeholder="e.g. Dedal"
                  required={true}
                  error={errors[`${prefix}.name`]}
                />

                <CMSField
                  id={`${prefix}-slug`}
                  label="URL Slug"
                  value={item.slug}
                  onChange={(val) => handleFieldChange('slug', val.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                  placeholder="e.g. dedal"
                  required={true}
                  error={errors[`${prefix}.slug`]}
                  description="Used for /associations/:slug modal/route"
                />

                <CMSField
                  id={`${prefix}-location`}
                  label="Headquarters / Location"
                  value={item.location || ''}
                  onChange={(val) => handleFieldChange('location', val)}
                  placeholder="e.g. Burgas, Bulgaria"
                  description="Displays below organization title"
                />
              </div>

              {/* Logo & Grayscale Controls */}
              <PartnerLogoEditor
                prefix={prefix}
                partnerName={item.name}
                logo={item.logo || ''}
                logoAlt={item.logoAlt || ''}
                websiteUrl={item.websiteUrl || ''}
                isGrayscale={isGrayscale}
                onLogoChange={(logoSrc, newAlt) => {
                  updateItem({
                    ...item,
                    logo: logoSrc,
                    ...(newAlt && !item.logoAlt ? { logoAlt: newAlt } : {}),
                  });
                }}
                onAltChange={(alt) => handleFieldChange('logoAlt', alt)}
                onWebsiteUrlChange={(url) => handleFieldChange('websiteUrl', url)}
                onGrayscaleToggle={handleGrayscaleToggle}
              />

              {/* Short Summary Card Copy */}
              <CMSTextarea
                id={`${prefix}-shortDescription`}
                label="Card Short Description"
                value={item.shortDescription || ''}
                onChange={(val) => handleFieldChange('shortDescription', val)}
                placeholder="Brief summary displayed on the main network grid card..."
                required={true}
                maxLength={280}
                rows={2}
                error={errors[`${prefix}.shortDescription`]}
                description="Concise description shown in the initial partner grid card."
              />

              {/* Detailed Profile Section */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#082046] uppercase tracking-wider">
                  <Sparkle size={16} className="text-[#00607A]" />
                  <span>Institutional Profile & Modal Details</span>
                </div>

                <CMSTextarea
                  id={`${prefix}-profile-overview`}
                  label="Full Organisation Overview"
                  value={item.profile?.overview || ''}
                  onChange={(val) => handleProfileChange({ overview: val })}
                  placeholder="Detailed multi-sentence institutional profile shown in the expanded modal dialog..."
                  required={true}
                  maxLength={1000}
                  rows={4}
                  error={errors[`${prefix}.profile.overview`]}
                  description="Main body text rendered inside the partner detail view."
                />

                {/* Service Scope (Comma separated or multi-line) */}
                <CMSField
                  id={`${prefix}-services`}
                  label="Services & Technical Capabilities (Comma-separated)"
                  value={servicesList.join(', ')}
                  onChange={(val) => {
                    const services = val
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    handleProfileChange({ services });
                  }}
                  placeholder="CPR Verification, Factory Production Control, Management System Audits"
                  description="List of capability bullet points displayed in the modal."
                />

                {/* Specialties / Accreditation Focus */}
                <CMSField
                  id={`${prefix}-specialties`}
                  label="Accreditation Focus & Specialties (Comma-separated)"
                  value={specialtiesList.join(', ')}
                  onChange={(val) => {
                    const specialties = val
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    handleProfileChange({ specialties });
                  }}
                  placeholder="Notified Body services, European harmonised standards, Systematic evaluations"
                  description="Secondary bullet points highlighting specific accreditation scopes."
                />
              </div>

              {/* SEO Profile Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <CMSField
                  id={`${prefix}-seo-title`}
                  label="SEO Title Override (Optional)"
                  value={item.seo?.title || ''}
                  onChange={(val) =>
                    handleFieldChange('seo', {
                      ...item.seo,
                      title: val,
                      description: item.seo?.description || '',
                    })
                  }
                  placeholder={`${item.name} Partner Profile | ECAS EURO Associations`}
                />

                <CMSField
                  id={`${prefix}-seo-description`}
                  label="SEO Description Override (Optional)"
                  value={item.seo?.description || ''}
                  onChange={(val) =>
                    handleFieldChange('seo', {
                      ...item.seo,
                      title: item.seo?.title || '',
                      description: val,
                    })
                  }
                  placeholder={`Learn about ${item.name}, technical partner collaborating with ECAS EURO.`}
                />
              </div>
            </div>
          );
        }}
      />
    </CMSSectionCard>
  );
};
