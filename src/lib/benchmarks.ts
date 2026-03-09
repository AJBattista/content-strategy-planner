import {
  Industry,
  BusinessObjective,
  Channel,
  ContentFormat,
  IndustryBenchmarkProfile,
  ChannelBenchmark,
} from './types';

// ---------------------------------------------------------------------------
// Helper to build a channel benchmark with sensible defaults
// ---------------------------------------------------------------------------

function ch(
  overrides: Partial<ChannelBenchmark> & Pick<ChannelBenchmark, 'channelType'>
): ChannelBenchmark {
  return {
    available: true,
    benchmarkCadenceMonthly: 0,
    engagementRate: null,
    openRate: null,
    clickRate: null,
    webinarAttendRate: null,
    webinarCTACTR: null,
    defaultCVR: {},
    preferredFormats: [],
    weight: 5,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// DTC Ecommerce
// ---------------------------------------------------------------------------

const dtcEcommerce: IndustryBenchmarkProfile = {
  industry: Industry.DTCEcommerce,
  label: 'DTC Ecommerce',
  valuePerConversionGuidance: 'Enter your contribution margin per order',
  channels: {
    [Channel.Instagram]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 100, // ~25/week × 4
      engagementRate: 0.0366,
      defaultCVR: {
        [BusinessObjective.Purchase]: 0.014,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.014,
        [BusinessObjective.SubscriptionApp]: 0.014,
      },
      preferredFormats: [ContentFormat.CarouselMultiImage, ContentFormat.ShortVideoUGC],
      weight: 9,
    }),
    [Channel.TikTok]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 18, // ~4.5/week × 4
      engagementRate: 0.0174,
      defaultCVR: {
        [BusinessObjective.Purchase]: 0.014,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.014,
        [BusinessObjective.SubscriptionApp]: 0.014,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 8,
    }),
    [Channel.LinkedIn]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 60, // ~15/week × 4
      engagementRate: 0.0415,
      defaultCVR: {
        [BusinessObjective.Purchase]: 0.014,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.014,
        [BusinessObjective.SubscriptionApp]: 0.014,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 3, // optional for DTC
    }),
    [Channel.Email]: ch({
      channelType: 'email',
      benchmarkCadenceMonthly: 12, // ~3/week reasonable for DTC
      openRate: 0.2981,
      clickRate: 0.0174,
      defaultCVR: {
        [BusinessObjective.Purchase]: 0.014,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.014,
        [BusinessObjective.SubscriptionApp]: 0.014,
      },
      preferredFormats: [ContentFormat.NewsletterOffer],
      weight: 7,
    }),
    [Channel.BlogSEO]: ch({
      channelType: 'seo',
      benchmarkCadenceMonthly: 8, // reasonable for DTC blog
      defaultCVR: {
        [BusinessObjective.Purchase]: 0.014,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.014,
        [BusinessObjective.SubscriptionApp]: 0.014,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy],
      weight: 5,
    }),
    [Channel.Webinar]: ch({
      channelType: 'webinar',
      available: false, // not a core DTC channel
      benchmarkCadenceMonthly: 0,
      preferredFormats: [ContentFormat.WebinarLive],
      weight: 1,
    }),
  },
};

// ---------------------------------------------------------------------------
// B2B SaaS
// ---------------------------------------------------------------------------

const b2bSaaS: IndustryBenchmarkProfile = {
  industry: Industry.B2BSaaS,
  label: 'B2B SaaS',
  valuePerConversionGuidance: 'Enter expected gross profit per lead or booked demo',
  channels: {
    [Channel.Instagram]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 72, // ~18/week × 4
      engagementRate: 0.0357,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.017,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.017,
        [BusinessObjective.SubscriptionApp]: 0.017,
      },
      preferredFormats: [ContentFormat.CarouselMultiImage],
      weight: 4,
    }),
    [Channel.TikTok]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 12, // ~3/week × 4
      engagementRate: 0.0074,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.017,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.017,
        [BusinessObjective.SubscriptionApp]: 0.017,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 2, // optional, secondary
    }),
    [Channel.LinkedIn]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 8, // ~2/week × 4
      engagementRate: 0.0372,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.017,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.017,
        [BusinessObjective.SubscriptionApp]: 0.017,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC, ContentFormat.ThoughtLeadership],
      weight: 9,
    }),
    [Channel.Email]: ch({
      channelType: 'email',
      benchmarkCadenceMonthly: 8, // ~2/week
      openRate: 0.2981, // use Mailchimp general benchmark
      clickRate: 0.0174,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.024,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.024,
        [BusinessObjective.SubscriptionApp]: 0.024,
      },
      preferredFormats: [ContentFormat.NewsletterOffer],
      weight: 8,
    }),
    [Channel.BlogSEO]: ch({
      channelType: 'seo',
      benchmarkCadenceMonthly: 8,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.026,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.026,
        [BusinessObjective.SubscriptionApp]: 0.026,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy],
      weight: 9,
    }),
    [Channel.Webinar]: ch({
      channelType: 'webinar',
      benchmarkCadenceMonthly: 4, // ~1/week
      webinarAttendRate: 0.57,
      webinarCTACTR: 0.0874,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.023,
        [BusinessObjective.DemoConsultation]: 0.038,
        [BusinessObjective.Purchase]: 0.023,
        [BusinessObjective.SubscriptionApp]: 0.023,
      },
      preferredFormats: [ContentFormat.WebinarLive],
      weight: 8,
    }),
  },
};

