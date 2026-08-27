import type {
  HomeHeroContent,
  HomeServicesSectionContent,
  CertificateShortcutContent,
  HomeCertificationProcessContent,
  HomeTestimonialsContent,
  HomeFAQContent,
  HomeConsultingCTAContent,
  FooterContent,
  HomePageContent,
  SEOData,
} from './types';

/**
 * Default Homepage Hero Content
 *
 * CMS-ready content source of truth matching approved Figma copy.
 * Directly extensible for future headless CMS synchronization.
 */
export const defaultHomeHeroContent: HomeHeroContent = {
  headingLines: [
    'Certification.',
    'Inspection.',
    'Training',
    'Compliance, Assured.',
  ],
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  globeAsset: {
    src: '/images/home/hero-globe.webp',
    alt: 'ECASEURO Global Compliance and Certification Network',
  },
};

/**
 * Default Homepage Featured Services Section Content
 *
 * Source of truth: Approved Figma "Certification and compliance support for your organisation"
 */
export const defaultHomeServicesContent: HomeServicesSectionContent = {
  heading: 'Certification and\ncompliance support\nfor your organisation',
  description:
    'ECASEURO provides certification, inspection and training services that help organisations demonstrate compliance.',
  cta: {
    label: 'EXPLORE ALL SERVICES',
    href: '/services',
    variant: 'primary',
  },
  services: [
    {
      id: 'management-system-certification',
      title: 'Management System Certification',
      description:
        'Certification services for quality, environmental, health and safety, information security, and food safety management.',
      href: '/services/management-system-certification',
      visualType: 'management-system',
      metadata: {
        statusText: 'Compliance on track',
        statNumber: '84',
        statUnit: '%',
        chips: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      },
    },
    {
      id: 'product-certification',
      title: 'Product Certification',
      description:
        'Support for demonstrating that products meet applicable technical, safety and market-entry requirements.',
      href: '/services/product-certification',
      visualType: 'product-certification',
      metadata: {
        statusText: 'Approval in progress',
        chips: ['Application', 'Review', 'Approval'],
      },
    },
    {
      id: 'training',
      title: 'Training',
      description:
        'Practical programmes for professionals responsible for implementing, managing and auditing recognised standards.',
      href: '/services/training',
      visualType: 'training',
      metadata: {
        statusText: 'Learning pathways',
        chips: ['Lead Auditor', 'Internal Auditor', 'Awareness', 'Implementation'],
      },
    },
  ],
};

/**
 * Default Homepage Certificate Verification CTA Shortcut Content
 *
 * Source of truth: Approved Figma "Verify an ECASEURO certificate" Banner
 */
export const defaultCertificateShortcutContent: CertificateShortcutContent = {
  heading: 'Verify an ECASEURO\ncertificate',
  placeholder: 'EXAMPLE- IND/02/678505',
  buttonLabel: 'VERIFY TODAY',
};

/**
 * Default Homepage Certification Process Content
 *
 * Source of truth: Approved Figma "A clear path from Enquiry to Certification" section
 */
export const defaultCertificationProcessContent: HomeCertificationProcessContent = {
  heading: 'A clear path from\nEnquiry to Certification',
  description:
    'We keep every stage structured and transparent, helping your organisation understand the requirements, prepare for assessment and move forward with confidence.',
  steps: [
    {
      number: '01',
      title: 'Enquiry and Scope',
      description:
        'Share your organisation’s details, required standard and intended certification scope.',
    },
    {
      number: '02',
      title: 'Application Review',
      description:
        'We review the submitted information and confirm the applicable requirements and next steps.',
    },
    {
      number: '03',
      title: 'Audit Planning',
      description:
        'The assessment scope, schedule and audit arrangements are prepared in coordination with your team.',
    },
    {
      number: '04',
      title: 'Assessment',
      description:
        'Our professionals evaluate the organisation against the applicable standard and agreed scope.',
    },
    {
      number: '05',
      title: 'Certification and Continued Support',
      description:
        'Findings are reviewed, the certification decision is communicated, and ongoing surveillance is planned where applicable.',
    },
  ],
};

/**
 * Default Homepage Testimonials Content
 *
 * Source of truth: Approved Figma "See what our clients say about us" section
 */
export const defaultTestimonialsContent: HomeTestimonialsContent = {
  heading: 'See what our clients\nsay about us',
  description:
    'We focus on clear communication, professional assessments and a structured service experience from initial enquiry through completion.',
  testimonials: [
    {
      id: 'testimonial-1',
      quote:
        'We await you every year for our audits as they are learning experience',
      personName: 'Mr Rahul Mehta',
      organisation: 'ADPICO',
    },
    {
      id: 'testimonial-2',
      quote:
        'We await you every year for our audits as they are learning experience',
      personName: 'Mr Rahul Mehta',
      organisation: 'ADPICO',
    },
    {
      id: 'testimonial-3',
      quote:
        'We await you every year for our audits as they are learning experience',
      personName: 'Mr Rahul Mehta',
      organisation: 'ADPICO',
    },
    {
      id: 'testimonial-4',
      quote:
        'We await you every year for our audits as they are learning experience',
      personName: 'Mr Rahul Mehta',
      organisation: 'ADPICO',
    },
  ],
};

