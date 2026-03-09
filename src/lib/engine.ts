import {
  PlannerInput,
  PlannerOutput,
  ChannelForecast,
} from './types';
import { forecastAllChannels } from './forecasting';
import {
  calculateBenchmarkFit,
  generateRecommendedMix,
  detectUnderinvestedOpportunities,
  detectOverinvestedChannels,
  calculateCapacityUtilization,
} from './recommendations';

/**
 * Main orchestrator: runs the full planner pipeline.
 *
 * 1. Forecast all channels (traffic, conversions, revenue)
 * 2. Refine benchmark fit labels using the full scoring model
 * 3. Generate recommended mix reallocation
 * 4. Detect warnings (underinvested / overinvested)
 * 5. Calculate capacity utilization
 * 6. Aggregate totals
 */
export function runPlanner(input: PlannerInput): PlannerOutput {
  // Handle empty input
  if (input.channelPlans.length === 0) {
    return {
      channelForecasts: [],
      recommendedMix: [],
      warnings: [],
      capacityUtilization: 0,
      totalForecastTraffic: 0,
      totalForecastConversions: 0,
      totalForecastRevenue: 0,
    };
  }

  // Step 1: Run forecasts
  const rawForecasts = forecastAllChannels(input);

  // Step 2: Refine benchmark fit using full scoring from recommendations
  const forecasts: ChannelForecast[] = rawForecasts.map((forecast, i) => {
    const plan = input.channelPlans[i];
    const { label } = calculateBenchmarkFit(plan, input.industry);
    return { ...forecast, benchmarkFit: label };
  });

  // Step 3: Generate recommended mix
  const recommendedMix = generateRecommendedMix(forecasts, input);

  // Step 4: Detect warnings
  const underinvested = detectUnderinvestedOpportunities(
    forecasts,
    input.channelPlans,
    input.industry
  );
  const overinvested = detectOverinvestedChannels(
    forecasts,
    input.channelPlans,
    input.industry
  );
  const warnings = [...underinvested, ...overinvested];

  // Step 5: Capacity utilization
  const capacityUtilization = calculateCapacityUtilization(input);

  // Step 6: Aggregate totals
  const totalForecastTraffic = forecasts.reduce(
    (sum, f) => sum + f.forecastTraffic,
    0
  );
  const totalForecastConversions = forecasts.reduce(
    (sum, f) => sum + f.forecastConversions,
    0
  );
  const totalForecastRevenue = forecasts.reduce(
    (sum, f) => sum + f.forecastRevenue,
    0
  );

  return {
    channelForecasts: forecasts,
    recommendedMix,
    warnings,
    capacityUtilization,
    totalForecastTraffic,
    totalForecastConversions,
    totalForecastRevenue,
  };
}
