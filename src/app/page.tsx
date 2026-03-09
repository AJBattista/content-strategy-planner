'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Industry,
  BusinessObjective,
  Channel,
  ChannelPlanInput,
  PlannerInput,
  PlannerOutput,
} from '@/lib/types';
import {
  getAvailableChannels,
  getValidFormatsForChannel,
} from '@/lib/benchmarks';
import { runPlanner } from '@/lib/engine';
import { INDUSTRY_LABELS, OBJECTIVE_LABELS } from '@/lib/constants';
import PlannerSettings from '@/components/PlannerSettings';
import ChannelPlanningGrid from '@/components/ChannelPlanningGrid';
import {
  ForecastTable,
  BenchmarkFitPanel,
  RecommendedMix,
  WarningsPanel,
  CapacityUtilization,
  DiagnosticsPanel,
} from '@/components/dashboard';
import ScenarioCompare from '@/components/ScenarioCompare';
import IndustryBenchmarks from '@/components/IndustryBenchmarks';

const ALL_CHANNELS: Channel[] = [
  Channel.Instagram,
  Channel.TikTok,
  Channel.LinkedIn,
  Channel.Email,
  Channel.BlogSEO,
  Channel.Webinar,
];

function buildDefaultPlan(channel: Channel): ChannelPlanInput {
  const validFormats = getValidFormatsForChannel(channel);
  return {
    channel,
    monthlyUnits: 0,
    format: validFormats[0],
    trafficPerUnit: 0,
    productionHours: 0,
    destinationCVR: undefined,
  };
}

function buildDefaultPlans(): Record<Channel, ChannelPlanInput> {
  const plans = {} as Record<Channel, ChannelPlanInput>;
  for (const ch of ALL_CHANNELS) {
    plans[ch] = buildDefaultPlan(ch);
  }
  return plans;
}

function getDefaultEnabledChannels(industry: Industry): Set<Channel> {
  const available = getAvailableChannels(industry);
  return new Set(available);
}

