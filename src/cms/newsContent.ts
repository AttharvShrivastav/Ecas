import type { NewsArticle, NewsPageContent, NewsCategory } from './types';

/**
 * Standard News & Insights Categories
 */
export const NEWS_CATEGORIES: NewsCategory[] = [
  'All',
  'Regulatory Updates',
  'Standards & Certification',
  'CBAM & ESG',
  'Industry Insights',
  'Sector Developments',
  'Company News',
];

/**
 * Realistic Sample News & Insights Articles
 * Structured for direct CMS schema synchronization
 */
export const sampleNewsArticles: NewsArticle[] = [
  {
    id: 'art-cbam-2026-readiness',
    slug: 'eu-cbam-definitive-regime-preparation',
    title: 'Preparing for the EU CBAM Definitive Regime: What Non-EU Manufacturers Must Establish Ahead of 2026 Verification',
    category: 'CBAM & ESG',
    publishedAt: '2025-05-15',
    formattedDate: '15 May 2025',
    readTime: '5 min read',
    featured: true,
    excerpt:
      'As the Carbon Border Adjustment Mechanism transitions toward its definitive phase, non-EU industrial installations must implement rigorous monitoring systems to satisfy mandatory third-party verification rules.',
    author: {
      name: 'Technical Sustainability Team',
      role: 'Emissions Assurance & Verification',
      organization: 'ECASEURO Technical Directorate',
    },
    tags: ['CBAM', 'Emissions Verification', 'EU Regulation', 'Decarbonisation'],
    content: [
      {
        type: 'paragraph',
        text: 'The European Union’s Carbon Border Adjustment Mechanism (CBAM) is entering a decisive transition. While the transitional phase allowed quarterly reporting with default values, the definitive regime commencing in 2026 mandates that declared embedded emissions must be verified by an accredited independent body.',
      },
      {
        type: 'heading2',
        heading: 'The Shift from Default Values to Verified Actuals',
      },
      {
        type: 'paragraph',
        text: 'Non-EU producers exporting steel, aluminium, cement, fertilisers, hydrogen, and electricity to the EU single market face strict data governance requirements. Importers can no longer rely on broad benchmark estimations when filing their annual declarations.',
      },
      {
        type: 'list',
        items: [
          'Direct emissions monitoring at installation boundaries, covering specific production routes and precursor materials.',
          'Indirect emissions accounting calculated using actual electricity consumption data and regional grid emission factors.',
          'Formal calibration and documentation of all primary measurement devices, laboratory assays, and fuel analyses.',
          'Establishment of an audit trail capable of withstanding independent on-site verification visits.',
        ],
      },
      {
        type: 'callout',
        quote:
          'Independent third-party verification provides both the EU importer and customs authorities with the legal assurance that declared greenhouse gas data accurately reflects production realities.',
        citation: 'ECASEURO Technical Assurance Note',
      },
      {
        type: 'heading2',
        heading: 'Strategic Milestones for Non-EU Operators',
      },
      {
        type: 'paragraph',
        text: 'Manufacturers should not wait until the final quarter of 2025 to align their internal monitoring methodologies. A phased readiness program ensures sufficient time to identify measurement gaps, conduct pre-verification audits, and formalise boundary definitions.',
      },
      {
        type: 'keyTakeaway',
        heading: 'Key Verification Takeaways',
        items: [
          'Pre-verification readiness audits highlight accounting deficiencies before formal submission deadlines.',
          'Accredited verification statements form an indispensable prerequisite for valid EU import customs declarations under CBAM.',
          'Early methodology alignment prevents shipment hold-ups and severe financial penalties for European trade partners.',
        ],
      },
    ],
    seo: {
      title: 'EU CBAM Definitive Regime Readiness | ECASEURO Insights',
      description:
        'Technical guidance for non-EU industrial producers preparing for mandatory independent greenhouse gas verification under the EU CBAM definitive regime.',
      keywords: ['CBAM verification', 'EU carbon border adjustment', 'emissions assurance', 'ISO 14064'],
    },
  },
  {
    id: 'art-cpr-revision-sustainability',
    slug: 'construction-products-regulation-cpr-revision',
    title: 'Revised Construction Products Regulation (CPR): Enhanced Environmental Criteria & CE Marking Rules',
    category: 'Standards & Certification',
    publishedAt: '2025-04-28',
    formattedDate: '28 April 2025',
    readTime: '4 min read',
    featured: false,
    excerpt:
      'The new European Construction Products Regulation introduces mandatory environmental declarations and digital product passports alongside structural safety conformity.',
    author: {
      name: 'Conformity Assessment Directorate',
      role: 'Notified Body Assessment Specialist',
      organization: 'ECASEURO & Dedal',
    },
    tags: ['CPR', 'CE Marking', 'Factory Production Control', 'Construction'],
    content: [
      {
        type: 'paragraph',
        text: 'The revision of the European Construction Products Regulation (EU) marks the most significant evolution in building product conformity in over a decade. European policymakers have integrated comprehensive sustainability metrics into standard CE marking declarations of performance.',
      },
      {
        type: 'heading2',
        heading: 'Integration of Digital Product Passports and Environmental Declarations',
      },
      {
        type: 'paragraph',
        text: 'Under the revised framework, manufacturers must declare not only mechanical resistance, fire safety, and acoustic performance, but also cradle-to-gate environmental indicators based on harmonised standards.',
      },
      {
        type: 'list',
        items: [
          'Digital Product Passports (DPP) enabling traceability of material constituents and recyclability potential.',
          'Mandatory Factory Production Control (FPC) updates covering raw material sourcing verification.',
          'Expanded Notified Body surveillance audits for continuous assessment of performance consistency.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Manufacturers across structural steel, timber products, concrete elements, and insulation systems must ensure their quality management documentation reflects these new horizontal requirements.',
      },
    ],
    seo: {
      title: 'Revised CPR & CE Marking Rules for Construction Products | ECASEURO',
      description:
        'Analysis of the updated Construction Products Regulation (CPR), new environmental declaration obligations, and CE marking compliance.',
      keywords: ['CPR revision', 'Construction products regulation', 'CE marking', 'FPC audit'],
    },
  },
  {
    id: 'art-iso-climate-amendments',
    slug: 'iso-9001-climate-amendments-impact',
    title: 'ISO Management Systems & Climate Action: Auditing the 2024 Climate Change Amendments',
    category: 'Standards & Certification',
    publishedAt: '2025-04-10',
    formattedDate: '10 April 2025',
    readTime: '4 min read',
    featured: false,
    excerpt:
      'How the London Declaration amendments to ISO Harmonised Structure (Clauses 4.1 and 4.2) are being audited across ISO 9001, ISO 14001, and ISO 45001 management systems.',
    author: {
      name: 'Lead Auditor Panel',
      role: 'Management Systems Certification',
      organization: 'ECASEURO',
    },
    tags: ['ISO 9001', 'ISO 14001', 'Climate Action', 'Management Systems'],
    content: [
      {
        type: 'paragraph',
        text: 'Following the joint IAF/ISO Communiqué, all accredited management system standards now require organisations to determine whether climate change is a relevant issue in their organisational context (Clause 4.1) and whether relevant interested parties have requirements related to climate change (Clause 4.2).',
      },
      {
        type: 'heading2',
        heading: 'What Auditors Expect During Surveillance and Recertification',
      },
      {
        type: 'paragraph',
        text: 'These additions apply universally—not only to environmental management systems (ISO 14001), but equally to quality (ISO 9001), occupational health and safety (ISO 45001), and information security (ISO 27001).',
      },
      {
        type: 'list',
        items: [
          'Explicit review of climate risk factors in executive context analysis documents.',
          'Demonstrable consideration of climate resilience within business continuity and supplier risk frameworks.',
          'Alignment between stakeholder expectations and documented operational objectives.',
        ],
      },
      {
        type: 'callout',
        quote:
          'The amendment does not dictate specific environmental targets for quality standards, but demands structured evidence that leadership has evaluated climate relevance objectively.',
        citation: 'IAF/ISO Joint Communiqué Guidance',
      },
    ],
    seo: {
      title: 'Auditing ISO Climate Change Amendments (ISO 9001 & 14001) | ECASEURO',
      description:
        'Guidance on how the 2024 ISO Climate Change Amendments to Clauses 4.1 and 4.2 affect ISO 9001 and ISO 14001 surveillance audits.',
      keywords: ['ISO climate amendments', 'ISO 9001', 'ISO 14001', 'management system audit'],
    },
  },
  {
    id: 'art-industrial-inspection-ndt-integrity',
    slug: 'industrial-inspection-ndt-supply-chain-risk',
    title: 'Mitigating Global Supply Chain Risk Through Independent Third-Party Inspection & Non-Destructive Testing',
    category: 'Industry Insights',
    publishedAt: '2025-03-22',
    formattedDate: '22 March 2025',
    readTime: '6 min read',
    featured: false,
    excerpt:
      'Why leading EPC contractors and industrial asset owners deploy independent source inspection and advanced NDT to safeguard high-consequence infrastructure projects.',
    author: {
      name: 'Industrial Inspection Division',
      role: 'Senior Technical Inspector',
      organization: 'ECASEURO Quality & Surveillance',
    },
    tags: ['Industrial Inspection', 'NDT', 'Pressure Equipment', 'Welding Inspection'],
    content: [
      {
        type: 'paragraph',
        text: 'In high-consequence sectors such as energy infrastructure, chemical processing, and heavy mechanical engineering, component defects discovered post-installation cause catastrophic downtime and severe financial exposure. Source inspection and Non-Destructive Testing (NDT) act as decisive safeguards.',
      },
      {
        type: 'heading2',
        heading: 'The Role of Stage-Gate Inspection in Procurement',
      },
      {
        type: 'paragraph',
        text: 'Independent inspection bodies conduct stage-gate surveillance during critical manufacturing phases rather than relying solely on final dispatch sign-offs.',
      },
      {
        type: 'list',
        items: [
          'Pre-inspection meetings (PIM) clarifying Inspection and Test Plans (ITP) before fabrication commences.',
          'Material verification and positive material identification (PMI) confirming mill test certificates.',
          'Witnessing of ultrasonic, magnetic particle, radiographic, and dye penetrant non-destructive examinations.',
          'Dimensional verification and hydrostatic pressure testing according to EN 13445, ASME, or client technical specifications.',
        ],
      },
      {
        type: 'paragraph',
        text: 'By integrating qualified inspectors at the manufacturer’s shop floor, procurement teams ensure that every asset delivered meets the exact safety and engineering standards demanded by project specifications.',
      },
    ],
    seo: {
      title: 'Supply Chain Risk Mitigation via Industrial Inspection & NDT | ECASEURO',
      description:
        'How independent vendor inspection, shop surveillance, and NDT testing protect capital projects and industrial equipment integrity.',
      keywords: ['industrial inspection', 'NDT testing', 'vendor surveillance', 'pressure equipment inspection'],
    },
  },
  {
    id: 'art-csrd-esg-reporting-assurance',
    slug: 'csrd-esg-reporting-assurance-readiness',
    title: 'Navigating CSRD & ESRS: Preparing Supply Chain Metrics for Limited and Reasonable Assurance',
    category: 'CBAM & ESG',
    publishedAt: '2025-03-05',
    formattedDate: '5 March 2025',
    readTime: '5 min read',
    featured: false,
    excerpt:
      'Under the Corporate Sustainability Reporting Directive, enterprises must prepare non-financial data for rigorous assurance procedures on par with financial reporting.',
    author: {
      name: 'ESG & Sustainability Group',
      role: 'Senior ESG Assurance Auditor',
      organization: 'ECASEURO',
    },
    tags: ['CSRD', 'ESRS', 'ESG Assurance', 'Sustainability Reporting'],
    content: [
      {
        type: 'paragraph',
        text: 'The progressive roll-out of the Corporate Sustainability Reporting Directive (CSRD) and the European Sustainability Reporting Standards (ESRS) places unprecedented scrutiny on corporate environmental and social claims.',
      },
      {
        type: 'heading2',
        heading: 'Establishing an Assurance-Ready Data Infrastructure',
      },
      {
        type: 'paragraph',
        text: 'Sustainability teams must treat carbon accounting, water stewardship, waste footprints, and supply chain due diligence with the same internal controls and traceability traditionally reserved for general ledgers.',
      },
      {
        type: 'list',
        items: [
          'Double materiality assessment verification validating impact and financial materiality thresholds.',
          'Boundary mapping across Scope 1, Scope 2, and upstream Scope 3 emissions categories.',
          'Automated data lineage ensuring that every ESG figure can be traced back to primary source meter readings or invoices.',
        ],
      },
      {
        type: 'keyTakeaway',
        heading: 'Assurance Preparation Recommendations',
        items: [
          'Engage verification auditors during early dry-run reporting cycles to evaluate evidence sufficiency.',
          'Standardise data collection templates across subsidiaries and international manufacturing hubs.',
          'Document internal calculation controls and uncertainty management procedures explicitly.',
        ],
      },
    ],
    seo: {
      title: 'CSRD & ESRS Assurance Readiness | ECASEURO ESG Verification',
      description:
        'Strategic insights on preparing corporate sustainability data for mandatory limited and reasonable assurance under the EU CSRD framework.',
      keywords: ['CSRD assurance', 'ESRS reporting', 'ESG verification', 'sustainability audit'],
    },
  },
  {
    id: 'art-machinery-regulation-transition',
    slug: 'machinery-regulation-2023-1230-transition',
    title: 'The EU Machinery Regulation (EU) 2023/1230: Essential Safety Milestones for Notified Body Assessment',
    category: 'Regulatory Updates',
    publishedAt: '2025-02-18',
    formattedDate: '18 February 2025',
    readTime: '4 min read',
    featured: false,
    excerpt:
      'With the transition from Machinery Directive 2006/42/EC to the new direct-acting Regulation, equipment builders must address artificial intelligence, cybersecurity, and digital instructions.',
    author: {
      name: 'Product Safety & Certification',
      role: 'Notified Body Machinery Specialist',
      organization: 'Dedal / ECASEURO',
    },
    tags: ['Machinery Regulation', 'CE Marking', 'Cybersecurity', 'Notified Body'],
    content: [
      {
        type: 'paragraph',
        text: 'Regulation (EU) 2023/1230 fundamentally updates the European conformity landscape for industrial machinery, safety components, and lifting appliances. Becoming directly applicable across all Member States from January 2027, the regulation establishes binding safety requirements for contemporary digital risks.',
      },
      {
        type: 'heading2',
        heading: 'Key Architectural Changes in Safety Conformity',
      },
      {
        type: 'paragraph',
        text: 'Machinery manufacturers and system integrators must update their risk assessments to incorporate new hazards arising from digital connectivity and autonomous controls.',
      },
      {
        type: 'list',
        items: [
          'Mandatory cybersecurity protection against corruption for safety control hardware and software.',
          'Assessment of autonomous decision-making and self-evolving algorithms embedded in industrial systems.',
          'Modernised rules allowing digital instruction manuals and digital declarations of conformity.',
          'Updated High-Risk Machinery categories requiring mandatory third-party Notified Body conformity assessment.',
        ],
      },
    ],
    seo: {
      title: 'EU Machinery Regulation (EU) 2023/1230 Transition | ECASEURO',
      description:
        'Practical overview of the new EU Machinery Regulation, mandatory Notified Body assessment categories, and cybersecurity safety rules.',
      keywords: ['EU machinery regulation', '2023/1230', 'machinery directive', 'CE marking machinery'],
    },
  },
];

/**
 * Default News & Insights Page Content
 */
export const defaultNewsPageContent: NewsPageContent = {
  seo: {
    title: 'News & Insights | ECASEURO - Regulatory Updates, Standards & Sector Analysis',
    description:
      'Authoritative insights, European regulatory developments, ISO standards updates, CBAM and ESG verification news from ECASEURO and Dedal.',
    keywords: [
      'ECASEURO news',
      'conformity assessment updates',
      'EU regulatory news',
      'ISO certification updates',
      'CBAM news',
      'ESG verification insights',
    ],
  },
  hero: {
    headingLines: [
      'News & Insights.',
      'Regulatory updates,',
      'standards & sector analysis.',
    ],
    description:
      'Authoritative perspectives on European conformity assessment, international management standards, industrial inspection, and environmental assurance.',
  },
  categories: NEWS_CATEGORIES,
  articles: sampleNewsArticles,
  consultingCta: {
    heading: 'Have questions about regulatory compliance?',
    description:
      'Speak with our technical specialists regarding standards transitions, certification readiness, or third-party verification.',
    buttonLabel: 'SPEAK WITH AN EXPERT',
    buttonHref: '/contact?service=general-inquiry',
  },
};
