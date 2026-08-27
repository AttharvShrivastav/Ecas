import type { ContactPageContent } from './types';

/**
 * Default Contact Page Content (CMS-ready)
 *
 * Source of Truth for /contact
 * Decoupled data model for easy CMS synchronization.
 */
export const defaultContactPageContent: ContactPageContent = {
  seo: {
    title: 'Contact Us | Start a Conversation | ECASEURO',
    description:
      'Start a conversation with ECASEURO. Contact our European headquarters in Brussels or our regional offices in India and the Gulf for ISO certification, inspection, training, and ESG verification support.',
    keywords: [
      'Contact ECASEURO',
      'ISO certification enquiry',
      'Brussels headquarters',
      'India office',
      'Gulf office',
      'ESG compliance consulting',
    ],
  },
  hero: {
    headingLines: ['Start a conversation.'],
    description:
      'Tell us what you need support with and our team will help you understand the next steps.',
  },
  intro: {
    heading: 'Talk to our team',
    description:
      'Reach out directly to our European headquarters or regional hubs for technical compliance, ISO management system certification, and inspection enquiries.',
  },
  offices: [
    {
      id: 'brussels-head-office',
      title: 'Brussels / Head Office',
      region: 'European Operations',
      address: {
        street: 'Avenue Louise 367',
        city: 'Brussels',
        postalCode: '1050',
        country: 'Belgium',
      },
      email: 'info@ecaseuro.com',
      phone: '+32 2 808 12 34',
      order: 1,
    },
    {
      id: 'india-office',
      title: 'India Office',
      region: 'South Asia Regional Hub',
      address: {
        city: 'Mumbai',
        country: 'India',
      },
      email: 'india@ecaseuro.com',
      phone: '+91 22 6120 4000',
      order: 2,
    },
    {
      id: 'gulf-office',
      title: 'Gulf Office',
      region: 'Middle East Regional Hub',
      address: {
        city: 'Dubai / Doha',
        country: 'UAE & Qatar',
      },
      email: 'gulf@ecaseuro.com',
      phone: '+971 4 380 9000',
      order: 3,
    },
  ],
  form: {
    heading: 'Send an Enquiry',
    description:
      'Complete the form below and an ECASEURO compliance specialist will respond within one business day.',
    enquiryTypes: [
      'Management System Certification',
      'Product Certification',
      'Inspection',
      'Training',
      'ESG',
      'CBAM Verification',
      'Association / Partnership',
      'Other',
    ],
    submitButtonLabel: 'SUBMIT ENQUIRY',
    successMessage: {
      title: 'Thank you. Your enquiry has been received.',
      description:
        'An ECASEURO technical specialist will review your request and get back to you shortly.',
      actionLabel: 'SUBMIT ANOTHER ENQUIRY',
    },
  },
};
