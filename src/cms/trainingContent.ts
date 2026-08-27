import type {
  TrainingHeroContent,
  TrainingCoursesSectionContent,
  FlexibleLearningSectionContent,
  HomeFAQContent,
  ConsultingCTAContent,
  TrainingPageContent,
} from './types';

export const defaultTrainingHeroContent: TrainingHeroContent = {
  headingLines: ['Build knowledge.', 'Strengthen capability.'],
  description:
    'ECAS provides professional training across management systems, auditing and organisational compliance. From foundation and awareness programmes to advanced auditing skills and IRCA-accredited lead auditor courses, our training helps professionals understand requirements and apply them confidently in their roles.',
};

export const defaultTrainingCoursesSectionContent: TrainingCoursesSectionContent = {
  heading: 'Courses based on\nrecognised standards.',
  description:
    'Explore professional training across management systems, sustainability, occupational safety, information security, energy, compliance and food safety.',
  searchPlaceholder: 'Search Courses or Standards',
  noResultsText: 'No matching courses or standards.',
  courses: [
    // Left Column Courses (Figma reference)
    {
      id: 'esg',
      title: 'ESG',
      subtitle: 'Environment, Sustainability and Governance',
      iconKey: 'GlobeHemisphereWest',
      keywords: ['esg', 'environment', 'sustainability', 'governance', 'carbon', 'social'],
    },
    {
      id: 'iso-4001',
      title: 'ISO 4001:2015',
      subtitle: 'Environmental Management Systems',
      iconKey: 'Leaf',
      keywords: ['4001', 'iso 4001', 'environment', 'environmental', 'ems', 'sustainability'],
    },
    {
      id: 'iso-45001',
      title: 'ISO 45001:2018',
      subtitle: 'Occupational Health and Safety Management Systems',
      iconKey: 'HardHat',
      keywords: ['45001', 'iso 45001', 'health', 'safety', 'ohsas', 'occupational', 'workplace'],
    },
    {
      id: 'iso-22301',
      title: 'ISO 22301:2019',
      subtitle: 'Business Continuity Management Systems',
      iconKey: 'Lifebuoy',
      keywords: ['22301', 'iso 22301', 'business continuity', 'bcms', 'continuity', 'resilience', 'disaster'],
    },
    {
      id: 'iso-27001',
      title: 'ISO/IEC 27001:2022',
      subtitle: 'Information Security Management Systems',
      iconKey: 'Lock',
      keywords: ['27001', 'iso 27001', 'information security', 'cybersecurity', 'isms', 'security', 'data'],
    },
    {
      id: 'iso-50001',
      title: 'ISO 50001:2018',
      subtitle: 'Energy Management Systems',
      iconKey: 'Lightning',
      keywords: ['50001', 'iso 50001', 'energy', 'enms', 'efficiency'],
    },
    // Right Column Courses (Figma reference)
    {
      id: 'iso-37001',
      title: 'ISO 37001:2016',
      subtitle: 'Anti-bribery Management Systems — Non-IRCA',
      iconKey: 'Scales',
      keywords: ['37001', 'iso 37001', 'anti-bribery', 'anti bribery', 'abms', 'compliance', 'non-irca', 'governance'],
    },
    {
      id: 'iso-9001',
      title: 'ISO 9001:2015',
      subtitle: 'Quality Management Systems',
      iconKey: 'SealCheck',
      keywords: ['9001', 'iso 9001', 'quality', 'qms', 'standards', 'management'],
    },
    {
      id: 'iso-17025',
      title: 'ISO/IEC 17025:2017',
      subtitle: 'Laboratory Management Systems',
      iconKey: 'Flask',
      keywords: ['17025', 'iso 17025', 'laboratory', 'testing', 'calibration', 'lab'],
    },
    {
      id: 'iso-22000',
      title: 'ISO 22000:2018',
      subtitle: 'Food Safety Management Systems',
      iconKey: 'ForkKnife',
      keywords: ['22000', 'iso 22000', 'food', 'food safety', 'fsms', 'haccp', 'safety'],
    },
    {
      id: 'fssc-22000',
      title: 'FSSC 22000 Version 6.0',
      subtitle: 'Environment, Sustainability and Governance',
      iconKey: 'ShieldCheck',
      keywords: ['fssc', 'fssc 22000', 'food', 'food safety', 'version 6', 'esg', 'governance'],
    },
  ],
};

