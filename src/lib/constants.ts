import { BusinessObjective } from './types';

// ---------------------------------------------------------------------------
// Cadence multiplier table
// ---------------------------------------------------------------------------

export interface CadenceMultiplierBand {
  maxRatio: number; // planned / benchmark — upper bound (exclusive)
  multiplier: number;
}

export const CADENCE_MULTIPLIER_BANDS: CadenceMultiplierBand[] = [
  { maxRatio: 0.50, multiplier: 0.90 },  // under 50%
  { maxRatio: 1.20, multiplier: 1.00 },  // 50%–120%
  { maxRatio: 1.60, multiplier: 0.90 },  // 120%–160%
  { maxRatio: Infinity, multiplier: 0.75 }, // above 160%
];

// ---------------------------------------------------------------------------
// Format multiplier values
// ---------------------------------------------------------------------------

export const FORMAT_MULTIPLIER_PREFERRED = 1.10;
export const FORMAT_MULTIPLIER_NEUTRAL = 1.00;
export const FORMAT_MULTIPLIER_WEAK = 0.85;

// ---------------------------------------------------------------------------
// Content-unit ceilings
// ---------------------------------------------------------------------------

/** Social channels: hard cap at 2× benchmark cadence */
export const SOCIAL_CADENCE_CEILING_MULTIPLIER = 2.0;

/** Email: max 20 campaign sends per month */
export const EMAIL_MONTHLY_CEILING = 20;

/** Webinar: max 8 per month */
export const WEBINAR_MONTHLY_CEILING = 8;

// ---------------------------------------------------------------------------
// Destination CVR bounds (as decimals)
// ---------------------------------------------------------------------------

export interface CVRBounds {
  min: number;
  max: number;
}

export const CVR_BOUNDS: Record<BusinessObjective, CVRBounds> = {
  [BusinessObjective.LeadGeneration]: { min: 0.01, max: 0.15 },
  [BusinessObjective.Purchase]: { min: 0.005, max: 0.06 },
  [BusinessObjective.DemoConsultation]: { min: 0.005, max: 0.10 },
  [BusinessObjective.SubscriptionApp]: { min: 0.005, max: 0.03 },
};

// ---------------------------------------------------------------------------
// Webinar funnel constants
// ---------------------------------------------------------------------------

export const WEBINAR_ATTEND_RATE = 0.57;
export const WEBINAR_CTA_CTR = 0.0874;

// ---------------------------------------------------------------------------
// Display labels
// ---------------------------------------------------------------------------

export const INDUSTRY_LABELS: Record<string, string> = {
  dtc_ecommerce: 'DTC Ecommerce',
  b2b_saas: 'B2B SaaS',
  local_services: 'Local Services',
  consumer_app: 'Consumer App',
  info_product: 'Info Product / Creator Brand',
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  lead_generation: 'Lead Generation',
  demo_consultation: 'Demo / Consultation Booking',
  purchase: 'Purchase',
  subscription_app: 'Subscription / App Purchase',
};

export const CHANNEL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  email: 'Email',
  blog_seo: 'Blog / SEO',
  webinar: 'Webinar',
};

export const FORMAT_LABELS: Record<string, string> = {
  short_video_ugc: 'Short Video / UGC',
  carousel_multi_image: 'Carousel / Multi-image',
  thought_leadership: 'Thought Leadership Article',
  case_study: 'Case Study / Proof',
  newsletter_offer: 'Newsletter / Offer Email',
  webinar_live: 'Webinar / Live Session',
};
