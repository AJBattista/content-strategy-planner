import {
  Channel,
  ChannelPlanInput,
  ChannelForecast,
  BenchmarkFitLabel,
  PlannerInput,
  PlannerWarning,
  RecommendedChannelMix,
  ChannelBenchmark,
  Industry,
} from './types';
import {
  getBenchmarkProfile,
  getChannelBenchmark,
  getFormatFit,
} from './benchmarks';
import { CHANNEL_LABELS } from './constants';

// ---------------------------------------------------------------------------
// Benchmark fit scoring
// ---------------------------------------------------------------------------

/**
 * Score a channel's benchmark fit based on three factors:
 *   1. Cadence vs benchmark cadence (how close to the optimal posting rate)
 *   2. Format vs preferred format (is the user using the right content type)
 *   3. Channel weight / engagement expectation for this industry
 *
 * Returns a numeric score (0–100) and the corresponding label.
 */
export function calculateBenchmarkFit(
  plan: ChannelPlanInput,
  industry: Industry
): { score: number; label: BenchmarkFitLabel } {
  const benchmark = getChannelBenchmark(industry, plan.channel);

  // --- Cadence score (0–40 points) ---
  let cadenceScore: number;
  if (benchmark.benchmarkCadenceMonthly <= 0) {
    // Channel has no benchmark cadence — treat as weak
    cadenceScore = 10;
  } else {
    const ratio = plan.monthlyUnits / benchmark.benchmarkCadenceMonthly;
    if (ratio >= 0.5 && ratio <= 1.2) {
      // Sweet spot
      cadenceScore = 40;
    } else if (ratio >= 0.3 && ratio < 0.5) {
      // Slightly under
      cadenceScore = 25;
    } else if (ratio > 1.2 && ratio <= 1.6) {
      // Slightly over
      cadenceScore = 20;
    } else if (ratio < 0.3) {
      // Way under
      cadenceScore = 10;
    } else {
      // Way over (> 1.6) — Overextended
      cadenceScore = 5;
    }
  }

  // --- Format score (0–35 points) ---
  const formatFit = getFormatFit(plan.format, plan.channel, industry);
  let formatScore: number;
  switch (formatFit) {
    case 'preferred':
      formatScore = 35;
      break;
    case 'neutral':
      formatScore = 20;
      break;
    case 'weak':
      formatScore = 5;
      break;
  }

  // --- Channel weight score (0–25 points) ---
  // benchmark.weight is 1–10; scale to 0–25
  const weightScore = (benchmark.weight / 10) * 25;

  const totalScore = cadenceScore + formatScore + weightScore;

  return {
    score: totalScore,
    label: scoreToLabel(totalScore, plan.monthlyUnits, benchmark),
  };
}

function scoreToLabel(
  score: number,
  plannedUnits: number,
  benchmark: ChannelBenchmark
): BenchmarkFitLabel {
  // Overextended takes priority: if cadence > 160% of benchmark, always Overextended
  if (
    benchmark.benchmarkCadenceMonthly > 0 &&
    plannedUnits / benchmark.benchmarkCadenceMonthly > 1.6
  ) {
    return 'Overextended';
  }

  if (score >= 70) return 'Strong Fit';
  if (score >= 45) return 'Viable';
  return 'Weak Fit';
}

// ---------------------------------------------------------------------------
// Underinvested opportunity detection
// ---------------------------------------------------------------------------

/**
 * Flags channels where:
 *   - Benchmark fit is good (channel has decent weight/priority)
 *   - Cadence is below the efficient range (< 50% of benchmark)
 *   - Conversions per unit are above the plan average
 */
