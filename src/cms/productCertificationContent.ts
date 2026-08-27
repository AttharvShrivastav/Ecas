import type { ProductCertificationPageContent } from './types';

/**
 * Default Product Certification Page Content (CMS-ready)
 *
 * Source of Truth for /services/product-certification
 * Features:
 * - 6 Tabbed Certification Routes (CE Marking, EQM, ECAS Scheme, G Mark, SASO, UKCA)
 * - Accordion topic items per scheme
 * - 9 CE Marking Product Categories (3x3 grid)
 * - 5 International Market Summary Cards
 * - Shared FAQ & Consulting CTA
 */
export const defaultProductCertificationContent: ProductCertificationPageContent = {
  seo: {
    title: 'Product Certification | CE Marking, EQM, G Mark, SASO, UKCA | ECASEURO',
    description:
      'Navigate product compliance and international market access with ECASEURO. Comprehensive certification services for CE Marking, Emirates Quality Mark (EQM), ECAS Scheme, G Mark, SASO, and UKCA.',
    keywords: [
      'Product Certification',
      'CE Marking',
      'Emirates Quality Mark EQM',
      'ECAS Scheme UAE',
      'G Mark GCC',
      'SASO SABER Saudi Arabia',
      'UKCA marking',
      'Conformity Assessment',
      'Technical Construction File',
    ],
  },
  hero: {
    headingLines: ['Product compliance,', 'made clearer.'],
    description:
      'Navigate product certification and market-access requirements through clear guidance across European, Gulf and international conformity schemes.',
  },
  explorer: {
    heading: 'Choose the certification\nroute for your market.',
    description:
      'Explore the requirements, scope and application of each product conformity scheme.',
    schemes: [
      {
        id: 'ce-marking',
        slug: 'ce-marking',
        name: 'CE Marking',
        region: 'European Union',
        badgeLabel: 'CE',
        seo: {
          title: 'CE Marking Certification & Conformity Services | ECASEURO',
          description:
            'Obtain CE Marking certification for EU market access. Expert guidance on European New Approach Directives, technical construction files (TCF), testing, and EU Declarations of Conformity.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/ce-marking',
          keywords: ['CE Marking', 'EU Directive', 'Technical Construction File', 'Declaration of Conformity'],
        },
        summary:
          'The CE mark indicates that a product complies with applicable European requirements for safety, health and environmental protection across the European Single Market.',
        topics: [
          {
            id: 'ce-topic-1',
            number: '01',
            title: 'Understanding the Directives',
            content:
              'European New Approach Directives establish common product requirements across the European market. Manufacturers must identify every directive that applies to their specific product category, such as the Machinery Directive, Low Voltage Directive (LVD), Electromagnetic Compatibility (EMC) Directive, or Construction Products Regulation.',
          },
          {
            id: 'ce-topic-2',
            number: '02',
            title: 'Products Covered',
            content:
              'CE marking applies across a broad range of manufactured items including electrical equipment, machinery, construction materials, pressure vessels, personal protective equipment (PPE), toys, medical devices, and radio equipment placed on the European market.',
          },
          {
            id: 'ce-topic-3',
            number: '03',
            title: 'Product Assessment',
            content:
              'Depending on the risk level defined in the applicable directives, conformity assessment is performed either through manufacturer internal production control or through third-party verification by an accredited Notified Body for higher-risk products.',
          },
          {
            id: 'ce-topic-4',
            number: '04',
            title: 'Technical Documentation',
            content:
              'Manufacturers must compile a Technical Construction File (TCF) containing design drawings, circuit schematics, risk evaluations, essential health & safety checklists, test reports, and component declarations demonstrating regulatory compliance.',
          },
          {
            id: 'ce-topic-5',
            number: '05',
            title: 'Standards & Essential Requirements',
            content:
              'Applying European Harmonised Standards (EN standards) provides a legal presumption of conformity with essential directive requirements, streamlining laboratory testing and technical review.',
          },
          {
            id: 'ce-topic-6',
            number: '06',
            title: 'Applying the CE Mark',
            content:
              'Once conformity is verified, the manufacturer signs the formal EU Declaration of Conformity (DoC) and affixes the CE mark visibly, legibly, and indelibly to the product and accompanying documentation.',
          },
        ],
        ctaLabel: 'DISCUSS CE MARKING',
        ctaUrl: '/contact?service=product-certification&scheme=ce-marking',
      },
      {
        id: 'eqm',
        slug: 'eqm',
        name: 'Emirates Quality Mark (EQM)',
        region: 'United Arab Emirates (MoIAT)',
        badgeLabel: 'EQM',
        seo: {
          title: 'Emirates Quality Mark (EQM) Certification UAE | ECASEURO',
          description:
            'Obtain the Emirates Quality Mark (EQM) issued by MoIAT for UAE market access. Comprehensive support for factory audits, ISO 9001 review, and product testing.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/eqm',
          keywords: ['Emirates Quality Mark', 'EQM', 'MoIAT UAE', 'UAE product conformity'],
        },
        summary:
          'The Emirates Quality Mark (EQM) is a prestigious mark of conformity granted by the UAE Ministry of Industry and Advanced Technology (MoIAT) demonstrating that a product complies with UAE national standards and effective quality management systems.',
        topics: [
          {
            id: 'eqm-topic-1',
            number: '01',
            title: 'Scope & Regulatory Framework',
            content:
              'Governed by MoIAT under UAE Federal Law, the EQM is mandatory for specific regulated sectors (such as bottled drinking water) and voluntarily adopted by premier manufacturers across food, chemicals, cosmetics, and building materials to demonstrate quality excellence.',
          },
          {
            id: 'eqm-topic-2',
            number: '02',
            title: 'Factory Audit & Quality System',
            content:
              'Obtaining the EQM requires a thorough on-site audit of the manufacturing facility to evaluate production quality controls, raw material traceability, laboratory testing protocols, and ISO 9001 quality management system compliance.',
          },
          {
            id: 'eqm-topic-3',
            number: '03',
            title: 'Product Testing & Technical Review',
            content:
              'Representative product samples are collected and tested in accredited laboratories (ISO/IEC 17025) against approved UAE/GSO standard specifications to verify safety and performance criteria.',
          },
          {
            id: 'eqm-topic-4',
            number: '04',
            title: 'Licensing & Mark Affixation',
            content:
              'Upon successful assessment, MoIAT issues an EQM Licence valid for three years, authorizing the manufacturer to display the official EQM logo on product packaging, marketing materials, and customs export certificates.',
          },
        ],
        ctaLabel: 'DISCUSS EQM',
        ctaUrl: '/contact?service=product-certification&scheme=eqm',
      },
      {
        id: 'ecas-scheme',
        slug: 'ecas-scheme',
        name: 'ECAS Scheme',
        region: 'United Arab Emirates',
        badgeLabel: 'ECAS',
        seo: {
          title: 'ECAS Scheme Certification & UAE Market Access | ECASEURO',
          description:
            'Emirates Conformity Assessment Scheme (ECAS) registration and Certificate of Conformity for regulated electrical, automotive, cosmetics, and consumer goods.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/ecas-scheme',
          keywords: ['ECAS Scheme', 'UAE Certificate of Conformity', 'MoIAT ECAS', 'UAE customs clearance'],
        },
        summary:
          'The Emirates Conformity Assessment Scheme (ECAS) is a mandatory regulatory programme for specified products entering or sold in the UAE market, ensuring compliance with UAE national standards.',
        topics: [
          {
            id: 'ecas-topic-1',
            number: '01',
            title: 'Mandatory Regulated Categories',
            content:
              'ECAS covers electrical and electronic appliances, automotive spare parts, low voltage equipment, cosmetics, detergents, perfume products, paints, and energy efficiency labelling for consumer goods.',
          },
          {
            id: 'ecas-topic-2',
            number: '02',
            title: 'Assessment & Verification Model',
            content:
              'Compliance verification is conducted through technical file reviews, valid CB test certificates, UAE safety test reports, Arabic labeling checks, and declarations of conformity.',
          },
          {
            id: 'ecas-topic-3',
            number: '03',
            title: 'Certificate of Conformity (CoC)',
            content:
              'An approved ECAS Certificate of Conformity is issued for compliant products, valid for one year and directly integrated with UAE Customs for seamless clearance at ports of entry.',
          },
        ],
        ctaLabel: 'DISCUSS ECAS SCHEME',
        ctaUrl: '/contact?service=product-certification&scheme=ecas-scheme',
      },
      {
        id: 'g-mark',
        slug: 'g-mark',
        name: 'G Mark',
        region: 'GCC Member States',
        badgeLabel: 'G',
        seo: {
          title: 'Gulf Conformity Tracking (G Mark) Certification | ECASEURO',
          description:
            'Gulf Conformity Mark (G Mark) certification for low-voltage electrical equipment and toys across GCC member states through approved Notified Body assessment.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/g-mark',
          keywords: ['G Mark', 'Gulf Conformity Mark', 'GCC certification', 'GSO Notified Body'],
        },
        summary:
          'The Gulf Conformity Mark (G Mark) is mandatory for specific products imported into or traded across GCC member countries, establishing conformity with Gulf Technical Regulations.',
        topics: [
          {
            id: 'gmark-topic-1',
            number: '01',
            title: 'Regulated Scope (LVD & Toys)',
            content:
              'G Mark technical regulations apply across Saudi Arabia, UAE, Kuwait, Oman, Bahrain, Qatar, and Yemen to low-voltage electrical equipment (List 2 domestic appliances) and children’s toys.',
          },
          {
            id: 'gmark-topic-2',
            number: '02',
            title: 'Notified Body Assessment',
            content:
              'Manufacturers must engage an approved GSO Notified Body to evaluate technical documentation, test reports, risk analyses, and Arabic safety instructions.',
          },
          {
            id: 'gmark-topic-3',
            number: '03',
            title: 'G-Mark QR Tracking & Registration',
            content:
              'Approved products are registered in the Gulf Conformity Tracking System (GCTS), generating the official G Mark symbol alongside a dedicated QR code on product labeling.',
          },
        ],
        ctaLabel: 'DISCUSS G MARK',
        ctaUrl: '/contact?service=product-certification&scheme=g-mark',
      },
      {
        id: 'saso',
        slug: 'saso',
        name: 'SASO',
        region: 'Kingdom of Saudi Arabia',
        badgeLabel: 'SASO',
        seo: {
          title: 'SASO Certification & SABER Portal Services Saudi Arabia | ECASEURO',
          description:
            'Navigate SASO compliance and the SABER electronic portal for Saudi Arabia market entry. Assistance with Product (PCoC) and Shipment (SCoC) Certificates of Conformity.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/saso',
          keywords: ['SASO', 'SABER portal', 'PCoC', 'SCoC', 'Saudi Product Safety SALEEM'],
        },
        summary:
          'Product conformity assessment under the Saudi Standards, Metrology and Quality Organization (SASO) and the SABER electronic portal for goods entering the Saudi Arabian market.',
        topics: [
          {
            id: 'saso-topic-1',
            number: '01',
            title: 'Technical Regulations & SALEEM',
            content:
              'The Saudi Product Safety Programme (SALEEM) classifies imported goods into high, medium, and low risk categories governed by specific Technical Regulations (TRs).',
          },
          {
            id: 'saso-topic-2',
            number: '02',
            title: 'Product Certificate of Conformity (PCoC)',
            content:
              'Issued annually through the SABER portal by an approved SASO Conformity Assessment Body following review of test reports, quality documentation, and standard compliance.',
          },
          {
            id: 'saso-topic-3',
            number: '03',
            title: 'Shipment Certificate (SCoC)',
            content:
              'Every commercial consignment requires a Shipment Certificate of Conformity generated via SABER to obtain customs release at Saudi sea, air, and land ports.',
          },
        ],
        ctaLabel: 'DISCUSS SASO',
        ctaUrl: '/contact?service=product-certification&scheme=saso',
      },
      {
        id: 'ukca',
        slug: 'ukca',
        name: 'UKCA',
        region: 'United Kingdom (Great Britain)',
        badgeLabel: 'UKCA',
        seo: {
          title: 'UKCA Marking Certification for Great Britain Market | ECASEURO',
          description:
            'UK Conformity Assessed (UKCA) marking verification for goods placed on the market in Great Britain. Expert advice on UK statutory instruments and designated standards.',
          canonicalUrl: 'https://ecaseuro.com/services/product-certification/ukca',
          keywords: ['UKCA Marking', 'UK Conformity Assessed', 'Great Britain market access', 'UK Approved Body'],
        },
        summary:
          'The UK Conformity Assessed (UKCA) marking indicates conformity with applicable UK statutory instruments and designated standards for products placed on the market in Great Britain.',
        topics: [
          {
            id: 'ukca-topic-1',
            number: '01',
            title: 'Scope & Designated Standards',
            content:
              'Applies to manufactured goods in Great Britain across machinery, electrical equipment, pressure equipment, personal protective equipment, and radio devices conforming to UK Designated Standards.',
          },
          {
            id: 'ukca-topic-2',
            number: '02',
            title: 'UK Approved Body Verification',
            content:
              'For high-risk equipment categories where self-declaration is not permitted, conformity assessment must be undertaken by a UK Approved Body.',
          },
          {
            id: 'ukca-topic-3',
            number: '03',
            title: 'UK Declaration of Conformity',
            content:
              'Preparation of the UK Declaration of Conformity referencing UK legislation and affixing the UKCA mark directly to the product or packaging.',
          },
        ],
        ctaLabel: 'DISCUSS UKCA',
        ctaUrl: '/contact?service=product-certification&scheme=ukca',
      },
    ],
  },
  categories: {
    heading: 'CE Marking services across key product categories.',
    items: [
      {
        id: 'construction',
        name: 'Construction Products',
        iconKey: 'Buildings',
      },
      {
        id: 'machinery',
        name: 'Machinery',
        iconKey: 'Gear',
      },
      {
        id: 'telecom',
        name: 'Telecommunications',
        iconKey: 'Broadcast',
      },
      {
        id: 'gas',
        name: 'Gas Appliances',
        iconKey: 'Flame',
      },
      {
        id: 'pressure',
        name: 'Pressure Equipment',
        iconKey: 'Gauge',
      },
      {
        id: 'atex',
        name: 'ATEX Equipment',
        iconKey: 'ShieldWarning',
      },
      {
        id: 'low-voltage',
        name: 'Low-voltage Products',
        iconKey: 'Lightning',
      },
      {
        id: 'emc',
        name: 'Electromagnetic Compatibility',
        iconKey: 'Waveform',
      },
      {
        id: 'toys',
        name: 'Toys',
        iconKey: 'TeddyBear',
      },
    ],
  },
  internationalMarkets: {
    heading: 'Supporting product access across international markets.',
    items: [
      {
        id: 'market-eqm',
        schemeSlug: 'eqm',
        name: 'Emirates Quality Mark',
        marketLabel: 'UAE — Product and quality-system conformity',
        summary:
          'Quality mark certifying product and manufacturing process compliance with UAE national standards.',
        badgeLabel: 'EQM',
      },
      {
        id: 'market-ecas',
        schemeSlug: 'ecas-scheme',
        name: 'ECAS Scheme — Emirates Conformity Assessment Scheme',
        marketLabel: 'UAE — Conformity for government-regulated products',
        summary:
          'Conformity assessment programme for mandatory regulated electrical, gas and consumer products.',
        badgeLabel: 'ECAS',
      },
      {
        id: 'market-gmark',
        schemeSlug: 'g-mark',
        name: 'G Mark',
        marketLabel: 'GCC — Toys and low-voltage equipment',
        summary:
          'Gulf Conformity Mark for regulated low-voltage electrical goods and children’s toys across GCC member states.',
        badgeLabel: 'G',
      },
      {
        id: 'market-saso',
        schemeSlug: 'saso',
        name: 'SASO',
        marketLabel: 'Saudi Arabia — Product conformity for customs clearance',
        summary:
          'Technical conformity certification and SABER clearance support for goods entering the Saudi market.',
        badgeLabel: 'SASO',
      },
      {
        id: 'market-ukca',
        schemeSlug: 'ukca',
        name: 'UKCA',
        marketLabel: 'United Kingdom — UK product conformity marking',
        summary:
          'Conformity assessment and compliance verification for goods entering the Great Britain market.',
        badgeLabel: 'UKCA',
      },
    ],
  },
  faq: {
    heading: 'Commonly Asked\nQuestions',
    description:
      'Find clear answers regarding product conformity, testing requirements, technical files, and international market access.',
    items: [
      {
        id: 'faq-pc-1',
        number: '01',
        question: 'How do I determine which certification scheme applies to my product?',
        answer:
          'Applicability depends on the product category, intended application, and the destination country or economic area. Our compliance specialists review your product specifications, target markets, and relevant directives to outline the exact compliance roadmap.',
      },
      {
        id: 'faq-pc-2',
        number: '02',
        question: 'What is the difference between CE Marking and UKCA?',
        answer:
          'CE Marking applies to products placed on the market in the European Union / EEA, while UKCA (UK Conformity Assessed) is the product marking required for certain goods placed on the market in Great Britain (England, Wales, and Scotland). While both rely on similar principles of essential requirements and standards, they operate under distinct regulatory frameworks.',
      },
      {
        id: 'faq-pc-3',
        number: '03',
        question: 'What documents are required in a Technical Construction File (TCF)?',
        answer:
          'A Technical File typically includes product descriptions and schematics, risk analysis, list of applied harmonised or designated standards, test reports from accredited laboratories, manufacturing process documentation, user manuals, and the formal Declaration of Conformity.',
      },
      {
        id: 'faq-pc-4',
        number: '04',
        question: 'Can ECASEURO assist with multiple international markets simultaneously?',
        answer:
          'Yes. We provide integrated product compliance pathways that harmonise testing data and technical documentation across CE, UKCA, G Mark, SASO, and EQM to minimise duplicate laboratory testing and reduce overall time to market.',
      },
    ],
  },
  consultingCta: {
    heading: 'Need help identifying the\nright certification route?',
    description:
      'Tell us about your product and intended market. Our team will help you understand the applicable conformity requirements.',
    buttonLabel: 'DISCUSS YOUR PRODUCT',
    buttonHref: '/contact?service=product-certification',
  },
};
