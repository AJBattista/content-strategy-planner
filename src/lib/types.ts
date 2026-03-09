// ---------------------------------------------------------------------------
// Core enums
// ---------------------------------------------------------------------------

export enum Industry {
  DTCEcommerce = 'dtc_ecommerce',
  B2BSaaS = 'b2b_saas',
  LocalServices = 'local_services',
  ConsumerApp = 'consumer_app',
  InfoProduct = 'info_product',
}

export enum BusinessObjective {
  LeadGeneration = 'lead_generation',
  DemoConsultation = 'demo_consultation',
  Purchase = 'purchase',
  SubscriptionApp = 'subscription_app',
}

export enum Channel {
  Instagram = 'instagram',
  TikTok = 'tiktok',
  LinkedIn = 'linkedin',
  Email = 'email',
  BlogSEO = 'blog_seo',
  Webinar = 'webinar',
}

export enum ContentFormat {
  ShortVideoUGC = 'short_video_ugc',
  CarouselMultiImage = 'carousel_multi_image',
  ThoughtLeadership = 'thought_leadership',
  CaseStudy = 'case_study',
  NewsletterOffer = 'newsletter_offer',
  WebinarLive = 'webinar_live',
}

// ---------------------------------------------------------------------------
// Benchmark fit
// ---------------------------------------------------------------------------

export type BenchmarkFitLabel = 'Strong Fit' | 'Viable' | 'Weak Fit' | 'Overextended';

// ---------------------------------------------------------------------------
// Channel-level types
// ---------------------------------------------------------------------------

export type ChannelType = 'social' | 'email' | 'seo' | 'webinar';

export type FormatFit = 'preferred' | 'neutral' | 'weak';

// ---------------------------------------------------------------------------
// User inputs
// ---------------------------------------------------------------------------

export interface ChannelPlanInput {
  channel: Channel;
  monthlyUnits: number;
  format: ContentFormat;
  trafficPerUnit: number;
  productionHours: number;
  destinationCVR?: number; // user override; undefined = use benchmark default
}

export interface PlannerInput {
  industry: Industry;
  objective: BusinessObjective;
  channelPlans: ChannelPlanInput[];
  monthlyAvailableHours: number;
  valuePerConversion: number;
}

// ---------------------------------------------------------------------------
// Diagnostic details (channel-specific)
// ---------------------------------------------------------------------------

export interface SocialDiagnostics {
  type: 'social';
  impressions: number;
  engagementRate: number;
  engagements: number;
}

export interface EmailDiagnostics {
  type: 'email';
  sends: number;
  openRate: number;
  opens: number;
  clickRate: number;
  clicks: number;
  conversions: number;
}

export interface SEODiagnostics {
  type: 'seo';
  articles: number;
  sessionsPerArticle: number;
  seoCVR: number;
  conversions: number;
}

export interface WebinarDiagnostics {
  type: 'webinar';
  registrations: number;
  attendees: number;
  ctaClicks: number;
  conversions: number;
}

export type ChannelDiagnostics =
  | SocialDiagnostics
  | EmailDiagnostics
  | SEODiagnostics
  | WebinarDiagnostics;

// ---------------------------------------------------------------------------
// Forecast outputs
// ---------------------------------------------------------------------------

export interface ChannelForecast {
  channel: Channel;
  forecastTraffic: number;
  forecastConversions: number;
  forecastRevenue: number;
  benchmarkFit: BenchmarkFitLabel;
  cadenceMultiplier: number;
  formatMultiplier: number;
  destinationCVR: number;
  revenuePerUnit: number;
  revenuePerHour: number;
  diagnostics: ChannelDiagnostics | null;
}

export interface RecommendedChannelMix {
  channel: Channel;
  recommendedUnits: number;
  currentUnits: number;
  delta: number;
  revenuePerUnit: number;
  revenuePerHour: number;
}

export type WarningType = 'underinvested' | 'overinvested';

export interface PlannerWarning {
  type: WarningType;
  channel: Channel;
  reason: string;
  suggestion: string;
}

export interface PlannerOutput {
  channelForecasts: ChannelForecast[];
  recommendedMix: RecommendedChannelMix[];
  warnings: PlannerWarning[];
  capacityUtilization: number;
  totalForecastTraffic: number;
  totalForecastConversions: number;
  totalForecastRevenue: number;
}

// ---------------------------------------------------------------------------
// Benchmark profile types
// ---------------------------------------------------------------------------

export interface ChannelBenchmark {
  available: boolean;
  benchmarkCadenceMonthly: number; // posts/sends/articles per month
  engagementRate: number | null;   // percentage as decimal (3.66% → 0.0366)
  openRate: number | null;         // email only
  clickRate: number | null;        // email only
  webinarAttendRate: number | null; // webinar only (0.57)
  webinarCTACTR: number | null;    // webinar only (0.0874)
  defaultCVR: Partial<Record<BusinessObjective, number>>; // decimal
  preferredFormats: ContentFormat[];
  channelType: ChannelType;
  weight: number; // relative priority 1-10 for recommendation engine
}

export interface IndustryBenchmarkProfile {
  industry: Industry;
  label: string;
  channels: Record<Channel, ChannelBenchmark>;
  valuePerConversionGuidance: string;
}
