'use client';

import { useState, useCallback } from 'react';
import {
  Industry,
  BusinessObjective,
  Channel,
  ChannelPlanInput,
  PlannerInput,
} from '@/lib/types';
import {
  getAvailableChannels,
  getValidFormatsForChannel,
} from '@/lib/benchmarks';
import PlannerSettings from '@/components/PlannerSettings';
import ChannelPlanningGrid from '@/components/ChannelPlanningGrid';

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
      // If nothing was kept, enable all available
      if (next.size === 0) {
        return new Set(available);
      }
      return next;
    });

    // Reset plans: update formats and clear custom CVRs
    setChannelPlans((prev) => {
      const next = { ...prev };
      for (const ch of ALL_CHANNELS) {
        const validFormats = getValidFormatsForChannel(ch);
        const currentFormat = next[ch].format;
        const formatStillValid = validFormats.includes(currentFormat);
        next[ch] = {
          ...next[ch],
          format: formatStillValid ? currentFormat : validFormats[0],
          destinationCVR: undefined, // reset to benchmark default
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
          destinationCVR: undefined, // reset to benchmark default for new objective
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

  // Build the PlannerInput for downstream consumption (Task 6 will wire this to the engine)
  const plannerInput: PlannerInput = {
    industry,
    objective,
    channelPlans: ALL_CHANNELS
      .filter((ch) => enabledChannels.has(ch))
      .map((ch) => channelPlans[ch]),
    monthlyAvailableHours,
    valuePerConversion,
  };

  // Calculate total planned hours for capacity display
  const totalPlannedHours = plannerInput.channelPlans.reduce(
    (sum, p) => sum + p.productionHours,
    0
  );
  const capacityPct = monthlyAvailableHours > 0
    ? Math.round((totalPlannedHours / monthlyAvailableHours) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-text-primary text-base font-semibold tracking-tight leading-none">
              Content Strategy Planner
            </h1>
            <p className="text-text-secondary text-[11px] mt-1.5 tracking-wide">
              Monthly content allocation and forecast
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

        {/* Placeholder for output dashboard (Task 6 will wire this to the engine) */}
        {plannerInput.channelPlans.length > 0 && valuePerConversion > 0 && (
          <div className="bg-surface rounded-lg p-6 border border-surface-border">
            <p className="text-sm text-text-secondary">
              Forecast output will appear here once connected to the planning engine.
            </p>
          </div>
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
