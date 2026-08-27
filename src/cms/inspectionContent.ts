import type {
  InspectionHeroContent,
  ThirdPartyInspectionContent,
  InspectionCapabilitiesContent,
  EquipmentCoverageContent,
  MillInspectionContent,
  LiftingEquipmentContent,
  ConsultingCTAContent,
  InspectionPageContent,
} from './types';

export const defaultInspectionHeroContent: InspectionHeroContent = {
  headingLines: ['Independent inspection.', 'Confidence at every stage.'],
  description:
    'ECASEURO provides independent inspection and surveillance services across projects, equipment and industrial supply chains — helping organisations verify compliance, identify issues early and maintain confidence throughout execution.',
};

export const defaultThirdPartyInspectionContent: ThirdPartyInspectionContent = {
  heading: 'Third Party Inspections',
  description:
    'ECASEURO independently verifies compliance during design, construction, installation, and commissioning to identify quality issues early, monitor processes, reduce rework, and avoid cost overruns.',
  image: {
    src: '/images/inspection/third-party-inspection.webp',
    alt: 'Industrial engineer reviewing technical specifications and inspecting plant piping',
  },
  overlay: {
    heading: 'Independent. Impartial. Reliable.',
    description: 'Objective assurance at every critical stage of your project.',
    iconKey: 'shield',
  },
  stages: [
    {
      id: 'stage-design',
      number: '01',
      title: 'Design',
      description:
        'Review and verification of design against codes, standards and client requirements.',
      iconKey: 'blueprint',
      order: 1,
    },
    {
      id: 'stage-construction',
      number: '02',
      title: 'Construction',
      description:
        'Inspection and monitoring of materials, fabrication and construction activities to ensure compliance.',
      iconKey: 'crane',
      order: 2,
    },
    {
      id: 'stage-installation',
      number: '03',
      title: 'Installation',
      description:
        'Verification of installation quality and conformity to specifications and procedures.',
      iconKey: 'wrench',
      order: 3,
    },
    {
      id: 'stage-commissioning',
      number: '04',
      title: 'Commissioning',
      description:
        'Final inspection and documentation to confirm readiness for safe and reliable operation.',
      iconKey: 'shield-check',
      order: 4,
    },
  ],
};

export const defaultInspectionCapabilitiesContent: InspectionCapabilitiesContent = {
  heading: 'Inspection & Surveillance Capabilities',
  description:
    'Choose the inspection capability that best supports your project oversight, vendor evaluation and mill process assurance.',
  capabilities: [
    {
      id: 'cap-vendor-expediting',
      title: 'Vendor Expediting',
      description:
        'Progress monitoring against schedules to identify bottlenecks and surface quality issues before delays occur.',
      iconKey: 'clock-countdown',
      order: 1,
    },
    {
      id: 'cap-vendor-audits',
      title: 'Vendor Audits',
      description:
        'Technical and resource assessment audits that help evaluate whether vendors can deliver on time, as promised and to specification.',
      iconKey: 'clipboard-text',
      order: 2,
    },
    {
      id: 'cap-mill-inspection',
      title: 'Mill Inspection & Surveillance',
      description:
        'Specialist surveillance across mill processes including forming, welding, NDT, testing, threading, coatings and loading.',
      iconKey: 'factory',
      order: 3,
    },
  ],
};

export const defaultEquipmentCoverageContent: EquipmentCoverageContent = {
  heading: 'Coverage across critical industrial equipment.',
  description:
    'Independent inspection services across key industrial products, components and equipment categories.',
  items: [
    {
      id: 'eq-pressure-vessels',
      title: 'Pressure Vessels',
      iconKey: 'cylinder',
      order: 1,
    },
    {
      id: 'eq-boilers',
      title: 'Boilers',
      iconKey: 'flame',
      order: 2,
    },
    {
      id: 'eq-heat-exchangers',
      title: 'Heat Exchangers',
      iconKey: 'equalizer',
      order: 3,
    },
    {
      id: 'eq-tanks',
      title: 'Tanks',
      iconKey: 'vault',
      order: 4,
    },
    {
      id: 'eq-pumps',
      title: 'Pumps',
      iconKey: 'engine',
      order: 5,
    },
    {
      id: 'eq-turbines',
      title: 'Turbines',
      iconKey: 'fan',
      order: 6,
    },
    {
      id: 'eq-compressors',
      title: 'Compressors',
      iconKey: 'cpu',
      order: 7,
    },
    {
      id: 'eq-valves',
      title: 'Valves',
      iconKey: 'faders',
      order: 8,
    },
    {
      id: 'eq-pipes',
      title: 'Pipes',
      iconKey: 'pipe',
      order: 9,
    },
    {
      id: 'eq-piping-materials',
      title: 'Piping Materials',
      iconKey: 'nut',
      order: 10,
    },
    {
      id: 'eq-electrical-equipment',
      title: 'Electrical Equipment',
      iconKey: 'lightning',
      order: 11,
    },
    {
      id: 'eq-instruments',
      title: 'Instruments',
      iconKey: 'gauge',
      order: 12,
    },
  ],
};

