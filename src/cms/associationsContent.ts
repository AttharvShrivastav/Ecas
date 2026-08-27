import type {
  AssociationsHeroContent,
  AssociationsIntroContent,
  AssociationPartner,
  ConsultingCTAContent,
  AssociationsPageContent,
} from './types';

export const defaultAssociationsHeroContent: AssociationsHeroContent = {
  headingLines: ['Associations built', 'on trusted expertise.'],
  description:
    'ECASEURO works with experienced conformity assessment, certification, inspection and technical organisations to support credible services across international markets.',
};

export const defaultAssociationsIntroContent: AssociationsIntroContent = {
  heading: 'Collaborative Technical & Accreditation Network',
  description:
    'Operating in accordance with ISO/IEC 17021 and ISO/IEC 17020 conformity assessment principles, ECASEURO collaborates with independent accreditation bodies, certification bodies, and technical inspection groups to maintain rigorous standards and mutual confidence across global sectors.',
};

export const defaultAssociationPartners: AssociationPartner[] = [
  {
    id: 'partner-dedal',
    slug: 'dedal',
    order: 1,
    name: 'Dedal',
    location: 'Burgas, Bulgaria',
    logo: '/images/associations/dedal.webp',
    logoAlt: 'Dedal certification and inspection logo',
    shortDescription:
      'Private certification and consultancy group established in 1999, with specialized experience in construction-product control and certification.',
    profile: {
      overview:
        'Dedal is an established private certification and consultancy group founded in 1999 in Burgas, Bulgaria. With deep technical competence in construction products, structural materials, factory production control (FPC), and international management system audits, Dedal delivers rigorous compliance verification across European and regional markets.',
      services: [
        'Construction Products Regulation (CPR) Verification',
        'Factory Production Control (FPC) Certification',
        'Management System Audits & Assessment',
        'Technical Inspection and Quality Control',
      ],
      specialties: [
        'Notified Body services for construction products',
        'European harmonised standard compliance',
        'Systematic factory production evaluations',
      ],
    },
    websiteUrl: 'https://dedal-bg.net/en',
    seo: {
      title: 'Dedal Partner Profile | ECASEURO Associations',
      description:
        'Learn about Dedal, a leading Bulgarian certification and consultancy group partnering with ECASEURO in construction product certification and audits.',
    },
  },
  {
    id: 'partner-racs',
    slug: 'racs',
    order: 2,
    name: 'RACS',
    location: 'Dubai, UAE',
    logo: '/images/associations/racs.webp',
    logoAlt: 'RACS Quality Certificates logo',
    shortDescription:
      'Conformity assessment organisation providing inspection, verification, testing, assessment and certification services.',
    profile: {
      overview:
        'RACS Quality Certificates Issuing Services is an internationally accredited conformity assessment body headquartered in Dubai, United Arab Emirates. Providing testing, inspection, product certification, and regulatory verification, RACS enables seamless trade and compliance across the Middle East, Gulf region, and worldwide markets.',
      services: [
        'Product Conformity & Regulatory Certification',
        'Inspection, Testing & Technical Verification',
        'Halal & Food Safety System Assessments',
        'Cosmetics, Chemicals & Consumer Goods Compliance',
      ],
      specialties: [
        'GSO and SASO conformity certifications',
        'Comprehensive supply chain technical evaluations',
        'International trade market-access protocols',
      ],
    },
    websiteUrl: 'https://www.racs-me.com',
    seo: {
      title: 'RACS Quality Partner Profile | ECASEURO Associations',
      description:
        'Discover RACS, an accredited conformity assessment organisation providing inspection, testing, and certification in association with ECASEURO.',
    },
  },
  {
    id: 'partner-fqc',
    slug: 'first-quality-certification',
    order: 3,
    name: 'First Quality Certification',
    location: 'Turkey',
    logo: '/images/associations/first-quality-certification.webp',
    logoAlt: 'First Quality Certification logo',
    shortDescription:
      'Certification organisation with long-standing industry experience and management-system accreditation activities.',
    profile: {
      overview:
        'First Quality Certification (FQC) is a well-established independent certification body based in Turkey. With extensive industrial experience and accredited conformity assessment services, FQC conducts rigorous management system audits, personnel qualifications, and technical assessments for international enterprises.',
      services: [
        'ISO Management System Certification',
        'Personnel Qualification & Professional Training',
        'Technical Inspection & Industrial Audits',
        'Product and Process Quality Conformance',
      ],
      specialties: [
        'Accredited multi-sector management assessments',
        'Cross-industry compliance audits',
        'Continuous quality assurance frameworks',
      ],
    },
    websiteUrl: 'https://fqc.com.tr',
    seo: {
      title: 'First Quality Certification Profile | ECASEURO Associations',
      description:
        'Overview of First Quality Certification (FQC), offering accredited management system certification and technical inspection with ECASEURO.',
    },
  },
  {
    id: 'partner-triangulate',
    slug: 'triangulate',
    order: 4,
    name: 'Triangulate (Worldwide) Limited',
    location: 'United Kingdom',
    logo: '/images/associations/triangulate.webp',
    logoAlt: 'Triangulate Worldwide logo',
    grayscaleOnHover: true,
    shortDescription:
      'Independent audit organisation operating in environmental, social accountability and governance fields.',
    profile: {
      overview:
        'Triangulate (Worldwide) Limited is a UK-based independent audit and assessment organisation operating globally across environmental, social accountability, and governance (ESG) domains. Triangulate helps multinational corporations and suppliers verify ethical practices, worker welfare, and environmental stewardship.',
      services: [
        'ESG Assurance & Sustainability Audits',
        'Social Accountability & Workplace Ethics (SMETA / SEDEX)',
        'Environmental Performance & Carbon Audits',
        'Supply Chain Traceability & Due Diligence',
      ],
      specialties: [
        'Independent third-party ethical verification',
        'International ESG disclosure readiness',
        'Global supply chain compliance reviews',
      ],
    },
    websiteUrl: 'https://www.triangulate-worldwide.com',
    seo: {
      title: 'Triangulate Worldwide Partner Profile | ECASEURO Associations',
      description:
        'Explore Triangulate (Worldwide) Limited, specializing in ESG, environmental, and social accountability audits in association with ECASEURO.',
    },
  },
  {
    id: 'partner-motabaqah',
    slug: 'motabaqah',
    order: 5,
    name: 'MOTABAQAH',
    location: 'Saudi Arabia',
    logo: '/images/associations/motabaqah.webp',
    logoAlt: 'MOTABAQAH conformity and testing logo',
    shortDescription:
      'Testing, inspection and certification organisation supporting conformity assessment and technical regulatory requirements.',
    profile: {
      overview:
        'MOTABAQAH is an accredited testing, inspection, and certification leader headquartered in Saudi Arabia. Providing advanced technical solutions, Saudi Quality Mark (SQM) programs, and specialized laboratory testing, MOTABAQAH ensures full conformity with mandatory national and international standards.',
      services: [
        'Saudi Quality Mark (SQM) Certification',
        'Technical Inspection & Laboratory Testing',
        'SABER Platform Conformity Verification',
        'Regulatory Compliance & Product Certification',
      ],
      specialties: [
        'Official Saudi regulatory conformity programs',
        'Comprehensive industrial laboratory testing',
        'High-standard market access compliance',
      ],
    },
    websiteUrl: 'https://motabaqah.com.sa/certification-programs/sqm-program/',
    seo: {
      title: 'MOTABAQAH Partner Profile | ECASEURO Associations',
      description:
        'Learn about MOTABAQAH, Saudi Arabia’s leading testing, inspection, and SQM certification body collaborating with ECASEURO.',
    },
  },
  {
    id: 'partner-astron',
    slug: 'astron',
    order: 6,
    name: 'Astron',
    location: '',
    logo: '/images/associations/astron.webp',
    logoAlt: 'Astron Group logo',
    shortDescription:
      'Partner organisation collaborating on international technical services and compliance verification.',
    profile: {
      overview:
        'Astron works in technical collaboration with ECASEURO to support specialized compliance, certification, and inspection services. Detailed institutional profile content will be published following final verified partner review.',
      services: [
        'Technical Verification Services',
        'International Compliance Support',
      ],
      specialties: [
        'Coordinated cross-border verification',
      ],
    },
    websiteUrl: 'https://astrongroup.com',
    seo: {
      title: 'Astron Partner Profile | ECASEURO Associations',
      description:
        'Discover Astron, a valued international technical and compliance partner in the ECASEURO association network.',
    },
  },
];

export const defaultAssociationsConsultingCTA: ConsultingCTAContent = {
  heading: 'Partner With ECASEURO',
  description:
    'Join our international network of conformity assessment bodies, inspection services, and accreditation partners to expand quality assurance worldwide.',
  buttonLabel: 'Contact Our Network',
  buttonHref: '/contact',
};

export const defaultAssociationsPageContent: AssociationsPageContent = {
  seo: {
    title: 'Associations & Technical Partners | ECASEURO',
    description:
      'Discover ECASEURO’s trusted network of international conformity assessment, certification, inspection, and technical audit associations.',
  },
  hero: defaultAssociationsHeroContent,
  intro: defaultAssociationsIntroContent,
  partners: defaultAssociationPartners,
  consultingCta: defaultAssociationsConsultingCTA,
};
