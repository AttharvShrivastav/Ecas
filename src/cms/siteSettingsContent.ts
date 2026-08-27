import type { SiteSettingsContent } from './types';

/**
 * Default Site Settings & Global Contact Information
 *
 * Single Source of Truth for shared contact information across ECASEURO:
 * - Primary Company metadata & Headquarters Address
 * - Global Regional Office Directory
 *
 * Consumers:
 * - Public Contact Page (/contact)
 * - Public Footer
 * - CMS Queries (getContactDetails, getSiteSettings, getContactPageContent)
 */
export const defaultSiteSettingsContent: SiteSettingsContent = {
  company: {
    organizationName: 'ECASEURO Certification & Verification',
    email: 'info@ecaseuro.com',
    phone: '+32 2 808 12 34',
    address: {
      street: 'Avenue Louise 367',
      city: 'Brussels',
      postalCode: '1050',
      country: 'Belgium',
    },
    businessHours: 'Monday – Friday: 08:30 – 17:30 CET',
    emergencyContact: '+32 2 808 12 34',
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
};