// ---------------------------------------------------------------------------
// Local Services
// ---------------------------------------------------------------------------

const localServices: IndustryBenchmarkProfile = {
  industry: Industry.LocalServices,
  label: 'Local Services',
  valuePerConversionGuidance: 'Enter average gross profit per booked job',
  channels: {
    [Channel.Instagram]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 8, // ~2/week × 4
      engagementRate: 0.0423,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.029,
        [BusinessObjective.DemoConsultation]: 0.029,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.SubscriptionApp]: 0.015,
      },
      preferredFormats: [ContentFormat.CarouselMultiImage],
      weight: 8,
    }),
    [Channel.TikTok]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 12, // ~3/week × 4
      engagementRate: 0.0095,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.015,
        [BusinessObjective.DemoConsultation]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.SubscriptionApp]: 0.015,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 2, // experimental
    }),
    [Channel.LinkedIn]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 8, // ~2/week × 4
      engagementRate: 0.0336,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.029,
        [BusinessObjective.DemoConsultation]: 0.029,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.SubscriptionApp]: 0.015,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC, ContentFormat.ThoughtLeadership],
      weight: 7,
    }),
    [Channel.Email]: ch({
      channelType: 'email',
      benchmarkCadenceMonthly: 8,
      openRate: 0.2981,
      clickRate: 0.0174,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.026,
        [BusinessObjective.DemoConsultation]: 0.026,
        [BusinessObjective.Purchase]: 0.026,
        [BusinessObjective.SubscriptionApp]: 0.026,
      },
      preferredFormats: [ContentFormat.NewsletterOffer],
      weight: 8,
    }),
    [Channel.BlogSEO]: ch({
      channelType: 'seo',
      benchmarkCadenceMonthly: 8,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.027,
        [BusinessObjective.DemoConsultation]: 0.027,
        [BusinessObjective.Purchase]: 0.027,
        [BusinessObjective.SubscriptionApp]: 0.027,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy],
      weight: 9,
    }),
    [Channel.Webinar]: ch({
      channelType: 'webinar',
      available: false, // not a core local services channel
      benchmarkCadenceMonthly: 0,
      preferredFormats: [ContentFormat.WebinarLive],
      weight: 1,
    }),
  },
};

// ---------------------------------------------------------------------------
// Consumer App
// ---------------------------------------------------------------------------

const consumerApp: IndustryBenchmarkProfile = {
  industry: Industry.ConsumerApp,
  label: 'Consumer App',
  valuePerConversionGuidance: 'Enter day-90 value or first-purchase value per user',
  channels: {
    [Channel.Instagram]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 72, // use tech benchmark ~18/week
      engagementRate: 0.0357,
      defaultCVR: {
        // install-to-purchase: 1.5% midpoint of 1–2%
        [BusinessObjective.SubscriptionApp]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.015,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC, ContentFormat.CarouselMultiImage],
      weight: 8,
    }),
    [Channel.TikTok]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 12, // ~3/week
      engagementRate: 0.0074,
      defaultCVR: {
        [BusinessObjective.SubscriptionApp]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.015,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 8,
    }),
    [Channel.LinkedIn]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 8,
      engagementRate: 0.0372,
      defaultCVR: {
        [BusinessObjective.SubscriptionApp]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.015,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership],
      weight: 3, // only if professional angle
    }),
    [Channel.Email]: ch({
      channelType: 'email',
      benchmarkCadenceMonthly: 8,
      openRate: 0.2981,
      clickRate: 0.0174,
      defaultCVR: {
        [BusinessObjective.SubscriptionApp]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.015,
      },
      preferredFormats: [ContentFormat.NewsletterOffer],
      weight: 6,
    }),
    [Channel.BlogSEO]: ch({
      channelType: 'seo',
      benchmarkCadenceMonthly: 8,
      defaultCVR: {
        [BusinessObjective.SubscriptionApp]: 0.015,
        [BusinessObjective.Purchase]: 0.015,
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.015,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy],
      weight: 5,
    }),
    [Channel.Webinar]: ch({
      channelType: 'webinar',
      available: false,
      benchmarkCadenceMonthly: 0,
      preferredFormats: [ContentFormat.WebinarLive],
      weight: 1,
    }),
  },
};

