import React, { useState, useRef, useEffect } from 'react';
import {
  UploadSimple,
  Trash,
  CheckCircle,
  WarningCircle,
  SpinnerGap,
  ArrowsClockwise,
  SlidersHorizontal,
  ArrowsOutSimple,
  CornersIn,
} from '@phosphor-icons/react';
import type { ImageAsset } from '../../../cms/types';
import { uploadAdminCmsImage } from '../../../services/adminCmsService';

export interface CMSImageFieldProps {
  id?: string;
  value?: ImageAsset | string;
  onChange: (updated: ImageAsset) => void;
  error?: string;
  label?: string;
  helperText?: string;
  showCaption?: boolean;
  className?: string;
  defaultSrcPlaceholder?: string;
  defaultAltPlaceholder?: string;
  maxSizeBytes?: number;
}

const DEFAULT_IMAGE_ASSET: ImageAsset = { src: '', alt: '' };
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

/**
 * Robust normalizer for CMS image paths:
 * Ensures absolute root slash for relative images and preserves external/data URLs.
 */
export function normalizeImageSrc(rawSrc?: string | null): string {
  if (!rawSrc) return '';
  const trimmed = rawSrc.trim();
  if (!trimmed) return '';

  // External URLs, Data URLs, Blob URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('//')
  ) {
    return trimmed;
  }

  // Ensure root-relative slash
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export const CMSImageField: React.FC<CMSImageFieldProps> = ({
  id,
  value = DEFAULT_IMAGE_ASSET,
  onChange,
  error,
  label = 'Image Asset',
  helperText,
  showCaption = false,
  className = '',
  defaultSrcPlaceholder = '/images/... or /uploads/cms/...',
  defaultAltPlaceholder = 'Descriptive alternative text for accessibility',
  maxSizeBytes = DEFAULT_MAX_SIZE,
}) => {
  // Extract typed fields supporting both object ImageAsset and legacy string values
  const currentSrc =
    typeof value === 'string'
      ? value
      : value?.src || (value as any)?.url || '';
  const currentAlt =
    typeof value === 'object' && value ? value.alt || '' : '';
  const currentCaption =
    typeof value === 'object' && value ? value.caption || '' : '';

  const normalizedSrc = normalizeImageSrc(currentSrc);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDirectPathInput, setShowDirectPathInput] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize load error state whenever source path changes
  useEffect(() => {
    setImageLoadError(false);
    setUploadError(null);
  }, [normalizedSrc]);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    setImageLoadError(false);

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError(
        `Unsupported file type (${file.type || 'unknown'}). Please upload JPEG, PNG, WEBP, SVG, or GIF.`
      );
      return;
    }

    // Validate size limit
    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      setUploadError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is ${maxMb} MB.`
      );
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadAdminCmsImage(file);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);

      // Preserve existing alt text and caption while setting newly uploaded src
      onChange({
        src: result.url,
        alt: currentAlt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        caption: currentCaption,
      });
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    // Reset file input value so selecting the same file again triggers change
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

  const handleRemoveImage = () => {
    setImageLoadError(false);
    setUploadError(null);
    setUploadSuccess(false);
    onChange({
      src: '',
      alt: currentAlt,
      caption: currentCaption,
    });
  };

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLoadError(false);
    setUploadError(null);
    onChange({
      src: e.target.value,
      alt: currentAlt,
      caption: currentCaption,
    });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      src: currentSrc,
      alt: e.target.value,
      caption: currentCaption,
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      src: currentSrc,
      alt: currentAlt,
      caption: e.target.value,
    });
  };

  const hasImage = Boolean(normalizedSrc && normalizedSrc.trim().length > 0);
  const isUploadedCmsAsset = normalizedSrc.startsWith('/uploads/');
  const isExternalAsset =
    normalizedSrc.startsWith('http://') ||
    normalizedSrc.startsWith('https://') ||
    normalizedSrc.startsWith('//');

  return (
    <div id={id} className={`space-y-3.5 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Label and Helper Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {label && (
            <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
              {label}
            </label>
          )}
          {helperText && (
            <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{helperText}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDirectPathInput(!showDirectPathInput)}
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#082046] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          title="Toggle direct path manual input"
        >
          <SlidersHorizontal size={12} weight="bold" />
          <span>{showDirectPathInput ? 'Hide Path' : 'Direct Path'}</span>
        </button>
      </div>

      {/* Upload Zone & Visual Preview Area */}
      <div className="space-y-3.5">
        {/* Preview Card or Upload Dropzone */}
        {hasImage ? (
          <div className="border border-[#CBD5E1] bg-white rounded-xl p-3.5 space-y-3 shadow-2xs">
            <div className="relative aspect-video max-h-56 w-full bg-[#082046]/5 rounded-lg overflow-hidden border border-[#E2E8F0] flex items-center justify-center group">
              {!imageLoadError ? (
                <img
                  key={normalizedSrc}
                  src={normalizedSrc}
                  alt={currentAlt || 'Image Preview'}
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                  className={`w-full h-full transition-all duration-200 ${
                    fitMode === 'contain'
                      ? 'object-contain p-2'
                      : 'object-cover object-center'
                  }`}
                />
              ) : (
                <div className="text-center p-3 text-[#B42318] space-y-1.5">
                  <WarningCircle
                    size={22}
                    weight="bold"
                    className="mx-auto text-[#FDA29B]"
                  />
                  <p className="text-xs font-semibold">Image failed to load</p>
                  <p className="text-[10px] text-[#64748B] font-mono break-all max-w-[240px] mx-auto">
                    {normalizedSrc}
                  </p>
                </div>
              )}

              {/* Fit Mode Toggle Overlay */}
              {!imageLoadError && (
                <button
                  type="button"
                  onClick={() =>
                    setFitMode(fitMode === 'cover' ? 'contain' : 'cover')
                  }
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-[#082046]/75 hover:bg-[#082046] text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-[10px] flex items-center gap-1 cursor-pointer"
                  title={fitMode === 'cover' ? 'Switch to Contain' : 'Switch to Cover'}
                >
                  {fitMode === 'cover' ? (
                    <>
                      <CornersIn size={12} weight="bold" />
                      <span className="font-medium">Contain</span>
                    </>
                  ) : (
                    <>
                      <ArrowsOutSimple size={12} weight="bold" />
                      <span className="font-medium">Cover</span>
                    </>
                  )}
                </button>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-[#082046]/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <SpinnerGap size={24} className="animate-spin text-[#00607A]" />
                  <span className="text-xs font-semibold">
                    Uploading new image...
                  </span>
                </div>
              )}
            </div>

            {/* Status and Filename */}
            <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
              <span
                className="truncate text-[#64748B] font-mono text-[11px] max-w-[220px]"
                title={normalizedSrc}
              >
                {normalizedSrc.split('/').pop() || normalizedSrc}
              </span>
              {uploadSuccess ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#027A48]/20 shrink-0">
                  <CheckCircle size={11} weight="fill" /> Uploaded
                </span>
              ) : isUploadedCmsAsset ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4F8] text-[#00607A] border border-[#00607A]/20 shrink-0">
                  <CheckCircle size={11} weight="bold" /> CMS Upload
                </span>
              ) : isExternalAsset ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] shrink-0">
                  <CheckCircle size={11} weight="bold" /> Web URL
                </span>
              ) : !imageLoadError ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#027A48]/20 shrink-0">
                  <CheckCircle size={11} weight="bold" /> Static Asset
                </span>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-[#F1F5F9]">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowsClockwise size={13} weight="bold" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={handleRemoveImage}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#FEF3F2] border border-[#FDA29B]/60 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Remove image"
              >
                <Trash size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
              isDragging
                ? 'border-[#00607A] bg-[#E6F4F8]'
                : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#082046] hover:bg-[#F1F5F9]'
            }`}
          >
            {isUploading ? (
              <div className="space-y-2 text-[#082046]">
                <SpinnerGap
                  size={28}
                  className="animate-spin mx-auto text-[#00607A]"
                />
                <p className="text-xs font-bold">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center mx-auto text-[#00607A] shadow-2xs">
                  <UploadSimple size={20} weight="bold" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#082046]">
                    Click or drag image to upload
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    JPEG, PNG, WEBP, SVG • Max 10MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-md transition-colors shadow-2xs mt-1 cursor-pointer"
                >
                  <UploadSimple size={13} weight="bold" />
                  <span>Select File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alternative Text Field */}
        <div>
          <label className="block text-[11px] font-bold text-[#082046] uppercase tracking-wider mb-1">
            Alternative Text (SEO & Accessibility)
          </label>
          <input
            type="text"
            value={currentAlt}
            onChange={handleAltChange}
            placeholder={defaultAltPlaceholder}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00607A]/20 focus:border-[#00607A] transition-colors"
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Describes the image for search engines and screen-reader users.
          </p>
        </div>

        {/* Optional Caption Field */}
        {showCaption && (
          <div>
            <label className="block text-[11px] font-bold text-[#082046] uppercase tracking-wider mb-1">
              Image Caption (Optional)
            </label>
            <input
              type="text"
              value={currentCaption}
              onChange={handleCaptionChange}
              placeholder="Editorial caption displayed below the image"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00607A]/20 focus:border-[#00607A] transition-colors"
            />
          </div>
        )}

        {/* Direct Path Input (Revealed on Toggle) */}
        {showDirectPathInput && (
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Direct Asset Path / URL
              </label>
              <span className="text-[10px] text-[#64748B] font-mono">
                Manual Override
              </span>
            </div>
            <input
              type="text"
              value={currentSrc}
              onChange={handleSrcChange}
              placeholder={defaultSrcPlaceholder}
              className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#082046] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
            />
            <p className="text-[10px] text-[#64748B]">
              Manual reference for static files (e.g.{' '}
              <code className="bg-white px-1 py-0.5 rounded border border-[#CBD5E1]">/images/inspection/third-party-inspection.webp</code>) or external URLs.
            </p>
          </div>
        )}
      </div>

      {/* Errors & Alerts */}
      {uploadError && (
        <div className="p-2.5 bg-[#FEF3F2] border border-[#FDA29B] rounded-lg flex items-center gap-2 text-xs text-[#B42318]">
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {error && !uploadError && (
        <p className="text-xs text-[#B42318] font-medium">{error}</p>
      )}
    </div>
  );
};
