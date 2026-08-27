/**
 * ECASEURO CMS Content Types
 * Extensible TypeScript interfaces for future CMS integration
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: ImageAsset;
  noIndex?: boolean;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface CTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'text';
  isExternal?: boolean;
  target?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
  isExternal?: boolean;
}

export interface HomeHeroContent {
  headingLines: string[];
  description: string;
  globeAsset?: ImageAsset;
}

export interface AboutHeroContent {
  headingLines: string[];
  description: string;
  visualAsset?: ImageAsset;
}

export interface AboutValueItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: 'eye' | 'target';
}

export interface AboutVisionMissionContent {
  heading: string;
  description: string;
  items: AboutValueItem[];
  supportStatement: string;
  supportMapAsset?: ImageAsset;
}

export interface AboutConfidenceItem {
  id: string;
  title: string;
  description: string;
  icon: 'chat' | 'shield' | 'buildings' | 'arrows-clockwise';
  image?: ImageAsset;
}

export interface AboutConfidenceContent {
  heading: string;
  description: string;
  items: AboutConfidenceItem[];
}

export interface AboutCertificationFeatureItem {
  id: string;
  title: string;
  description: string;
  icon: 'certificate' | 'scales' | 'globe' | 'graduation-cap' | 'shield';
}

export interface AboutCertificationConfidenceContent {
  heading: string;
  description: string;
  features: AboutCertificationFeatureItem[];
}

export interface IndustryItem {
  id: string;
  label: string;
  iconKey: string;
}

export interface GlobalCountriesCardContent {
  headline: string;
  subtitle: string;
  description: string;
  subDescription?: string;
  locations: string[];
}

export interface GlobalWorldwideCardContent {
  headline: string;
  subtitle: string;
  description: string;
  image?: ImageAsset;
}

export interface GlobalOfficesCardContent {
  headline: string;
  subtitle: string;
  description: string;
}

export interface GlobalIndustriesCardContent {
  headline: string;
  subtitle: string;
  description: string;
  items: IndustryItem[];
}

export interface AboutGlobalExpertiseContent {
  heading: string;
  description: string;
  countries: GlobalCountriesCardContent;
  worldwide: GlobalWorldwideCardContent;
  offices: GlobalOfficesCardContent;
  industries: GlobalIndustriesCardContent;
}

export interface ConsultingCTAContent {
  heading: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface AboutPageContent {
  seo: SEOData;
  hero: AboutHeroContent;
  visionMission: AboutVisionMissionContent;
  confidence: AboutConfidenceContent;
  certificationConfidence: AboutCertificationConfidenceContent;
  globalExpertise: AboutGlobalExpertiseContent;
  consultingCta: ConsultingCTAContent;
}

export interface TrainingCourse {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
  keywords?: string[];
}

export interface TrainingCoursesSectionContent {
  heading: string;
  description: string;
  searchPlaceholder: string;
  noResultsText?: string;
  courses: TrainingCourse[];
}

export interface FlexibleLearningFormat {
  id: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface FlexibleLearningSectionContent {
  heading: string;
  description: string;
  formats: FlexibleLearningFormat[];
}

export interface TrainingHeroContent {
  headingLines: string[];
  description: string;
}

export interface TrainingPageContent {
  seo: SEOData;
  hero: TrainingHeroContent;
  courses: TrainingCoursesSectionContent;
  flexibleLearning: FlexibleLearningSectionContent;
  faq: HomeFAQContent;
  consultingCta: ConsultingCTAContent;
}

export interface ManagementStandardModalContent {
  overview?: string;
  applicability?: string;
  focusAreas?: string[];
}

export interface ManagementStandard {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  keywords?: string[];
  modal?: ManagementStandardModalContent;
  seo?: SEOData;
}

export interface ManagementStandardsSectionContent {
  heading: string;
  description: string;
  searchPlaceholder: string;
  noResultsText?: string;
  standards: ManagementStandard[];
}

export interface ManagementSystemHeroContent {
  headingLines: string[];
  description: string;
}

export interface ManagementSystemPageContent {
  seo: SEOData;
  hero: ManagementSystemHeroContent;
  standardsSection: ManagementStandardsSectionContent;
  faq: HomeFAQContent;
  consultingCta: ConsultingCTAContent;
}

export interface AssociationPartner {
  id: string;
  slug: string;
  order: number;
  name: string;
  location?: string;
  logo?: string;
  logoAlt?: string;
  grayscaleOnHover?: boolean;
  useGrayscaleLogo?: boolean;
  shortDescription?: string;
  profile?: {
    overview: string;
    services?: string[];
    specialties?: string[];
  };
  websiteUrl?: string;
  seo?: SEOData;
}

export interface AssociationsHeroContent {
  headingLines: string[];
  description: string;
}

export interface AssociationsIntroContent {
  heading: string;
  description: string;
}

export interface AssociationsPageContent {
  seo: SEOData;
  hero: AssociationsHeroContent;
  intro: AssociationsIntroContent;
  partners: AssociationPartner[];
  consultingCta: ConsultingCTAContent;
}

export type ESGPillarIconKey =
  | 'leaf'
  | 'globe'
  | 'users'
  | 'handshake'
  | 'scales'
  | 'shield';

export interface ESGPillar {
  id: string;
  number: string;
  title: string;
  description?: string;
  topics: string[];
  iconKey: ESGPillarIconKey;
  order: number;
}

export interface ESGSectionContent {
  heading: string;
  description: string;
  pillars: ESGPillar[];
}

export interface ESGHeroContent {
  headingLines: string[];
  description: string;
}

export interface ESGPageContent {
  seo: SEOData;
  hero: ESGHeroContent;
  esgSection: ESGSectionContent;
  faq: HomeFAQContent;
  consultingCta: ConsultingCTAContent;
}

export type FeaturedServiceVisualType =
  | 'management-system'
  | 'product-certification'
  | 'training';

export interface FeaturedServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  visualType?: FeaturedServiceVisualType;
  metadata?: {
    statusText?: string;
    chips?: string[];
    statNumber?: string;
    statUnit?: string;
  };
}

export interface HomeServicesSectionContent {
  heading: string;
  description: string;
  cta: CTA;
  services: FeaturedServiceItem[];
}

export interface CertificateShortcutContent {
  heading: string;
  placeholder: string;
  buttonLabel: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface HomeCertificationProcessContent {
  heading: string;
  description: string;
  steps: ProcessStep[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  personName: string;
  organisation?: string;
  image?: ImageAsset;
}

export interface HomeTestimonialsContent {
  heading: string;
  description: string;
  testimonials: TestimonialItem[];
}

export interface PageHeroContent {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  backgroundImage?: ImageAsset;
}

export interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category?: ServiceCategory | string;
  shortDescription: string;
  fullDescription?: string;
  icon?: string;
  heroImage?: ImageAsset;
  benefits?: string[];
  standardsCovered?: string[];
  cta?: CTA;
}

export interface Accreditation {
  id: string;
  name: string;
  shortCode?: string;
  description?: string;
  logo?: ImageAsset;
  issuingBody?: string;
  scope?: string;
  verificationUrl?: string;
}

export interface Association {
  id: string;
  name: string;
  description?: string;
  logo?: ImageAsset;
  websiteUrl?: string;
  membershipType?: string;
}

export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category?: string;
}

export interface HomeFAQContent {
  heading: string;
  description: string;
  items: FAQItem[];
}

export type HomeConsultingCTAContent = ConsultingCTAContent;

export interface FooterNavItem {
  id: string;
  label: string;
  href?: string;
  isExpandable?: boolean;
  children?: { label: string; href: string }[];
}

export interface FooterContent {
  brandHeading: string;
  description: string;
  verificationPlaceholder: string;
  verificationButtonLabel: string;
  logoAsset: ImageAsset;
  navigation: FooterNavItem[];
  copyright: string;
  privacyLabel: string;
  privacyHref: string;
  termsLabel: string;
  termsHref: string;
}

export interface HomePageContent {
  seo?: SEOData;
  hero: HomeHeroContent;
  services: HomeServicesSectionContent;
  certificateShortcut: CertificateShortcutContent;
  process: HomeCertificationProcessContent;
  testimonials: HomeTestimonialsContent;
  faq: HomeFAQContent;
  consultingCta: HomeConsultingCTAContent;
  footer: FooterContent;
}

export interface ContactDetails {
  organizationName: string;
  email: string;
  phone?: string;
  address?: {
    streetAddress: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  officeHours?: string;
  emergencyContact?: string;
}

export interface ContactOffice {
  id: string;
  title: string;
  region?: string;
  address?: {
    street?: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  phone?: string;
  email?: string;
  order: number;
}

export interface SiteSettingsCompany {
  organizationName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  businessHours?: string;
  emergencyContact?: string;
}

export interface SiteSettingsContent {
  company: SiteSettingsCompany;
  offices: ContactOffice[];
}

export interface ContactHeroContent {
  headingLines: string[];
  description: string;
}

export interface ContactIntroContent {
  heading: string;
  description: string;
}

export interface ContactFormConfig {
  heading?: string;
  description?: string;
  enquiryTypes: string[];
  submitButtonLabel: string;
  successMessage: {
    title: string;
    description: string;
    actionLabel: string;
  };
}

export interface ContactPageContent {
  seo: SEOData;
  hero: ContactHeroContent;
  intro: ContactIntroContent;
  offices: ContactOffice[];
  form: ContactFormConfig;
}

export type ContactEnquiry = {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  enquiryType: string;
  message: string;
  sourcePage: string;
  submittedAt?: string;
  status?: 'new' | 'in-progress' | 'resolved';
  internalNotes?: string;
};

export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
  enquiryId?: string;
  errors?: Record<string, string>;
}

export interface ProductCertificationTopic {
  id: string;
  number?: string;
  title: string;
  content: string;
}

export interface ProductCertificationScheme {
  id: string;
  slug: string;
  name: string;
  region?: string;
  summary: string;
  badgeLabel?: string;
  iconKey?: string;
  seo?: SEOData;
  topics: ProductCertificationTopic[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  iconKey: string;
}

export interface InternationalMarketSummary {
  id: string;
  schemeSlug: string;
  name: string;
  marketLabel: string;
  summary: string;
  badgeLabel?: string;
  iconKey?: string;
}

export interface ProductCertificationHeroContent {
  headingLines: string[];
  description: string;
}

export interface ProductCertificationExplorerContent {
  heading: string;
  description: string;
  schemes: ProductCertificationScheme[];
}

export interface ProductCategoriesSectionContent {
  heading: string;
  items: ProductCategory[];
}

export interface InternationalMarketsSectionContent {
  heading: string;
  items: InternationalMarketSummary[];
}

export interface ProductCertificationPageContent {
  seo: SEOData;
  hero: ProductCertificationHeroContent;
  explorer: ProductCertificationExplorerContent;
  categories: ProductCategoriesSectionContent;
  internationalMarkets: InternationalMarketsSectionContent;
  faq: HomeFAQContent;
  consultingCta: ConsultingCTAContent;
}

export interface InspectionHeroContent {
  headingLines: string[];
  description: string;
}

export interface ProjectStageItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconKey: string;
  order: number;
}

export interface ThirdPartyInspectionOverlay {
  heading: string;
  description: string;
  iconKey?: string;
}

export interface ThirdPartyInspectionContent {
  heading: string;
  description: string;
  image: ImageAsset;
  overlay: ThirdPartyInspectionOverlay;
  stages: ProjectStageItem[];
}

export interface InspectionCapabilityItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  order: number;
}

export interface InspectionCapabilitiesContent {
  heading: string;
  description: string;
  capabilities: InspectionCapabilityItem[];
}

export interface EquipmentItem {
  id: string;
  title: string;
  iconKey: string;
  order: number;
}

export interface EquipmentCoverageContent {
  heading: string;
  description: string;
  items: EquipmentItem[];
}

export interface MillInspectionProcessStage {
  id: string;
  title: string;
  iconKey: string;
  order: number;
}

export interface MillInspectionContent {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  stages: MillInspectionProcessStage[];
  infoStripText: string;
  infoStripIconKey?: string;
  backgroundGraphic?: string;
}

export interface LiftingEquipmentServiceItem {
  id: string;
  title: string;
  iconKey: string;
  order: number;
}

export interface LiftingEquipmentContent {
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  services: LiftingEquipmentServiceItem[];
}

export interface InspectionPageContent {
  seo: SEOData;
  hero: InspectionHeroContent;
  thirdParty: ThirdPartyInspectionContent;
  capabilities: InspectionCapabilitiesContent;
  equipmentCoverage: EquipmentCoverageContent;
  millInspection: MillInspectionContent;
  liftingEquipment: LiftingEquipmentContent;
  consultingCta: ConsultingCTAContent;
}

export interface CbamHeroContent {
  headingLines: string[];
  description: string;
}

export interface CbamProcessStep {
  id: string;
  title: string;
  iconKey: string;
  order: number;
}

export interface CbamOverviewContent {
  heading: string;
  paragraphs: string[];
  processSteps: CbamProcessStep[];
}

export interface CbamVerifierRoleItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  order: number;
}

export interface CbamVerifierRoleContent {
  heading: string;
  description: string;
  items: CbamVerifierRoleItem[];
}

export interface CbamVerifierStatusContent {
  heading: string;
  description: string;
  supportingNote: string;
  iconKey: string;
}

export interface CbamVerificationPageContent {
  seo: SEOData;
  hero: CbamHeroContent;
  overview: CbamOverviewContent;
  roles: CbamVerifierRoleContent;
  status: CbamVerifierStatusContent;
  consultingCta: ConsultingCTAContent;
}

// ---------------------------------------------------------------------------
// News & Insights Content Model (Content-as-Data)
// ---------------------------------------------------------------------------

export type NewsCategory =
  | 'All'
  | 'Regulatory Updates'
  | 'Standards & Certification'
  | 'CBAM & ESG'
  | 'Industry Insights'
  | 'Sector Developments'
  | 'Company News';

export interface NewsArticleAuthor {
  name: string;
  role: string;
  avatar?: string;
  organization?: string;
}

export type NewsContentBlockType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'list'
  | 'callout'
  | 'keyTakeaway';

export interface NewsContentBlock {
  type: NewsContentBlockType;
  text?: string;
  items?: string[];
  heading?: string;
  quote?: string;
  citation?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  publishedAt: string;
  formattedDate: string;
  readTime: string;
  excerpt: string;
  featured?: boolean;
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: NewsArticleAuthor;
  tags?: string[];
  content: NewsContentBlock[];
  seo: SEOData;
}

export interface NewsHeroContent {
  headingLines: string[];
  description: string;
}

export interface NewsPageContent {
  seo: SEOData;
  hero: NewsHeroContent;
  categories: NewsCategory[];
  articles: NewsArticle[];
  consultingCta: ConsultingCTAContent;
}