// ---------------------------------------------------------------------------
// Info Product / Creator Brand
// ---------------------------------------------------------------------------

const infoProduct: IndustryBenchmarkProfile = {
  industry: Industry.InfoProduct,
  label: 'Info Product / Creator Brand',
  valuePerConversionGuidance: 'Enter contribution margin per sale',
  channels: {
    [Channel.Instagram]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 20, // ~5/week
      engagementRate: 0.0357, // use influencer/tech proxy
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.CarouselMultiImage],
      weight: 8,
    }),
    [Channel.TikTok]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 12, // ~3/week
      engagementRate: 0.0074, // underperforms vs median for influencers
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.ShortVideoUGC],
      weight: 4, // test selectively
    }),
    [Channel.LinkedIn]: ch({
      channelType: 'social',
      benchmarkCadenceMonthly: 8,
      engagementRate: 0.0372,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership],
      weight: 5,
    }),
    [Channel.Email]: ch({
      channelType: 'email',
      benchmarkCadenceMonthly: 12, // ~3/week for creator brands
      openRate: 0.3563,
      clickRate: 0.0262,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.NewsletterOffer],
      weight: 9,
    }),
    [Channel.BlogSEO]: ch({
      channelType: 'seo',
      benchmarkCadenceMonthly: 8,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy],
      weight: 6,
    }),
    [Channel.Webinar]: ch({
      channelType: 'webinar',
      benchmarkCadenceMonthly: 4, // ~1/week
      webinarAttendRate: 0.57,
      webinarCTACTR: 0.0874,
      defaultCVR: {
        [BusinessObjective.LeadGeneration]: 0.066,
        [BusinessObjective.Purchase]: 0.066,
        [BusinessObjective.DemoConsultation]: 0.066,
        [BusinessObjective.SubscriptionApp]: 0.066,
      },
      preferredFormats: [ContentFormat.WebinarLive],
      weight: 9,
    }),
  },
};

// ---------------------------------------------------------------------------
// Master lookup
// ---------------------------------------------------------------------------

export const BENCHMARK_PROFILES: Record<Industry, IndustryBenchmarkProfile> = {
  [Industry.DTCEcommerce]: dtcEcommerce,
  [Industry.B2BSaaS]: b2bSaaS,
  [Industry.LocalServices]: localServices,
  [Industry.ConsumerApp]: consumerApp,
  [Industry.InfoProduct]: infoProduct,
};

export function getBenchmarkProfile(industry: Industry): IndustryBenchmarkProfile {
  return BENCHMARK_PROFILES[industry];
}

export function getChannelBenchmark(industry: Industry, channel: Channel): ChannelBenchmark {
  return BENCHMARK_PROFILES[industry].channels[channel];
}

export function getDefaultCVR(
  industry: Industry,
  channel: Channel,
  objective: BusinessObjective
): number {
  const benchmark = getChannelBenchmark(industry, channel);
  return benchmark.defaultCVR[objective] ?? 0.02; // 2% fallback
}

export function getAvailableChannels(industry: Industry): Channel[] {
  const profile = BENCHMARK_PROFILES[industry];
  return (Object.keys(profile.channels) as Channel[]).filter(
    (ch) => profile.channels[ch].available
  );
}

export function getValidFormatsForChannel(channel: Channel): ContentFormat[] {
  switch (channel) {
    case Channel.Instagram:
      return [ContentFormat.CarouselMultiImage, ContentFormat.ShortVideoUGC, ContentFormat.CaseStudy];
    case Channel.TikTok:
      return [ContentFormat.ShortVideoUGC];
    case Channel.LinkedIn:
      return [ContentFormat.ShortVideoUGC, ContentFormat.ThoughtLeadership, ContentFormat.CarouselMultiImage, ContentFormat.CaseStudy];
    case Channel.Email:
      return [ContentFormat.NewsletterOffer];
    case Channel.BlogSEO:
      return [ContentFormat.ThoughtLeadership, ContentFormat.CaseStudy];
    case Channel.Webinar:
      return [ContentFormat.WebinarLive];
  }
}

export function getFormatFit(
  format: ContentFormat,
  channel: Channel,
  industry: Industry
): 'preferred' | 'neutral' | 'weak' {
  const benchmark = getChannelBenchmark(industry, channel);
  if (benchmark.preferredFormats.includes(format)) {
    return 'preferred';
  }
  const validFormats = getValidFormatsForChannel(channel);
  if (validFormats.includes(format)) {
    return 'neutral';
  }
  return 'weak';
}