export function detectUnderinvestedOpportunities(
  forecasts: ChannelForecast[],
  plans: ChannelPlanInput[],
  industry: Industry
): PlannerWarning[] {
  const warnings: PlannerWarning[] = [];
  if (forecasts.length === 0) return warnings;

  const avgConversionsPerUnit = calcAverageConversionsPerUnit(forecasts, plans);

  for (let i = 0; i < forecasts.length; i++) {
    const forecast = forecasts[i];
    const plan = plans[i];
    const benchmark = getChannelBenchmark(industry, plan.channel);
    const channelLabel = CHANNEL_LABELS[plan.channel] ?? plan.channel;

    // Skip channels with no benchmark cadence
    if (benchmark.benchmarkCadenceMonthly <= 0) continue;

    const cadenceRatio = plan.monthlyUnits / benchmark.benchmarkCadenceMonthly;
    const conversionsPerUnit =
      plan.monthlyUnits > 0 ? forecast.forecastConversions / plan.monthlyUnits : 0;

    // Underinvested: good benchmark weight, below efficient range, above-average conversions
    if (
      benchmark.weight >= 6 &&
      cadenceRatio < 0.5 &&
      conversionsPerUnit > avgConversionsPerUnit
    ) {
      warnings.push({
        type: 'underinvested',
        channel: plan.channel,
        reason: `${channelLabel} is at ${Math.round(cadenceRatio * 100)}% of benchmark cadence with above-average conversions per unit`,
        suggestion: `Increase ${channelLabel} to ${Math.round(benchmark.benchmarkCadenceMonthly * 0.7)} units/month to reach efficient range`,
      });
    }
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// Overinvested channel detection
// ---------------------------------------------------------------------------

/**
 * Flags channels where:
 *   - Cadence exceeds the benchmark-friendly zone (> 120%)
 *   - Revenue per unit is below plan average
 *   - Another channel has higher projected revenue per hour
 */
export function detectOverinvestedChannels(
  forecasts: ChannelForecast[],
  plans: ChannelPlanInput[],
  industry: Industry
): PlannerWarning[] {
  const warnings: PlannerWarning[] = [];
  if (forecasts.length === 0) return warnings;

  const avgRevenuePerUnit = calcAverageRevenuePerUnit(forecasts, plans);
  const maxRevenuePerHour = Math.max(...forecasts.map((f) => f.revenuePerHour));

  for (let i = 0; i < forecasts.length; i++) {
    const forecast = forecasts[i];
    const plan = plans[i];
    const benchmark = getChannelBenchmark(industry, plan.channel);
    const channelLabel = CHANNEL_LABELS[plan.channel] ?? plan.channel;

    if (benchmark.benchmarkCadenceMonthly <= 0) continue;

    const cadenceRatio = plan.monthlyUnits / benchmark.benchmarkCadenceMonthly;
    const revenuePerUnit =
      plan.monthlyUnits > 0 ? forecast.forecastRevenue / plan.monthlyUnits : 0;

    // Overinvested: cadence too high AND underperforming on revenue
    if (cadenceRatio > 1.2 && revenuePerUnit < avgRevenuePerUnit) {
      // Find the best alternative channel
      const bestAlt = forecasts.reduce((best, f) =>
        f.revenuePerHour > best.revenuePerHour && f.channel !== plan.channel ? f : best
      );
      const bestAltLabel = CHANNEL_LABELS[bestAlt.channel] ?? bestAlt.channel;

      const hasHigherAlt = forecast.revenuePerHour < maxRevenuePerHour;
      const altNote = hasHigherAlt
        ? ` ${bestAltLabel} produces higher revenue per hour`
        : '';

      warnings.push({
        type: 'overinvested',
        channel: plan.channel,
        reason: `${channelLabel} is at ${Math.round(cadenceRatio * 100)}% of benchmark cadence with below-average revenue per unit.${altNote}`,
        suggestion: `Reduce ${channelLabel} to ${Math.round(benchmark.benchmarkCadenceMonthly * 1.1)} units/month and reallocate hours`,
      });
    }
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// Capacity utilization
// ---------------------------------------------------------------------------

/**
 * Calculate total planned hours / monthly available hours.
 * Returns a ratio (1.0 = 100% utilized).
 */
export function calculateCapacityUtilization(input: PlannerInput): number {
  if (input.monthlyAvailableHours <= 0) return 0;
  const totalHours = input.channelPlans.reduce(
    (sum, plan) => sum + plan.productionHours,
    0
  );
  return totalHours / input.monthlyAvailableHours;
}

// ---------------------------------------------------------------------------
// Recommended mix generation
// ---------------------------------------------------------------------------

/**
 * Generate the recommended content mix by reallocating units.
 *
 * Strategy:
 *   1. Score each channel by a composite of benchmark fit, conversions per unit,
 *      revenue per hour, and room before cadence deteriorates.
 *   2. Redistribute total content units proportionally to composite score,
 *      respecting channel ceilings and floor of 0.
 *   3. If over capacity, cut units from lowest revenue-per-hour channels first.
 */
export function generateRecommendedMix(
  forecasts: ChannelForecast[],
  input: PlannerInput
): RecommendedChannelMix[] {
  if (forecasts.length === 0) return [];

  const profile = getBenchmarkProfile(input.industry);
  const totalCurrentUnits = input.channelPlans.reduce(
    (sum, p) => sum + p.monthlyUnits,
    0
  );
  if (totalCurrentUnits === 0) {
    return forecasts.map((f) => ({
      channel: f.channel,
      recommendedUnits: 0,
      currentUnits: 0,
      delta: 0,
      revenuePerUnit: 0,
      revenuePerHour: 0,
    }));
  }

  // Build per-channel scores for reallocation
  const channelScores = forecasts.map((forecast, i) => {
    const plan = input.channelPlans[i];
    const benchmark = profile.channels[plan.channel];
    const fitResult = calculateBenchmarkFit(plan, input.industry);

    // Conversions per unit (higher = better)
    const conversionsPerUnit =
      plan.monthlyUnits > 0 ? forecast.forecastConversions / plan.monthlyUnits : 0;

    // Revenue per hour (higher = better)
    const revenuePerHour = forecast.revenuePerHour;

    // Room before cadence deteriorates: how many more units can we add
    // before crossing 120% of benchmark (the sweet-spot ceiling)
    const cadenceCeiling = benchmark.benchmarkCadenceMonthly > 0
      ? benchmark.benchmarkCadenceMonthly * 1.2
      : plan.monthlyUnits; // no benchmark → no bonus
    const roomLeft = Math.max(0, cadenceCeiling - plan.monthlyUnits);
    const roomRatio = benchmark.benchmarkCadenceMonthly > 0
      ? roomLeft / benchmark.benchmarkCadenceMonthly
      : 0;

    // Composite score: weighted blend
    //   - Benchmark fit score (0–100): 30%
    //   - Normalized conversions per unit: 25%
    //   - Normalized revenue per hour: 25%
    //   - Room left ratio: 20%
    return {
      channel: plan.channel,
      plan,
      forecast,
      benchmark,
      fitScore: fitResult.score,
      conversionsPerUnit,
      revenuePerHour,
      roomRatio,
      compositeScore: 0, // calculated after normalization
    };
  });

  // Normalize each factor to 0–1 range
  const maxFit = Math.max(...channelScores.map((s) => s.fitScore), 1);
  const maxCPU = Math.max(...channelScores.map((s) => s.conversionsPerUnit), 0.0001);
  const maxRPH = Math.max(...channelScores.map((s) => s.revenuePerHour), 0.0001);
  const maxRoom = Math.max(...channelScores.map((s) => s.roomRatio), 0.0001);

  for (const s of channelScores) {
    s.compositeScore =
      0.30 * (s.fitScore / maxFit) +
      0.25 * (s.conversionsPerUnit / maxCPU) +
      0.25 * (s.revenuePerHour / maxRPH) +
      0.20 * (s.roomRatio / maxRoom);
  }

  // Distribute total units proportionally to composite score
  const totalScore = channelScores.reduce((sum, s) => sum + s.compositeScore, 0);

  let mix = channelScores.map((s) => {
    const rawUnits = totalScore > 0
      ? Math.round((s.compositeScore / totalScore) * totalCurrentUnits)
      : s.plan.monthlyUnits;

    // Cap at channel ceiling (benchmark × 1.2 for sweet spot)
    const ceiling = s.benchmark.benchmarkCadenceMonthly > 0
      ? Math.round(s.benchmark.benchmarkCadenceMonthly * 1.2)
      : rawUnits;
    const recommendedUnits = Math.max(0, Math.min(rawUnits, ceiling));

    return {
      channel: s.channel,
      recommendedUnits,
      currentUnits: s.plan.monthlyUnits,
      delta: recommendedUnits - s.plan.monthlyUnits,
      revenuePerUnit: s.forecast.revenuePerUnit,
      revenuePerHour: s.forecast.revenuePerHour,
    };
  });

  // If over capacity, trim from lowest revenue-per-hour channels
  if (input.monthlyAvailableHours > 0) {
    mix = trimToCapacity(mix, input);
  }

  return mix;
}

/**
 * When the recommended mix exceeds monthly available hours, reduce units
 * from the lowest revenue-per-hour channels first until within capacity.
 */
function trimToCapacity(
  mix: RecommendedChannelMix[],
  input: PlannerInput
): RecommendedChannelMix[] {
  // Estimate hours per unit for each channel from the original plan
  const hoursPerUnit = new Map<Channel, number>();
  for (const plan of input.channelPlans) {
    hoursPerUnit.set(
      plan.channel,
      plan.monthlyUnits > 0 ? plan.productionHours / plan.monthlyUnits : 1
    );
  }

  let totalEstimatedHours = mix.reduce(
    (sum, m) => sum + m.recommendedUnits * (hoursPerUnit.get(m.channel) ?? 1),
    0
  );

  if (totalEstimatedHours <= input.monthlyAvailableHours) return mix;

  // Sort by revenue per hour ascending — cut worst performers first
  const sortedByRPH = [...mix].sort((a, b) => a.revenuePerHour - b.revenuePerHour);

  for (const item of sortedByRPH) {
    if (totalEstimatedHours <= input.monthlyAvailableHours) break;

    const hpu = hoursPerUnit.get(item.channel) ?? 1;
    while (item.recommendedUnits > 0 && totalEstimatedHours > input.monthlyAvailableHours) {
      item.recommendedUnits -= 1;
      totalEstimatedHours -= hpu;
    }
    item.delta = item.recommendedUnits - item.currentUnits;
  }

  return mix;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcAverageConversionsPerUnit(
  forecasts: ChannelForecast[],
  plans: ChannelPlanInput[]
): number {
  let totalConversions = 0;
  let totalUnits = 0;
  for (let i = 0; i < forecasts.length; i++) {
    totalConversions += forecasts[i].forecastConversions;
    totalUnits += plans[i].monthlyUnits;
  }
  return totalUnits > 0 ? totalConversions / totalUnits : 0;
}

function calcAverageRevenuePerUnit(
  forecasts: ChannelForecast[],
  plans: ChannelPlanInput[]
): number {
  let totalRevenue = 0;
  let totalUnits = 0;
  for (let i = 0; i < forecasts.length; i++) {
    totalRevenue += forecasts[i].forecastRevenue;
    totalUnits += plans[i].monthlyUnits;
  }
  return totalUnits > 0 ? totalRevenue / totalUnits : 0;
}
