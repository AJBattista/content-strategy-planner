import {
  Channel,
  ChannelPlanInput,
  ChannelForecast,
  ChannelDiagnostics,
  BenchmarkFitLabel,
  PlannerInput,
  ChannelBenchmark,
  Industry,
  BusinessObjective,
  ContentFormat,
} from './types';
import {
  getChannelBenchmark,
  getDefaultCVR,
  getFormatFit,
} from './benchmarks';
import {
  CADENCE_MULTIPLIER_BANDS,
  FORMAT_MULTIPLIER_PREFERRED,
  FORMAT_MULTIPLIER_NEUTRAL,
  FORMAT_MULTIPLIER_WEAK,
  SOCIAL_CADENCE_CEILING_MULTIPLIER,
  EMAIL_MONTHLY_CEILING,
  WEBINAR_MONTHLY_CEILING,
  CVR_BOUNDS,
  WEBINAR_ATTEND_RATE,
  WEBINAR_CTA_CTR,
} from './constants';

// ---------------------------------------------------------------------------
// Cadence multiplier
// ---------------------------------------------------------------------------

/**
 * Compare planned monthly cadence to the benchmark-optimal cadence and return
 * the appropriate multiplier.
 *
 * If benchmark cadence is 0 (channel unavailable or no benchmark), return 1.0
 * so the forecast still works — the recommendation engine will flag fit issues.
 */
export function calculateCadenceMultiplier(
  plannedUnits: number,
  benchmarkCadenceMonthly: number
): number {
  if (benchmarkCadenceMonthly <= 0) return 1.0;

  const ratio = plannedUnits / benchmarkCadenceMonthly;

  for (const band of CADENCE_MULTIPLIER_BANDS) {
    if (ratio < band.maxRatio) {
      return band.multiplier;
    }
  }
  // Fallback (should never reach here due to Infinity band)
  return 0.75;
}

// ---------------------------------------------------------------------------
// Format multiplier
// ---------------------------------------------------------------------------

/**
 * Return the format efficiency multiplier based on whether the chosen format
 * is preferred, neutral, or weak for the given channel + industry.
 */
export function getFormatMultiplier(
  format: ContentFormat,
  channel: Channel,
  industry: Industry
): number {
  const fit = getFormatFit(format, channel, industry);
  switch (fit) {
    case 'preferred':
      return FORMAT_MULTIPLIER_PREFERRED;
    case 'neutral':
      return FORMAT_MULTIPLIER_NEUTRAL;
    case 'weak':
      return FORMAT_MULTIPLIER_WEAK;
  }
}

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

/**
 * Clamp a CVR value to the allowed bounds for the given objective.
 * Returns the clamped value as a decimal.
 */
export function clampCVR(cvr: number, objective: BusinessObjective): number {
  const bounds = CVR_BOUNDS[objective];
  return Math.max(bounds.min, Math.min(bounds.max, cvr));
}

/**
 * Cap content units at the channel ceiling.
 * Social channels: 2× benchmark cadence.
 * Email: 20/month.
 * Webinar: 8/month.
 * SEO: no hard ceiling (returns units unchanged).
 */
export function capContentUnits(
  units: number,
  benchmark: ChannelBenchmark
): number {
  switch (benchmark.channelType) {
    case 'social': {
      const ceiling = benchmark.benchmarkCadenceMonthly > 0
        ? Math.ceil(benchmark.benchmarkCadenceMonthly * SOCIAL_CADENCE_CEILING_MULTIPLIER)
        : units; // no benchmark → no cap
      return Math.min(units, ceiling);
    }
    case 'email':
      return Math.min(units, EMAIL_MONTHLY_CEILING);
    case 'webinar':
      return Math.min(units, WEBINAR_MONTHLY_CEILING);
    case 'seo':
      return units;
  }
}

