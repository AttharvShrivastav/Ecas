import type {
  ESGHeroContent,
  ESGSectionContent,
  HomeFAQContent,
  ConsultingCTAContent,
  ESGPageContent,
} from './types';

export const defaultESGHeroContent: ESGHeroContent = {
  headingLines: ['ESG Assurance', 'and Support'],
  description:
    'Structured support for organisations addressing environmental, social and governance requirements, reporting expectations and responsible business practices.',
};

export const defaultESGSectionContent: ESGSectionContent = {
  // Design-stage placeholder heading from the Figma visual reference
  heading: 'Simple Steps to Access\nTrusted Care Anytime',
  // Explanatory copy matching the Figma visual reference
  description:
    'With ESG now central to investor decisions, reports must be clear and detailed. Transparent communication of environmental, social, and governance activity builds stakeholder trust — yet no universal reporting framework exists. Drawing on market research and extensive experience, Triangulate has developed standards optimised for today’s ESG communication demands. From technical report detail to core business plan messaging, ECA ensures every report meets internationally recognised, self-set standards.',
  pillars: [
    {
      id: 'environmental',
      number: '01',
      title: 'ENVIRONMENTAL',
      iconKey: 'leaf',
      order: 1,
      topics: [
        'Climate Change',
        'Greenhouse Gas (GHG) Emissions',
        'Resource Depletion',
        'Waste & Pollution',
        'Recycling',
        'Business Ethic',
        'Sustainability',
      ],
    },
    {
      id: 'social',
      number: '02',
      title: 'SOCIAL',
      iconKey: 'users',
      order: 2,
      topics: [
        'Safe Working Conditions',
        'Protection of Worker Rights',
        'Local Communities',
        'Indigenous People',
        'War/Conflict Regions',
        'Health & Safety',
        'Employee Relations/Diversity',
      ],
    },
    {
      id: 'governance',
      number: '03',
      title: 'GOVERNANCE',
      iconKey: 'scales',
      order: 3,
      topics: [
        'Executive Pay',
        'Board Diversity',
        'Anti-Bribery & Corruption',
        'Data Protection',
        'Political Lobbying & Donations',
        'Tax Strategy',
        'Supply Chain Due Diligence/Modern Slavery',
      ],
    },
  ],
};

export const defaultESGFAQContent: HomeFAQContent = {
  heading: 'Commonly Asked Questions',
  description:
    'Understand our ESG verification protocols, reporting alignment, and sustainability assurance services.',
  items: [
    {
      id: 'esg-faq-1',
      number: '01',
      question: 'What is the role of independent ESG assurance?',
      answer:
        'Independent ESG assurance verifies the accuracy, completeness, and reliability of your sustainability metrics and disclosure data, providing stakeholders, regulators, and investors with verifiable confidence.',
    },
    {
      id: 'esg-faq-2',
      number: '02',
      question: 'Which ESG reporting frameworks does ECASEURO support?',
      answer:
        'Our assurance methodologies align with leading international standards including GRI (Global Reporting Initiative), ISSB/IFRS, CSRD (Corporate Sustainability Reporting Directive), and ISO sustainability frameworks.',
    },
    {
      id: 'esg-faq-3',
      number: '03',
      question: 'How do you assess Greenhouse Gas (GHG) emissions?',
      answer:
        'We conduct rigorous third-party verification of Scope 1, Scope 2, and applicable Scope 3 emissions according to ISO 14064-3 and the GHG Protocol standards.',
    },
    {
      id: 'esg-faq-4',
      number: '04',
      question: 'Can ESG verification be combined with management system audits?',
      answer:
        'Yes. Organizations can harmonize ESG data audits with existing management system certifications (such as ISO 14001, ISO 45001, and ISO 50001) for maximum audit efficiency.',
    },
    {
      id: 'esg-faq-5',
      number: '05',
      question: 'What deliverables are provided upon completion of an ESG assessment?',
      answer:
        'Organisations receive a comprehensive Independent Assurance Statement, an executive gap assessment report, and formal verification credentials.',
    },
  ],
};

export const defaultESGConsultingCTAContent: ConsultingCTAContent = {
  heading: 'Need Expert Help?\nGet free consulting',
  description:
    'For ESG Assurance, Sustainability Verification and Compliance Assessment in your organization, reach out to our specialists today.',
  buttonLabel: 'VERIFY TODAY',
  buttonHref: '/verify-certificate',
};

export const defaultESGPageContent: ESGPageContent = {
  seo: {
    title: 'ESG Assurance & Sustainability Verification | ECASEURO',
    description:
      'Independent ESG assurance, sustainability verification, and compliance solutions across Environmental, Social, and Governance pillars.',
    keywords: [
      'ESG assurance',
      'sustainability verification',
      'environmental social governance',
      'GHG verification',
      'ECASEURO ESG',
    ],
  },
  hero: defaultESGHeroContent,
  esgSection: defaultESGSectionContent,
  faq: defaultESGFAQContent,
  consultingCta: defaultESGConsultingCTAContent,
};
