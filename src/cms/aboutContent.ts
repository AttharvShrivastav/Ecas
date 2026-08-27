import type {
  AboutPageContent,
  AboutHeroContent,
  AboutVisionMissionContent,
  AboutConfidenceContent,
  AboutCertificationConfidenceContent,
  AboutGlobalExpertiseContent,
  ConsultingCTAContent,
} from './types';

export const defaultAboutHeroContent: AboutHeroContent = {
  headingLines: ['Independent', 'Assurance,', 'Made Clear'],
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  visualAsset: {
    src: '/images/about/about-hero-map.svg',
    alt: '',
  },
};

export const defaultAboutVisionMissionContent: AboutVisionMissionContent = {
  heading: 'Vision shapes our\ndirection. Mission\ndefines our purpose.',
  description:
    'We believe standards and assurance create a better, safer and more sustainable world for everyone.',
  items: [
    {
      id: 'vision',
      number: '01',
      title: 'Our Vision',
      description:
        'At ECA, we believe in no-nonsense auditing which focuses on identifying non-conformances that add value to the whole system, not merely for criticism. "We wish to become the first-choice certification body."',
      icon: 'eye',
    },
    {
      id: 'mission',
      number: '02',
      title: 'Our Mission',
      description:
        'We provide value-adding assessments that help organizations meet management system standards with minimal business disruption. Our practical, efficient audits make compliance easier. "We never forget you have a choice."',
      icon: 'target',
    },
  ],
  supportStatement:
    'We make standards easier to understand, processes easier to navigate and assurance easier to trust.',
  supportMapAsset: {
    src: '/images/about/about-support-map.webp',
    alt: '',
  },
};

export const defaultAboutConfidenceContent: AboutConfidenceContent = {
  heading: 'Confidence Behind\nEvery Certification',
  description:
    'Independent expertise, global reach, and practical assessments that help organizations meet standards, manage risk, and move forward with confidence.',
  items: [
    {
      id: 'clear-communication',
      title: 'CLEAR COMMUNICATION',
      description:
        'Clear requirements and transparent guidance throughout the process.',
      icon: 'chat',
      image: {
        src: '/images/about/confidence-clear-communication.webp',
        alt: 'Clear communication and transparent guidance throughout ISO certification',
      },
    },
    {
      id: 'professional-expertise',
      title: 'PROFESSIONAL EXPERTISE',
      description:
        'Highly qualified auditors with extensive industrial and auditing experience.',
      icon: 'shield',
      image: {
        src: '/images/about/confidence-professional-expertise.webp',
        alt: 'Highly qualified auditors with extensive industrial and auditing expertise',
      },
    },
    {
      id: 'business-understanding',
      title: 'BUSINESS UNDERSTANDING',
      description:
        'Assessments aligned with your industry, operations and management systems.',
      icon: 'buildings',
      image: {
        src: '/images/about/confidence-business-understanding.webp',
        alt: 'Assessments tailored to industry operations and management systems',
      },
    },
    {
      id: 'continued-support',
      title: 'CONTINUED SUPPORT',
      description:
        'Responsive sales and after-sales support with a focus on continual improvement.',
      icon: 'arrows-clockwise',
      image: {
        src: '/images/about/confidence-continued-support.webp',
        alt: 'Responsive sales and after-sales support for continual improvement',
      },
    },
  ],
};

export const defaultAboutCertificationConfidenceContent: AboutCertificationConfidenceContent = {
  heading: 'Certification built on confidence.',
  description:
    'ECA helps organisations strengthen management systems, reduce risk and demonstrate compliance through independent assessment and technical expertise.',
  features: [
    {
      id: 'accredited-certification',
      title: 'ACCREDITED CERTIFICATION',
      description:
        'Certification services across internationally recognised management system standards, supported by independent accreditation.',
      icon: 'certificate',
    },
    {
      id: 'impartial-objective',
      title: 'IMPARTIAL & OBJECTIVE',
      description:
        'We actively manage conflicts of interest and safeguard impartiality throughout our certification activities.',
      icon: 'scales',
    },
    {
      id: 'beyond-certification',
      title: 'BEYOND CERTIFICATION',
      description:
        'Our expertise extends beyond management system certification to professional training and inspection services worldwide.',
      icon: 'globe',
    },
  ],
};

export const defaultAboutGlobalExpertiseContent: AboutGlobalExpertiseContent = {
  heading: 'Global Expertise,\nLocal Understanding',
  description:
    'Certification, training and inspection services backed by global expertise and practical local industry knowledge.',
  countries: {
    headline: '10+ Countries',
    subtitle: 'International Network',
    description:
      'Skilled specialists supporting organisations across multiple countries.',
    subDescription: 'Worldwide Certification',
    locations: ['Oman', 'Qatar', 'Belgium', 'India'],
  },
  worldwide: {
    headline: 'Worldwide',
    subtitle: 'Global Capability',
    description:
      'International expertise combined with an understanding of local industries.',
    image: {
      src: '/images/about/global-worldwide.webp',
      alt: 'Worldwide certification and global capability supported by local industry expertise',
    },
  },
  offices: {
    headline: '15+ Offices',
    subtitle: 'Regional Presence',
    description: 'A strong network of regional assessors across India.',
  },
  industries: {
    headline: 'Multiple',
    subtitle: 'Industries that we deal with',
    description:
      'Serving organisations across Oil & Gas, Power, Mining, Construction, Engineering, Chemical, Food and other industries.',
    items: [
      { id: 'oil-gas', label: 'Oil & Gas', iconKey: 'oil-gas' },
      { id: 'power', label: 'Power', iconKey: 'power' },
      { id: 'mining', label: 'Mining', iconKey: 'mining' },
      { id: 'construction', label: 'Construction', iconKey: 'construction' },
      { id: 'engineering', label: 'Engineering', iconKey: 'engineering' },
      { id: 'chemical', label: 'Chemical', iconKey: 'chemical' },
      { id: 'food', label: 'Food', iconKey: 'food' },
    ],
  },
};

export const defaultAboutConsultingCTAContent: ConsultingCTAContent = {
  heading: 'Need Expert Help?\nGet free consulting',
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  buttonLabel: 'VERIFY TODAY',
  buttonHref: '/verify-certificate',
};

export const defaultAboutPageContent: AboutPageContent = {
  seo: {
    title: 'About Us | Independent Assurance & ISO Certification | ECASEURO',
    description:
      'Discover ECASEURO’s vision, mission, and independent assurance philosophy. We make ISO certification, technical inspection, and standards compliance clear, efficient, and trusted.',
  },
  hero: defaultAboutHeroContent,
  visionMission: defaultAboutVisionMissionContent,
  confidence: defaultAboutConfidenceContent,
  certificationConfidence: defaultAboutCertificationConfidenceContent,
  globalExpertise: defaultAboutGlobalExpertiseContent,
  consultingCta: defaultAboutConsultingCTAContent,
};
