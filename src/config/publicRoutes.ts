/**
 * ECASEURO Public Route Registry
 * Centralized source of truth for valid public frontend routes.
 * Used across Admin CMS (CTA Editors, Navigation, Route Selectors, Links).
 */

export interface PublicRouteOption {
  label: string;
  value: string;
  category: 'Primary' | 'Services' | 'Company' | 'Tools' | 'Legal';
  description?: string;
}

export const PUBLIC_ROUTES: PublicRouteOption[] = [
  // Primary Navigation
  { label: 'Home', value: '/', category: 'Primary', description: 'Public homepage' },
  { label: 'About Us', value: '/about', category: 'Company', description: 'About ECASEURO & global presence' },
  { label: 'Verify Certificate', value: '/verify-certificate', category: 'Tools', description: 'Official public certificate registry search' },
  { label: 'Contact Us', value: '/contact', category: 'Company', description: 'Contact & enquiry form' },

  // Service Offerings
  { label: 'ESG Assurance & Support', value: '/services/esg', category: 'Services', description: 'ESG verification and assurance services' },
  { label: 'Management System Certification', value: '/services/management-system-certification', category: 'Services', description: 'ISO standards certification portfolio' },
  { label: 'Product Certification', value: '/services/product-certification', category: 'Services', description: 'CE marking and international product certification' },
  { label: 'Inspection Services', value: '/services/inspection', category: 'Services', description: 'Technical inspection and quality verification' },
  { label: 'CBAM Verification', value: '/services/cbam-verification', category: 'Services', description: 'Carbon border adjustment mechanism verification' },
  { label: 'Training & Development', value: '/services/training', category: 'Services', description: 'Lead auditor and professional training programs' },

  // Network & Insights
  { label: 'Associations & Partners', value: '/associations', category: 'Company', description: 'Global industry associations and accreditations' },
  { label: 'News & Insights', value: '/news', category: 'Company', description: 'Industry articles and regulatory announcements' },

  // Legal & Compliance
  { label: 'Privacy Policy', value: '/privacy-policy', category: 'Legal', description: 'Data privacy notices' },
  { label: 'Terms of Use', value: '/terms-of-use', category: 'Legal', description: 'Terms of service' },
];

/**
 * Helper to get the human-friendly label for a route value
 */
export function getPublicRouteLabel(path: string): string {
  const match = PUBLIC_ROUTES.find((r) => r.value === path);
  if (match) return match.label;
  if (!path) return 'Select Route';
  return path;
}

/**
 * Check if a URL string is an external destination (starts with http:// or https://)
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
}

/**
 * Validate that an external URL has proper format
 */
export function isValidExternalUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