export const defaultMillInspectionContent: MillInspectionContent = {
  heading: 'Mill Inspection & Surveillance',
  paragraph1:
    'We provide specialist inspection and surveillance across all critical mill processes to help ensure product quality, integrity and compliance at every stage.',
  paragraph2:
    'Our inspectors verify workmanship, materials and testing in line with applicable standards and client specifications.',
  stages: [
    {
      id: 'mill-stage-01',
      title: 'Forming',
      iconKey: 'scroll',
      order: 1,
    },
    {
      id: 'mill-stage-02',
      title: 'Welding',
      iconKey: 'pen-nib',
      order: 2,
    },
    {
      id: 'mill-stage-03',
      title: 'NDT',
      iconKey: 'magnifying-glass',
      order: 3,
    },
    {
      id: 'mill-stage-04',
      title: 'Testing',
      iconKey: 'clipboard-text',
      order: 4,
    },
    {
      id: 'mill-stage-05',
      title: 'Threading',
      iconKey: 'stack',
      order: 5,
    },
    {
      id: 'mill-stage-06',
      title: 'Coatings',
      iconKey: 'paint-roller',
      order: 6,
    },
    {
      id: 'mill-stage-07',
      title: 'Loading',
      iconKey: 'anchor',
      order: 7,
    },
  ],
  infoStripText:
    'Specialist surveillance across mill processes, from material forming through final loading — ensuring quality, safety and compliance at every stage.',
  infoStripIconKey: 'shield-check',
};

export const defaultLiftingEquipmentContent: LiftingEquipmentContent = {
  heading: 'Lifting Equipment Inspection',
  description:
    'ECASEURO provides independent inspection, testing and certification of lifting equipment to ensure safe operation and regulatory compliance across onshore and offshore applications.',
  image: '/images/inspection/lifting-equipment.webp',
  imageAlt:
    'Heavy-duty industrial crane hook and rigging tackle during lifting equipment inspection',
  services: [
    {
      id: 'lift-witnessing',
      title: 'Witnessing & Commissioning',
      iconKey: 'user-focus',
      order: 1,
    },
    {
      id: 'lift-load-testing',
      title: 'Load Testing',
      iconKey: 'barbell',
      order: 2,
    },
    {
      id: 'lift-periodic-inspections',
      title: 'Periodic Inspections',
      iconKey: 'clipboard-text',
      order: 3,
    },
    {
      id: 'lift-recertification',
      title: 'Recertification',
      iconKey: 'certificate',
      order: 4,
    },
    {
      id: 'lift-tackles-equipment',
      title: 'Lifting Tackles & Equipment',
      iconKey: 'crane',
      order: 5,
    },
    {
      id: 'lift-onshore-offshore',
      title: 'Onshore & Offshore Inspection',
      iconKey: 'boat',
      order: 6,
    },
  ],
};

export const defaultInspectionConsultingCTAContent: ConsultingCTAContent = {
  heading: 'Need support with an inspection requirement?',
  description:
    'Speak with our team about your project, equipment or inspection scope and understand the next steps.',
  buttonLabel: 'GET IN TOUCH',
  buttonHref: '/contact?service=inspection',
};

export const defaultInspectionPageContent: InspectionPageContent = {
  seo: {
    title: 'Inspection Services | Independent Quality & Technical Assurance | ECASEURO',
    description:
      'Independent third party inspection and technical surveillance across design, construction, installation, and commissioning for industrial projects and equipment.',
    canonicalUrl: '/services/inspection',
    keywords: [
      'Third Party Inspection',
      'Quality Assurance',
      'Industrial Inspection',
      'Construction Inspection',
      'Commissioning Verification',
      'ECASEURO',
    ],
  },
  hero: defaultInspectionHeroContent,
  thirdParty: defaultThirdPartyInspectionContent,
  capabilities: defaultInspectionCapabilitiesContent,
  equipmentCoverage: defaultEquipmentCoverageContent,
  millInspection: defaultMillInspectionContent,
  liftingEquipment: defaultLiftingEquipmentContent,
  consultingCta: defaultInspectionConsultingCTAContent,
};
