import type { ContactEnquiry, EnquirySubmissionResult } from './types';

/**
 * Enquiry Submission Adapter Interface
 *
 * Decoupled abstraction for receiving contact enquiries from public forms.
 * Connects the public frontend contact form to the real backend database API.
 */
export interface EnquiryAdapter {
  submit(enquiry: ContactEnquiry): Promise<EnquirySubmissionResult>;
}

/**
 * Real Backend REST API Enquiry Adapter
 *
 * Transmits enquiry payload to /api/enquiries endpoint for permanent
 * SQLite database storage and administrative management.
 */
export class ApiEnquiryAdapter implements EnquiryAdapter {
  async submit(enquiry: ContactEnquiry): Promise<EnquirySubmissionResult> {
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name: enquiry.name,
        company: enquiry.company,
        email: enquiry.email,
        phone: enquiry.phone,
        country: enquiry.country,
        enquiryType: enquiry.enquiryType,
        message: enquiry.message,
        sourcePage: enquiry.sourcePage,
      }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        return {
          success: true,
          message: result.message || 'Thank you. Your enquiry has been received.',
          enquiryId: result.enquiryId,
        };
      }

      const errorMessage =
        result?.error?.message ||
        result?.message ||
        'Unable to process your enquiry. Please check your submission.';

      return {
        success: false,
        message: errorMessage,
        errors: result?.error?.errors,
      };
    } catch (err: any) {
      console.error('[eCAS Euro Enquiry Adapter] Network error submitting enquiry:', err);
      return {
        success: false,
        message: 'A network communication error occurred. Please try again shortly.',
      };
    }
  }
}

/**
 * Development Mock Enquiry Adapter (Retained for testing & fallback scenarios)
 */
export class MockEnquiryAdapter implements EnquiryAdapter {
  async submit(enquiry: ContactEnquiry): Promise<EnquirySubmissionResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (
      !enquiry.name?.trim() ||
      !enquiry.email?.trim() ||
      !enquiry.enquiryType?.trim() ||
      !enquiry.message?.trim()
    ) {
      return {
        success: false,
        message: 'Please complete all required fields.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enquiry.email.trim())) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    const enquiryId = `ENQ-${Date.now()}`;
    return {
      success: true,
      message: 'Thank you. Your enquiry has been received.',
      enquiryId,
    };
  }
}

/**
 * Default global adapter instance (pointing to real Backend API)
 */
export const defaultEnquiryAdapter: EnquiryAdapter = new ApiEnquiryAdapter();

/**
 * Public dispatch function to submit an enquiry
 */
export async function submitEnquiry(
  enquiry: ContactEnquiry,
  adapter: EnquiryAdapter = defaultEnquiryAdapter
): Promise<EnquirySubmissionResult> {
  return adapter.submit(enquiry);
}
