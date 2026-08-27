import type {
  ManagementSystemHeroContent,
  ManagementStandardsSectionContent,
  HomeFAQContent,
  ConsultingCTAContent,
  ManagementSystemPageContent,
} from './types';

export const defaultManagementSystemHeroContent: ManagementSystemHeroContent = {
  headingLines: ['Management System', 'Certification'],
  description:
    'Independent management system certification designed to help organisations demonstrate conformity, strengthen systems and build confidence.',
};

export const defaultManagementStandardsSectionContent: ManagementStandardsSectionContent = {
  heading: 'Management System\nCertification',
  // Temporary placeholder supporting copy from the design reference (clearly marked as fallback CMS copy)
  description:
    'We are dedicated to transforming healthcare access by connecting patients with certified doctors through secure',
  searchPlaceholder: 'Search Courses or Standards',
  noResultsText: 'No matching standards found.',
  standards: [
    {
      id: 'iso-9001',
      slug: 'iso-9001-quality',
      number: '1',
      title: 'ISO 9001 QUALITY',
      shortDescription:
        'ISO 9001 is an internationally recognised standard for the quality management systems. The standard is generic in nature and caters for both the manufacturing and service industries.',
      keywords: ['9001', 'iso 9001', 'quality', 'qms', 'standard'],
      modal: {
        overview:
          'ISO 9001 is the globally recognized standard for quality management systems (QMS), setting criteria for organizations to meet customer requirements and continuously improve processes.',
        applicability:
          'Applicable to any organisation regardless of size, sector, or geographic location seeking operational excellence.',
        focusAreas: [
          'Customer satisfaction & service excellence',
          'Process approach & systematic operational efficiency',
          'Risk-based thinking and opportunity management',
          'Continual improvement and management review',
        ],
      },
      seo: {
        title: 'ISO 9001 Quality Management System Certification | ECASEURO',
        description:
          'Learn about ISO 9001 Quality Management System (QMS) certification requirements, applicability, and core focus areas with ECASEURO.',
      },
    },
    {
      id: 'iso-14001',
      slug: 'iso-14001-environmental',
      number: '2',
      title: 'ISO 14001 ENVIRONMENTAL',
      shortDescription:
        'Environmental management systems certification helping organisations manage environmental impacts, compliance, and sustainability.',
      keywords: ['14001', 'iso 14001', 'environmental', 'environment', 'ems', 'sustainability'],
      modal: {
        overview:
          'ISO 14001 sets requirements for establishing, implementing, and enhancing an effective Environmental Management System to improve environmental performance.',
        applicability:
          'Organisations seeking to systematically manage their environmental responsibilities and reduce ecological footprint.',
        focusAreas: [
          'Resource efficiency & waste minimization',
          'Environmental legal compliance & risk mitigation',
          'Pollution prevention & lifecycle management',
          'Measurable environmental objectives & sustainability targets',
        ],
      },
      seo: {
        title: 'ISO 14001 Environmental Management System Certification | ECASEURO',
        description:
          'Comprehensive guide and certification overview for ISO 14001 Environmental Management Systems (EMS) with ECASEURO.',
      },
    },
    {
      id: 'iso-45001',
      slug: 'iso-45001-health-safety',
      number: '3',
      title: 'ISO 45001 OCCUPATIONAL HEALTH AND SAFETY',
      shortDescription:
        'Occupational health and safety management systems certification ensuring safe, healthy, and compliant workplace environments.',
      keywords: ['45001', 'iso 45001', 'health', 'safety', 'ohsas', 'occupational', 'workplace'],
      modal: {
        overview:
          'ISO 45001 specifies requirements for an occupational health and safety (OH&S) management system to prevent work-related injuries, fatalities, and illnesses.',
        applicability:
          'All organisations aiming to enhance worker safety, reduce workplace risks, and create healthier working conditions.',
        focusAreas: [
          'Hazard identification & proactive risk assessment',
          'Worker consultation, participation, and wellness',
          'Emergency preparedness & incident investigation',
          'Statutory health and safety legal compliance',
        ],
      },
      seo: {
        title: 'ISO 45001 Occupational Health and Safety Certification | ECASEURO',
        description:
          'ISO 45001 OH&S management system specifications, risk assessment requirements, and worker protection guidelines.',
      },
    },
    {
      id: 'iso-27001',
      slug: 'iso-27001-information-security',
      number: '4',
      title: 'ISO 27001 INFORMATION SECURITY',
      shortDescription:
        'Information security management systems certification safeguarding critical data assets, cyber resilience, and confidentiality.',
      keywords: ['27001', 'iso 27001', 'information security', 'cybersecurity', 'isms', 'data', 'security'],
      modal: {
        overview:
          'ISO/IEC 27001 is the international benchmark for information security management systems (ISMS), securing digital assets, intellectual property, and client data.',
        applicability:
          'Organizations of all sectors managing sensitive corporate data, cloud platforms, financial records, or third-party digital infrastructure.',
        focusAreas: [
          'Information security risk treatment & assessment',
          'Access control, encryption, and physical security',
          'Cyber incident management & business continuity',
          'Compliance with global data protection frameworks',
        ],
      },
      seo: {
        title: 'ISO 27001 Information Security Management Certification | ECASEURO',
        description:
          'ISO/IEC 27001 ISMS certification details, cybersecurity risk treatments, and global compliance criteria.',
      },
    },
    {
      id: 'iso-22000',
      slug: 'iso-22000-food-safety',
      number: '5',
      title: 'ISO 22000 FOOD SAFETY',
      shortDescription:
        'Food safety management systems certification ensuring safety and hazard control across the entire global food supply chain.',
      keywords: ['22000', 'iso 22000', 'food safety', 'fsms', 'haccp', 'food', 'hygiene'],
      modal: {
        overview:
          'ISO 22000 provides a unified global standard for food safety management, combining interactive communication, prerequisite programmes, and HACCP principles.',
        applicability:
          'Any organisation in the food supply chain including producers, manufacturers, caterers, packaging suppliers, and distributors.',
        focusAreas: [
          'Hazard Analysis and Critical Control Points (HACCP)',
          'Prerequisite Programmes (PRPs) management',
          'Traceability systems & food safety communication',
          'System verification, validation, and update protocols',
        ],
      },
      seo: {
        title: 'ISO 22000 Food Safety Management System Certification | ECASEURO',
        description:
          'ISO 22000 food safety management standards, supply chain traceability, and HACCP integration.',
      },
    },
    {
      id: 'iso-22301',
      slug: 'iso-22301-business-continuity',
      number: '6',
      title: 'ISO 22301 BUSINESS CONTINUITY',
      shortDescription:
        'Business continuity management systems certification protecting against, responding to, and recovering from disruptive incidents.',
      keywords: ['22301', 'iso 22301', 'business continuity', 'bcms', 'continuity', 'resilience', 'disaster'],
      modal: {
        overview:
          'ISO 22301 sets international criteria for business continuity management systems (BCMS), ensuring organizational readiness against unexpected operational disruptions.',
        applicability:
          'Enterprises seeking resilience against system outages, natural disasters, supply chain disruptions, and cyber incidents.',
        focusAreas: [
          'Business Impact Analysis (BIA) & risk appraisal',
          'Continuity strategies & incident response procedures',
          'Crisis management communication protocols',
          'Simulation exercises, testing, and continuous updating',
        ],
      },
      seo: {
        title: 'ISO 22301 Business Continuity Management Certification | ECASEURO',
        description:
          'ISO 22301 BCMS criteria, business impact analysis, and disaster recovery readiness.',
      },
    },
    {
      id: 'iso-50001',
      slug: 'iso-50001-energy-management',
      number: '7',
      title: 'ISO 50001 ENERGY MANAGEMENT',
      shortDescription:
        'Energy management systems certification to optimize energy efficiency, reduce consumption, and lower operational carbon emissions.',
      keywords: ['50001', 'iso 50001', 'energy', 'enms', 'efficiency', 'carbon', 'power'],
      modal: {
        overview:
          'ISO 50001 enables organisations to establish systematic processes to enhance energy performance, baseline usage, and reduce greenhouse gas emissions.',
        applicability:
          'Industrial plants, commercial properties, public utilities, and transport operations seeking structured energy conservation.',
        focusAreas: [
          'Energy baselines, reviews, and Energy Performance Indicators (EnPIs)',
          'Operational controls for significant energy uses (SEUs)',
          'Procurement of energy-efficient products and services',
          'Systematic tracking of energy reduction objectives',
        ],
      },
      seo: {
        title: 'ISO 50001 Energy Management System Certification | ECASEURO',
        description:
          'ISO 50001 energy efficiency baselines, reduction indicators, and EnMS operational controls.',
      },
    },
    {
      id: 'iso-14064',
      slug: 'iso-14064-greenhouse-gas-emissions',
      number: '8',
      title: 'ISO 14064 GREENHOUSE GAS EMISSIONS',
      shortDescription:
        'Greenhouse gas accounting and verification certification supporting transparent carbon footprint quantification and ESG reporting.',
      keywords: ['14064', 'iso 14064', 'ghg', 'greenhouse gas', 'carbon', 'emissions', 'esg', 'verification'],
      modal: {
        overview:
          'ISO 14064 provides international specifications for quantifying, monitoring, and reporting greenhouse gas (GHG) inventories and project emission reductions.',
        applicability:
          'Organisations establishing credible carbon accounting systems, net-zero roadmaps, or preparing for mandatory ESG disclosures.',
        focusAreas: [
          'Direct and indirect GHG emission source identification',
          'Inventory boundary definitions (Scope 1, 2, and 3)',
          'Data quality management and uncertainty evaluation',
          'Third-party audit and verification readiness',
        ],
      },
      seo: {
        title: 'ISO 14064 Greenhouse Gas Accounting & Verification | ECASEURO',
        description:
          'ISO 14064 carbon footprint calculation, GHG inventory boundary definitions, and ESG verification.',
      },
    },
    {
      id: 'iso-41000',
      slug: 'iso-41000-facility-management',
      number: '9',
      title: 'ISO 41000 FACILITY MANAGEMENT',
      shortDescription:
        'Facility management systems certification ensuring effective, safe, and efficient facility operations supporting core business.',
      keywords: ['41000', '41001', 'iso 41000', 'facility management', 'fms', 'workplace'],
      modal: {
        overview:
          'ISO 41001 establishes requirements for a facility management (FM) system to optimize workplace functionality, safety, cost-efficiency, and user wellbeing.',
        applicability:
          'Corporate real estate managers, facility service providers, and organisations operating multi-site physical infrastructure.',
        focusAreas: [
          'Workplace productivity & occupant wellbeing',
          'Asset lifecycle optimization & maintenance governance',
          'Service-level agreement (SLA) conformance',
          'Resource efficiency in facility operations',
        ],
      },
      seo: {
        title: 'ISO 41001 Facility Management System Certification | ECASEURO',
        description:
          'ISO 41001 FM system requirements for workplace safety, asset lifecycle governance, and operational efficiency.',
      },
    },
    {
      id: 'cgmp',
      slug: 'cgmp-current-good-manufacturing-practices',
      number: '10',
      title: 'CGMP',
      shortDescription:
        'Current Good Manufacturing Practices certification guaranteeing products are consistently produced and controlled to quality standards.',
      keywords: ['cgmp', 'gmp', 'manufacturing', 'pharma', 'cosmetics', 'food', 'quality'],
      modal: {
        overview:
          'Current Good Manufacturing Practices (CGMP) ensure manufacturing operations employ appropriate facilities, equipment validation, and process controls.',
        applicability:
          'Pharmaceutical manufacturers, dietary supplement producers, cosmetic formulators, and regulated consumer goods facilities.',
        focusAreas: [
          'Sanitary facility design & environmental monitoring',
          'Process validation, equipment qualification & maintenance',
          'Comprehensive batch records & quality assurance',
          'Raw material control and finished product testing',
        ],
      },
      seo: {
        title: 'CGMP Good Manufacturing Practices Certification | ECASEURO',
        description:
          'Current Good Manufacturing Practices (CGMP) audit, validation, sanitary facility, and batch record criteria.',
      },
    },
    {
      id: 'haccp',
      slug: 'haccp-hazard-analysis',
      number: '11',
      title: 'HACCP',
      shortDescription:
        'Hazard Analysis & Critical Control Points certification for systematic identification, evaluation, and control of food safety hazards.',
      keywords: ['haccp', 'food safety', 'hazard analysis', 'critical control points', 'food'],
      modal: {
        overview:
          'HACCP is a scientifically proven, preventive system for ensuring biological, chemical, and physical safety throughout the food production cycle.',
        applicability:
          'Food processors, catering operations, agricultural producers, and packaging manufacturers.',
        focusAreas: [
          'Comprehensive hazard identification and analysis',
          'Determination of Critical Control Points (CCPs)',
          'Establishment of critical limits and monitoring procedures',
          'Verification procedures and record-keeping protocols',
        ],
      },
      seo: {
        title: 'HACCP Food Safety Hazard Analysis Certification | ECASEURO',
        description:
          'HACCP preventive food safety hazard evaluation, critical control points, and monitoring standards.',
      },
    },
    {
      id: 'ghp',
      slug: 'ghp-good-hygiene-practices',
      number: '12',
      title: 'GHP',
      shortDescription:
        'Good Hygiene Practices certification providing essential sanitary and hygienic foundations for safe operational environments.',
      keywords: ['ghp', 'hygiene', 'sanitary', 'cleanliness', 'food handling'],
      modal: {
        overview:
          'Good Hygiene Practices (GHP) establish the baseline sanitary and operational conditions required across processing and handling facilities.',
        applicability:
          'Hospitality venues, food service kitchens, manufacturing spaces, and consumer-facing preparation lines.',
        focusAreas: [
          'Personal hygiene standards & staff training',
          'Cleaning, sanitation & waste disposal programs',
          'Pest prevention and structural maintenance',
          'Cross-contamination prevention protocols',
        ],
      },
      seo: {
        title: 'GHP Good Hygiene Practices Certification | ECASEURO',
        description:
          'Good Hygiene Practices (GHP) hygiene baselines, sanitation protocols, and cross-contamination prevention.',
      },
    },
    {
      id: 'gdp',
      slug: 'gdp-good-distribution-practices',
      number: '13',
      title: 'GDP',
      shortDescription:
        'Good Distribution Practices certification ensuring pharmaceutical and sensitive product integrity throughout logistics and storage.',
      keywords: ['gdp', 'distribution', 'logistics', 'supply chain', 'cold chain', 'pharma', 'storage'],
      modal: {
        overview:
          'Good Distribution Practices (GDP) guarantee that the quality and integrity of pharmaceutical and healthcare products are preserved across transportation networks.',
        applicability:
          'Logistics providers, pharmaceutical distributors, cold-chain transport operators, and healthcare storage hubs.',
        focusAreas: [
          'Temperature-controlled transit and storage monitoring',
          'Product traceability & anti-counterfeit controls',
          'Warehouse management & vehicle sanitation',
          'Deviation management and recall procedures',
        ],
      },
      seo: {
        title: 'GDP Good Distribution Practices Certification | ECASEURO',
        description:
          'Good Distribution Practices (GDP) cold chain, product traceability, and pharmaceutical logistics verification.',
      },
    },
  ],
};