/**
 * Default Homepage FAQ Content
 *
 * Source of truth: Approved Figma "Commonly Asked Questions" section
 */
export const defaultFAQContent: HomeFAQContent = {
  heading: 'Commonly Asked\nQuestions',
  description:
    'Find straightforward answers about the certification process, timelines and getting started.',
  items: [
    {
      id: 'faq-1',
      number: '01',
      question: 'What information is required to request certification?',
      answer:
        'We generally require information about your organisation, locations, activities, employee strength and the certification scope. The exact requirements may vary by service.',
    },
    {
      id: 'faq-2',
      number: '02',
      question: 'What information is required to request certification?',
      answer:
        'We generally require information about your organisation, locations, activities, employee strength and the certification scope. The exact requirements may vary by service.',
    },
    {
      id: 'faq-3',
      number: '03',
      question: 'Which Certificate Standard is right for our organization?',
      answer:
        'Our specialists evaluate your operational profile, industry sector, client expectations, and regulatory framework to identify the optimal ISO or management standard.',
    },
    {
      id: 'faq-4',
      number: '04',
      question: 'Which Certificate Standard is right for our organization?',
      answer:
        'Our specialists evaluate your operational profile, industry sector, client expectations, and regulatory framework to identify the optimal ISO or management standard.',
    },
    {
      id: 'faq-5',
      number: '05',
      question: 'Which Certificate Standard is right for our organization?',
      answer:
        'Our specialists evaluate your operational profile, industry sector, client expectations, and regulatory framework to identify the optimal ISO or management standard.',
    },
    {
      id: 'faq-6',
      number: '06',
      question: 'Which Certificate Standard is right for our organization?',
      answer:
        'Our specialists evaluate your operational profile, industry sector, client expectations, and regulatory framework to identify the optimal ISO or management standard.',
    },
  ],
};

/**
 * Default Final Consulting CTA Content
 *
 * Source of truth: Approved Figma "Need Expert Help?" CTA banner
 */
export const defaultConsultingCTAContent: HomeConsultingCTAContent = {
  heading: 'Need Expert Help?\nGet free consulting',
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  buttonLabel: 'VERIFY TODAY',
  buttonHref: '/verify-certificate',
};

/**
 * Default Global Footer Content
 *
 * Source of truth: Approved Figma Footer Card Specification
 */
export const defaultFooterContent: FooterContent = {
  brandHeading: 'Certification\n& Inspection.\nAssured.',
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  verificationPlaceholder: 'EXAMPLE- IND/02/678505',
  verificationButtonLabel: 'VERIFY TODAY',
  logoAsset: {
    src: '/images/brand/eca-logo.webp',
    alt: 'ECA Logo',
    width: 80,
    height: 80,
  },
  navigation: [
    {
      id: 'nav-home',
      label: 'Home',
      href: '/',
    },
    {
      id: 'nav-about',
      label: 'About Us',
      href: '/about',
    },
    {
      id: 'nav-services',
      label: 'Services',
      isExpandable: true,
      children: [
        { label: 'ESG', href: '/services/esg' },
        { label: 'Management System Certification', href: '/services/management-system-certification' },
        { label: 'Inspection', href: '/services/inspection' },
        { label: 'Training', href: '/services/training' },
        { label: 'Product Certification', href: '/services/product-certification' },
        { label: 'CBAM Verification', href: '/services/cbam-verification' },
      ],
    },
    {
      id: 'nav-associations',
      label: 'Associations',
      href: '/associations',
    },
    {
      id: 'nav-news',
      label: 'News & Insights',
      href: '/news',
    },
    {
      id: 'nav-contact',
      label: 'Contact Us',
      href: '/contact',
    },
  ],
  copyright: 'All Rights Reserved by ECASEURO',
  privacyLabel: 'Privacy Policy',
  privacyHref: '/privacy-policy',
  termsLabel: 'Terms of Use',
  termsHref: '/terms-of-use',
};

/**
 * Default Homepage SEO Metadata
 */
export const defaultHomeSEO: SEOData = {
  title: 'ECASEURO | European Certification & Compliance Directorate',
  description:
    'International accredited certification, inspection, ESG assurance, and professional training services across Europe and global markets.',
  keywords: [
    'ISO Certification',
    'Compliance Assurance',
    'Inspection Services',
    'Professional Training',
    'ECASEURO',
    'CBAM Verification',
  ],
  ogTitle: 'ECASEURO | European Certification & Compliance Directorate',
  ogDescription:
    'International accredited certification, inspection, ESG assurance, and professional training services.',
  ogImage: {
    src: '/images/brand/eca-logo.webp',
    alt: 'ECASEURO Certification Directorate',
  },
};

/**
 * Composite Homepage Content Object
 */
export const defaultHomePageContent: HomePageContent = {
  seo: defaultHomeSEO,
  hero: defaultHomeHeroContent,
  services: defaultHomeServicesContent,
  certificateShortcut: defaultCertificateShortcutContent,
  process: defaultCertificationProcessContent,
  testimonials: defaultTestimonialsContent,
  faq: defaultFAQContent,
  consultingCta: defaultConsultingCTAContent,
  footer: defaultFooterContent,
};


