import type { CbamVerificationPageContent } from './types';

/**
 * Default CBAM Verification Service Page Content
 * Structured for direct CMS schema alignment
 */
export const defaultCbamVerificationPageContent: CbamVerificationPageContent = {
  seo: {
    title: 'CBAM Verification | ECASEURO - Emissions Data Assured',
    description:
      'Independent verification of embedded greenhouse gas emissions data for organisations preparing to meet EU Carbon Border Adjustment Mechanism requirements.',
  },
  hero: {
    headingLines: ['CBAM Verification.', 'Emissions data, independently assured.'],
    description:
      'Independent verification of embedded greenhouse gas emissions data for organisations preparing to meet EU Carbon Border Adjustment Mechanism requirements.',
  },
  overview: {
    heading: 'What CBAM Verification does.',
    paragraphs: [
      'A CBAM verifier, as an independent third party, reviews and confirms the accuracy of greenhouse-gas emissions data reported by producers located outside the EU.',
      'From 2026, verification by an accredited body becomes mandatory for importers who declare actual embedded emission values under CBAM.',
    ],
    processSteps: [
      {
        id: 'step-producer',
        title: 'Producer',
        iconKey: 'factory',
        order: 1,
      },
      {
        id: 'step-emissions-data',
        title: 'Emissions Data',
        iconKey: 'emissions-data',
        order: 2,
      },
      {
        id: 'step-independent-verification',
        title: 'Independent Verification',
        iconKey: 'independent-verification',
        order: 3,
      },
      {
        id: 'step-declaration',
        title: 'EU CBAM Declaration',
        iconKey: 'declaration',
        order: 4,
      },
    ],
  },
  roles: {
    heading: 'Role of a CBAM verifier.',
    description:
      'CBAM verifiers play a critical role in ensuring the accuracy and credibility of embedded emissions data across the supply chain.',
    items: [
      {
        id: 'role-data-review',
        title: 'Data Review',
        description:
          'Assess monitoring approaches, calculation methodologies, and supporting evidence for embedded emissions.',
        iconKey: 'data-review',
        order: 1,
      },
      {
        id: 'role-site-visits',
        title: 'Site Visits',
        description:
          'Conduct physical or operational assessments at non-EU production installations.',
        iconKey: 'site-visits',
        order: 2,
      },
      {
        id: 'role-verification-reports',
        title: 'Verification Reports',
        description:
          "Issue a verification report containing an opinion statement for the EU importer's CBAM declaration.",
        iconKey: 'verification-reports',
        order: 3,
      },
      {
        id: 'role-pre-verification-visits',
        title: 'Pre-Verification Visits',
        description:
          'Assess readiness and the accuracy of current emissions information before formal verification requirements apply.',
        iconKey: 'pre-verification-visits',
        order: 4,
      },
    ],
  },
  status: {
    heading: 'Verifier status.',
    description:
      'Dedal has applied to BAS, an EU National Accreditation Body, to be approved as a CBAM Verifier.',
    supportingNote: 'Application information presented for reference.',
    iconKey: 'verifier-status',
  },
  consultingCta: {
    heading: 'Preparing for CBAM verification?',
    description:
      'Speak with our team about your emissions data, verification requirements and readiness for the next stage.',
    buttonLabel: 'GET IN TOUCH',
    buttonHref: '/contact?service=cbam-verification',
  },
};