// ---------------------------------------------------------------------------
// CVR resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the destination CVR for a channel plan:
 * - Use the user override if provided
 * - Otherwise fall back to the benchmark default for industry/channel/objective
 * - Always clamp to objective bounds
 */
export function resolveCVR(
  plan: ChannelPlanInput,
  industry: Industry,
  objective: BusinessObjective
): number {
  const raw = plan.destinationCVR ?? getDefaultCVR(industry, plan.channel, objective);
  return clampCVR(raw, objective);
}

// ---------------------------------------------------------------------------
// Channel-specific diagnostics
// ---------------------------------------------------------------------------

/**
 * Build the diagnostic detail object for a channel based on its type.
 *
 * Social: uses forecast traffic as a proxy for impressions (traffic = clicks
 * from social), then calculates engagements from the benchmark engagement rate.
 *
 * Email: models sends = monthlyUnits, then opens/clicks/conversions from
 * benchmark rates.
 *
 * Webinar: models registrations = trafficPerUnit (registrations driven to
 * each webinar), then the standard webinar funnel.
 *
 * SEO: models articles = monthlyUnits, sessions from trafficPerUnit.
 */
function buildDiagnostics(
  plan: ChannelPlanInput,
  benchmark: ChannelBenchmark,
  cvr: number,
  cappedUnits: number
): ChannelDiagnostics | null {
  switch (benchmark.channelType) {
    case 'social': {
      // For social, trafficPerUnit represents click-throughs per post.
      // Impressions are estimated by dividing traffic by engagement rate
      // (engagement rate ≈ clicks / impressions as a rough proxy).
      const engagementRate = benchmark.engagementRate ?? 0;
      // Estimate impressions: if we get `trafficPerUnit` clicks and the ER
      // represents the fraction of impressions that become engagements,
      // then impressions ≈ traffic / ER. Guard against zero ER.
      const totalTraffic = cappedUnits * plan.trafficPerUnit;
      const impressions = engagementRate > 0
        ? Math.round(totalTraffic / engagementRate)
        : 0;
      const engagements = Math.round(impressions * engagementRate);
      return {
        type: 'social',
        impressions,
        engagementRate,
        engagements,
      };
    }
    case 'email': {
      const sends = cappedUnits;
      const openRate = benchmark.openRate ?? 0;
      const clickRate = benchmark.clickRate ?? 0;
      // Opens and clicks are per-send, so multiply by trafficPerUnit
      // (list size proxy — how many recipients per send).
      // Actually, trafficPerUnit for email = traffic (clicks) per send.
      // So we back-calculate: opens = sends × openRate × listSize,
      // but we don't have listSize. Instead, treat trafficPerUnit as
      // total traffic generated per send (already incorporates list size).
      const opens = Math.round(sends * plan.trafficPerUnit * (openRate / clickRate || 0));
      const clicks = Math.round(sends * plan.trafficPerUnit);
      const conversions = clicks * cvr;
      return {
        type: 'email',
        sends,
        openRate,
        opens: isFinite(opens) ? opens : 0,
        clickRate,
        clicks,
        conversions,
      };
    }
    case 'seo': {
      const articles = cappedUnits;
      const sessionsPerArticle = plan.trafficPerUnit;
      const conversions = articles * sessionsPerArticle * cvr;
      return {
        type: 'seo',
        articles,
        sessionsPerArticle,
        seoCVR: cvr,
        conversions,
      };
    }
    case 'webinar': {
      // trafficPerUnit = registrations per webinar
      const registrations = cappedUnits * plan.trafficPerUnit;
      const attendRate = benchmark.webinarAttendRate ?? WEBINAR_ATTEND_RATE;
      const ctaCTR = benchmark.webinarCTACTR ?? WEBINAR_CTA_CTR;
      const attendees = registrations * attendRate;
      const ctaClicks = attendees * ctaCTR;
      const conversions = ctaClicks * cvr;
      return {
        type: 'webinar',
        registrations: Math.round(registrations),
        attendees: Math.round(attendees),
        ctaClicks: Math.round(ctaClicks),
        conversions,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Single-channel forecast
// ---------------------------------------------------------------------------

/**
 * Forecast a single channel given the user's plan input and the benchmark
 * profile for their industry.
 *
 * Core formula:
 *   ForecastTraffic  = CappedUnits × TrafficPerUnit × CadenceMultiplier × FormatMultiplier
 *   ForecastConversions = ForecastTraffic × DestinationCVR
 *   ForecastRevenue  = ForecastConversions × ValuePerConversion
 */
export function forecastChannel(
  plan: ChannelPlanInput,
  industry: Industry,
  objective: BusinessObjective,
  valuePerConversion: number
): ChannelForecast {
  const benchmark = getChannelBenchmark(industry, plan.channel);

  // Apply guardrails
  const cappedUnits = capContentUnits(plan.monthlyUnits, benchmark);
  const cvr = resolveCVR(plan, industry, objective);

  // Multipliers
  const cadenceMultiplier = calculateCadenceMultiplier(
    cappedUnits,
    benchmark.benchmarkCadenceMonthly
  );
  const formatMultiplier = getFormatMultiplier(plan.format, plan.channel, industry);

  // Core standardized forecast
  const forecastTraffic = cappedUnits * plan.trafficPerUnit * cadenceMultiplier * formatMultiplier;
  const forecastConversions = forecastTraffic * cvr;
  const forecastRevenue = forecastConversions * valuePerConversion;

  // Derived metrics
  const revenuePerUnit = cappedUnits > 0 ? forecastRevenue / cappedUnits : 0;
  const revenuePerHour = plan.productionHours > 0 ? forecastRevenue / plan.productionHours : 0;

  // Benchmark fit (basic version — Task 3 will refine this)
  const benchmarkFit = calculateBasicBenchmarkFit(
    cappedUnits,
    benchmark,
    plan.format,
    plan.channel,
    industry
  );

  // Channel-specific diagnostics
  const diagnostics = buildDiagnostics(plan, benchmark, cvr, cappedUnits);

  return {
    channel: plan.channel,
    forecastTraffic,
    forecastConversions,
    forecastRevenue,
    benchmarkFit,
    cadenceMultiplier,
    formatMultiplier,
    destinationCVR: cvr,
    revenuePerUnit,
    revenuePerHour,
    diagnostics,
  };
}

// ---------------------------------------------------------------------------
// Basic benchmark fit (preliminary — Task 3 will build the full version)
// ---------------------------------------------------------------------------

function calculateBasicBenchmarkFit(
  cappedUnits: number,
  benchmark: ChannelBenchmark,
  format: ContentFormat,
  channel: Channel,
  industry: Industry
): BenchmarkFitLabel {
  if (benchmark.benchmarkCadenceMonthly <= 0) return 'Weak Fit';

  const cadenceRatio = cappedUnits / benchmark.benchmarkCadenceMonthly;
  const formatFit = getFormatFit(format, channel, industry);

  // Overextended: cadence way over benchmark
  if (cadenceRatio > 1.6) return 'Overextended';

  // Weak Fit: cadence very low or format is weak
  if (cadenceRatio < 0.3 || formatFit === 'weak') return 'Weak Fit';

  // Strong Fit: cadence in sweet spot and format is preferred
  if (cadenceRatio >= 0.5 && cadenceRatio <= 1.2 && formatFit === 'preferred') {
    return 'Strong Fit';
  }

  // Everything else
  return 'Viable';
}

// ---------------------------------------------------------------------------
// Multi-channel forecast
// ---------------------------------------------------------------------------

/**
 * Run the forecast for every active channel in the planner input.
 * Returns an array of ChannelForecast objects.
 */
export function forecastAllChannels(input: PlannerInput): ChannelForecast[] {
  return input.channelPlans.map((plan) =>
    forecastChannel(plan, input.industry, input.objective, input.valuePerConversion)
  );
}