export const defaultFlexibleLearningSectionContent: FlexibleLearningSectionContent = {
  heading: 'Flexible learning,\ndesigned around\nyour needs.',
  description: 'Choose the delivery format that works best for your team.',
  formats: [
    {
      id: 'classroom',
      title: 'Classroom and\nPublic Courses',
      description: 'Instructor-led learning through scheduled public programmes.',
      iconKey: 'Presentation',
    },
    {
      id: 'blended',
      title: 'Blended Learning\nand eLearning',
      description: 'Live instruction combined with flexible online learning.',
      iconKey: 'Devices',
    },
    {
      id: 'in-house',
      title: 'Bespoke In-house\nTraining',
      description: 'Custom programmes tailored to your organisation’s requirements.',
      iconKey: 'SlidersHorizontal',
    },
  ],
};

export const defaultTrainingFAQContent: HomeFAQContent = {
  heading: 'Commonly Asked Questions',
  description:
    'Everything you need to know about our management systems training courses, delivery formats and certifications.',
  items: [
    {
      id: 'training-faq-1',
      number: '01',
      question: 'What types of training courses does ECASEURO provide?',
      answer:
        'ECASEURO provides a comprehensive range of professional training courses including awareness programmes, internal auditor training, and accredited lead auditor courses across recognized ISO standards and management systems.',
    },
    {
      id: 'training-faq-2',
      number: '02',
      question: 'Are ECASEURO training courses recognized internationally?',
      answer:
        'Yes, our training courses adhere strictly to international standards and recognized accreditation frameworks, providing attendees with verifiable qualifications acknowledged worldwide.',
    },
    {
      id: 'training-faq-3',
      number: '03',
      question: 'Can training programmes be delivered on-site for our team?',
      answer:
        'Yes, we offer bespoke in-house training tailored specifically to your organization’s industry context, operational processes, and scheduling requirements.',
    },
    {
      id: 'training-faq-4',
      number: '04',
      question: 'What delivery formats are available for participants?',
      answer:
        'We provide instructor-led classroom sessions, scheduled public courses, live virtual instruction, self-paced eLearning modules, and blended learning options to fit varied professional schedules.',
    },
    {
      id: 'training-faq-5',
      number: '05',
      question: 'How do participants verify and receive course credentials?',
      answer:
        'Upon successful completion and evaluation of the training course, participants receive an official digital certificate verifiable directly through our online certificate verification portal.',
    },
  ],
};

export const defaultTrainingConsultingCTAContent: ConsultingCTAContent = {
  heading: 'Need Expert Help?\nGet free consulting',
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  buttonLabel: 'VERIFY TODAY',
  buttonHref: '/verify-certificate',
};

export const defaultTrainingPageContent: TrainingPageContent = {
  seo: {
    title: 'Professional Management Systems & ISO Training | ECASEURO',
    description:
      'Professional training across management systems, auditing, and organizational compliance. From foundation courses to IRCA-accredited lead auditor certifications.',
    keywords: [
      'ISO training',
      'management system courses',
      'lead auditor training',
      'ISO 9001 training',
      'ISO 27001 training',
      'ESG training',
      'ECASEURO',
    ],
  },
  hero: defaultTrainingHeroContent,
  courses: defaultTrainingCoursesSectionContent,
  flexibleLearning: defaultFlexibleLearningSectionContent,
  faq: defaultTrainingFAQContent,
  consultingCta: defaultTrainingConsultingCTAContent,
};