export const defaultManagementSystemFAQContent: HomeFAQContent = {
  heading: 'Commonly Asked Questions',
  description:
    'Key information regarding the management system certification process, audit phases, and accreditation standards.',
  items: [
    {
      id: 'ms-faq-1',
      number: '01',
      question: 'What is the standard process for obtaining ISO Management System Certification?',
      answer:
        'The certification process typically involves an initial Stage 1 readiness audit (document review and readiness check) followed by a comprehensive Stage 2 certification audit to evaluate operational implementation and standard compliance.',
    },
    {
      id: 'ms-faq-2',
      number: '02',
      question: 'How long is an ISO Management System Certificate valid?',
      answer:
        'ISO certificates are issued with a 3-year validity cycle, subject to successful annual surveillance audits in years 1 and 2 and a recertification audit prior to the end of year 3.',
    },
    {
      id: 'ms-faq-3',
      number: '03',
      question: 'Can our organization integrate multiple standards into one audit (Integrated Management System)?',
      answer:
        'Yes. Many organizations integrate standards sharing the High-Level Structure (such as ISO 9001, ISO 14001, ISO 45001, and ISO 27001) into a single unified audit to reduce disruption and administrative overhead.',
    },
    {
      id: 'ms-faq-4',
      number: '04',
      question: 'Can we transfer our existing certification to ECASEURO?',
      answer:
        'Yes. Organizations holding valid accredited certification can transfer to ECASEURO through a seamless transfer review process without interrupting certification validity.',
    },
    {
      id: 'ms-faq-5',
      number: '05',
      question: 'How do clients and partners verify the authenticity of an ECASEURO certificate?',
      answer:
        'All issued certificates feature a unique registration number and QR code that can be verified instantly in real time via our online certificate verification portal.',
    },
  ],
};

export const defaultManagementSystemConsultingCTAContent: ConsultingCTAContent = {
  heading: 'Need Expert Help?\nGet free consulting',
  description:
    'For ISO Certification and ISO Standards Implementation of the Standards in your organization, fill the form here, Our experts will call you and guide for successful ISO Certification.',
  buttonLabel: 'VERIFY TODAY',
  buttonHref: '/verify-certificate',
};

export const defaultManagementSystemPageContent: ManagementSystemPageContent = {
  seo: {
    title: 'Management System Certification | ISO Standards | ECASEURO',
    description:
      'Independent accredited management system certification across ISO 9001, ISO 14001, ISO 45001, ISO 27001, ISO 22000, and industry standards.',
    keywords: [
      'ISO certification',
      'management system certification',
      'ISO 9001',
      'ISO 14001',
      'ISO 45001',
      'ISO 27001',
      'ECASEURO',
    ],
  },
  hero: defaultManagementSystemHeroContent,
  standardsSection: defaultManagementStandardsSectionContent,
  faq: defaultManagementSystemFAQContent,
  consultingCta: defaultManagementSystemConsultingCTAContent,
};