export default function Home() {
  const [industry, setIndustry] = useState<Industry>(Industry.DTCEcommerce);
  const [objective, setObjective] = useState<BusinessObjective>(BusinessObjective.Purchase);
  const [monthlyAvailableHours, setMonthlyAvailableHours] = useState<number>(160);
  const [valuePerConversion, setValuePerConversion] = useState<number>(0);
  const [enabledChannels, setEnabledChannels] = useState<Set<Channel>>(
    () => getDefaultEnabledChannels(Industry.DTCEcommerce)
  );
  const [channelPlans, setChannelPlans] = useState<Record<Channel, ChannelPlanInput>>(
    buildDefaultPlans
  );
  const [snapshotOutput, setSnapshotOutput] = useState<PlannerOutput | null>(null);

  // When industry changes: update channel availability, reset CVR defaults, update format options
  const handleIndustryChange = useCallback((newIndustry: Industry) => {
    setIndustry(newIndustry);

    const available = getAvailableChannels(newIndustry);
    setEnabledChannels((prev) => {
      const next = new Set<Channel>();
      for (const ch of available) {
        if (prev.has(ch)) {
          next.add(ch);
        }
      }
      if (next.size === 0) {
        return new Set(available);
      }
      return next;
    });

    setChannelPlans((prev) => {
      const next = { ...prev };
      for (const ch of ALL_CHANNELS) {
        const validFormats = getValidFormatsForChannel(ch);
        const currentFormat = next[ch].format;
        const formatStillValid = validFormats.includes(currentFormat);
        next[ch] = {
          ...next[ch],
          format: formatStillValid ? currentFormat : validFormats[0],
          destinationCVR: undefined,
        };
      }
      return next;
    });
  }, []);

  // When objective changes: reset CVR defaults across channels
  const handleObjectiveChange = useCallback((newObjective: BusinessObjective) => {
    setObjective(newObjective);

    setChannelPlans((prev) => {
      const next = { ...prev };
      for (const ch of ALL_CHANNELS) {
        next[ch] = {
          ...next[ch],
          destinationCVR: undefined,
        };
      }
      return next;
    });
  }, []);

  const handleToggleChannel = useCallback((channel: Channel) => {
    setEnabledChannels((prev) => {
      const next = new Set(prev);
      if (next.has(channel)) {
        next.delete(channel);
      } else {
        next.add(channel);
      }
      return next;
    });
  }, []);

  const handleUpdatePlan = useCallback((channel: Channel, updates: Partial<ChannelPlanInput>) => {
    setChannelPlans((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], ...updates },
    }));
  }, []);

  // Build the PlannerInput from current state
  const plannerInput: PlannerInput = useMemo(() => ({
    industry,
    objective,
    channelPlans: ALL_CHANNELS
      .filter((ch) => enabledChannels.has(ch))
      .map((ch) => channelPlans[ch]),
    monthlyAvailableHours,
    valuePerConversion,
  }), [industry, objective, enabledChannels, channelPlans, monthlyAvailableHours, valuePerConversion]);

  // Run the planner engine on every input change
  const plannerOutput: PlannerOutput = useMemo(
    () => runPlanner(plannerInput),
    [plannerInput]
  );

  // Capacity utilization from engine output
  const capacityPct = Math.round(plannerOutput.capacityUtilization * 100);
  const totalPlannedHours = plannerInput.channelPlans.reduce(
    (sum, p) => sum + p.productionHours,
    0
  );

  // Check if there's meaningful data to show forecasts
  const hasActiveData = plannerOutput.channelForecasts.some(
    (f) => f.forecastTraffic > 0 || f.forecastConversions > 0
  );

  // Scenario compare handlers
  const handleSnapshot = useCallback(() => {
    setSnapshotOutput(plannerOutput);
  }, [plannerOutput]);

  const handleClearSnapshot = useCallback(() => {
    setSnapshotOutput(null);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-text-primary text-base font-semibold tracking-tight leading-none">
              Content Strategy Planner
            </h1>
            <p className="text-text-secondary text-[11px] mt-1.5 tracking-wide">
              Monthly content allocation — {INDUSTRY_LABELS[industry]} · {OBJECTIVE_LABELS[objective]}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8 space-y-6">
        {/* Top Section: Planning Parameters */}
        <PlannerSettings
          industry={industry}
          objective={objective}
          monthlyAvailableHours={monthlyAvailableHours}
          valuePerConversion={valuePerConversion}
          onIndustryChange={handleIndustryChange}
          onObjectiveChange={handleObjectiveChange}
          onHoursChange={setMonthlyAvailableHours}
          onValueChange={setValuePerConversion}
        />

        {/* Industry Benchmarks — Advanced Controls */}
        <IndustryBenchmarks
          industry={industry}
          objective={objective}
        />

        {/* Capacity Indicator */}
        <div className="flex items-center gap-4 px-1">
          <span className="text-sm text-text-secondary">Capacity Utilization</span>
          <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                capacityPct > 100
                  ? 'bg-status-weak'
                  : capacityPct > 80
                  ? 'bg-status-caution'
                  : 'bg-status-strong'
              }`}
              style={{ width: `${Math.min(capacityPct, 100)}%` }}
            />
          </div>
          <span className={`text-sm font-mono tabular-nums ${
            capacityPct > 100 ? 'text-status-weak' : 'text-text-secondary'
          }`}>
            {totalPlannedHours}h / {monthlyAvailableHours}h ({capacityPct}%)
          </span>
        </div>

        {/* Middle Section: Channel Planning Grid */}
        <ChannelPlanningGrid
          industry={industry}
          objective={objective}
          enabledChannels={enabledChannels}
          channelPlans={channelPlans}
          onToggleChannel={handleToggleChannel}
          onUpdatePlan={handleUpdatePlan}
        />

        {/* Output Section */}
        {plannerInput.channelPlans.length === 0 ? (
          <div className="bg-surface rounded-lg p-6 border border-surface-border">
            <p className="text-sm text-text-secondary">Enable at least one channel to see forecasts.</p>
          </div>
        ) : !hasActiveData && valuePerConversion === 0 ? (
          <div className="bg-surface rounded-lg p-6 border border-surface-border">
            <p className="text-sm text-text-secondary">
              Enter content units, traffic per unit, and value per conversion to generate forecasts.
            </p>
          </div>
        ) : (
          <>
            {/* KPI summary row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard
                label="Forecast Traffic"
                value={Math.round(plannerOutput.totalForecastTraffic).toLocaleString()}
              />
              <KPICard
                label="Forecast Conversions"
                value={Math.round(plannerOutput.totalForecastConversions).toLocaleString()}
              />
              <KPICard
                label="Forecast Revenue"
                value={'$' + Math.round(plannerOutput.totalForecastRevenue).toLocaleString()}
                highlight
              />
            </div>

            {/* Forecast Table */}
            <ForecastTable
              forecasts={plannerOutput.channelForecasts}
              totalTraffic={plannerOutput.totalForecastTraffic}
              totalConversions={plannerOutput.totalForecastConversions}
              totalRevenue={plannerOutput.totalForecastRevenue}
            />

            {/* Benchmark Fit + Capacity Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <BenchmarkFitPanel forecasts={plannerOutput.channelForecasts} />
              </div>
              <div className="lg:col-span-2">
                <CapacityUtilization
                  utilization={plannerOutput.capacityUtilization}
                  mix={plannerOutput.recommendedMix}
                />
              </div>
            </div>

            {/* Recommended Mix */}
            <RecommendedMix mix={plannerOutput.recommendedMix} />

            {/* Warnings + Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WarningsPanel warnings={plannerOutput.warnings} />
              <DiagnosticsPanel forecasts={plannerOutput.channelForecasts} />
            </div>

            {/* Scenario Compare */}
            <ScenarioCompare
              currentOutput={plannerOutput}
              snapshotOutput={snapshotOutput}
              onSnapshot={handleSnapshot}
              onClearSnapshot={handleClearSnapshot}
            />
          </>
        )}
      </main>

      <footer className="border-t border-surface-border mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4">
          <p className="text-text-tertiary text-[10px] tracking-wide">
            Forecasts use industry benchmark data. Actual results depend on execution quality, audience size, and market conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}

function KPICard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border px-5 py-4">
      <div className="text-text-secondary text-[10px] uppercase tracking-[0.08em] mb-2 leading-none">{label}</div>
      <div className={`text-2xl font-mono font-semibold leading-none ${highlight ? 'text-status-strong' : 'text-text-primary'}`}>
        {value}
      </div>
    </div>
  );
}
