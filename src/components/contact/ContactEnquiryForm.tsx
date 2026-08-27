import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, WarningCircle, CircleNotch } from '@phosphor-icons/react';
import { Button } from '../primitives/Button';
import { submitEnquiry } from '../../cms/enquiryAdapter';
import type { ContactFormConfig, ContactEnquiry } from '../../cms/types';

export interface ContactEnquiryFormProps {
  config: ContactFormConfig;
}

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  enquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
  general?: string;
}

const initialFormState: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  enquiryType: '',
  message: '',
};

export const ContactEnquiryForm: React.FC<ContactEnquiryFormProps> = ({ config }) => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Pre-fill enquiry type or context from search parameters
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const schemeParam = searchParams.get('scheme');

    if (serviceParam || schemeParam) {
      let matchedType = '';
      if (serviceParam?.includes('product') || schemeParam) {
        matchedType = 'Product Certification';
      } else if (serviceParam?.includes('management')) {
        matchedType = 'Management System Certification';
      } else if (serviceParam?.includes('training')) {
        matchedType = 'Training';
      } else if (serviceParam?.includes('esg')) {
        matchedType = 'ESG';
      } else if (serviceParam?.includes('cbam')) {
        matchedType = 'CBAM Verification';
      } else if (serviceParam?.includes('inspection')) {
        matchedType = 'Inspection';
      }

      setFormData((prev) => {
        let prefilledMessage = prev.message;
        if (!prefilledMessage && schemeParam) {
          const schemeFormatted = schemeParam
            .split('-')
            .map((w) => w.toUpperCase())
            .join(' ');
          prefilledMessage = `We would like to enquire about ${schemeFormatted} conformity requirements for our products.`;
        }

        return {
          ...prev,
          enquiryType: matchedType || prev.enquiryType,
          message: prefilledMessage,
        };
      });
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.enquiryType.trim()) {
      newErrors.enquiryType = 'Please select an enquiry type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your enquiry';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for the active field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: ContactEnquiry = {
        name: formData.name.trim(),
        company: formData.company.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        country: formData.country.trim() || undefined,
        enquiryType: formData.enquiryType,
        message: formData.message.trim(),
        sourcePage: window.location.pathname,
        submittedAt: new Date().toISOString(),
        status: 'new',
      };

      const result = await submitEnquiry(payload);

      if (result.success) {
        setIsSubmitted(true);
        setSubmissionId(result.enquiryId || null);
      } else {
        setErrors({
          general: result.message || 'Unable to submit enquiry. Please try again.',
        });
      }
    } catch {
      setErrors({
        general: 'A network error occurred. Please try again shortly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitted(false);
    setSubmissionId(null);
  };

  return (
    <div
      id="enquiry-form-card"
      className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-xs relative overflow-hidden"
    >
      {isSubmitted ? (
        /* Restrained Success State */
        <div
          role="status"
          aria-live="polite"
          className="py-10 sm:py-16 flex flex-col items-center text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-[#EBF3FC] text-[#032E64] flex items-center justify-center mb-6">
            <CheckCircle size={40} weight="fill" />
          </div>

          <h3 className="text-xl sm:text-2xl font-normal text-[#082046] tracking-tight">
            {config.successMessage.title}
          </h3>

          <p className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed">
            {config.successMessage.description}
          </p>

          {submissionId && (
            <p className="mt-4 text-xs text-[#94A3B8] font-mono">
              Reference: <span className="text-[#64748B]">{submissionId}</span>
            </p>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#032E64]/20"
            >
              {config.successMessage.actionLabel}
            </button>
          </div>
        </div>
      ) : (
        /* Primary Enquiry Form */
        <div>
          {/* Form Header */}
          {config.heading && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-normal text-[#082046] tracking-tight">
                {config.heading}
              </h3>
              {config.description && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {config.description}
                </p>
              )}
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <WarningCircle size={20} weight="fill" className="shrink-0 text-red-500 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Grid Row 1: Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className={`w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-400 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-[#CBD5E1] focus:ring-[#032E64]/20 focus:border-[#032E64]'
                  }`}
                />
                {errors.name && (
                  <p id="contact-name-error" className="text-xs text-red-600 mt-1.5" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-company"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Company / Organisation
                </label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corporation"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 focus:border-[#032E64] transition-all"
                />
              </div>
            </div>

            {/* Grid Row 2: Work Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  className={`w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-400 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-[#CBD5E1] focus:ring-[#032E64]/20 focus:border-[#032E64]'
                  }`}
                />
                {errors.email && (
                  <p id="contact-email-error" className="text-xs text-red-600 mt-1.5" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 focus:border-[#032E64] transition-all"
                />
              </div>
            </div>

            {/* Grid Row 3: Country & Enquiry Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label
                  htmlFor="contact-country"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Country / Region
                </label>
                <input
                  id="contact-country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. Belgium, India, UAE"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#032E64]/20 focus:border-[#032E64] transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-enquiry-type"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
                >
                  Enquiry Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="contact-enquiry-type"
                    name="enquiryType"
                    required
                    value={formData.enquiryType}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={Boolean(errors.enquiryType)}
                    aria-describedby={
                      errors.enquiryType ? 'contact-enquiry-type-error' : undefined
                    }
                    className={`w-full h-11 sm:h-12 px-4 rounded-xl bg-[#F8FAFC] border text-sm text-[#082046] focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                      errors.enquiryType
                        ? 'border-red-400 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-[#CBD5E1] focus:ring-[#032E64]/20 focus:border-[#032E64]'
                    }`}
                  >
                    <option value="" disabled>
                      Select an option...
                    </option>
                    {config.enquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {/* Custom Dropdown Chevron Indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.enquiryType && (
                  <p
                    id="contact-enquiry-type-error"
                    className="text-xs text-red-600 mt-1.5"
                    role="alert"
                  >
                    {errors.enquiryType}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold uppercase tracking-wider text-[#082046] mb-1.5"
              >
                Message / Scope of Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe the certification, standard, inspection scope or timeline required..."
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className={`w-full min-h-[110px] p-4 rounded-xl bg-[#F8FAFC] border text-sm text-[#082046] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all resize-y ${
                  errors.message
                    ? 'border-red-400 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-[#CBD5E1] focus:ring-[#032E64]/20 focus:border-[#032E64]'
                }`}
              />
              {errors.message && (
                <p id="contact-message-error" className="text-xs text-red-600 mt-1.5" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <CircleNotch size={18} className="animate-spin" />
                    <span>SUBMITTING...</span>
                  </span>
                ) : (
                  config.submitButtonLabel || 'SUBMIT ENQUIRY'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
