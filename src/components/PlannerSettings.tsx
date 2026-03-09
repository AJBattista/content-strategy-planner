'use client';

import {
  Industry,
  BusinessObjective,
} from '@/lib/types';
import {
  INDUSTRY_LABELS,
  OBJECTIVE_LABELS,
} from '@/lib/constants';
import { getBenchmarkProfile } from '@/lib/benchmarks';

interface PlannerSettingsProps {
  industry: Industry;
  objective: BusinessObjective;
  monthlyAvailableHours: number;
  valuePerConversion: number;
  onIndustryChange: (industry: Industry) => void;
  onObjectiveChange: (objective: BusinessObjective) => void;
  onHoursChange: (hours: number) => void;
  onValueChange: (value: number) => void;
}

const INDUSTRIES = Object.values(Industry);
const OBJECTIVES = Object.values(BusinessObjective);

export default function PlannerSettings({
  industry,
  objective,
  monthlyAvailableHours,
  valuePerConversion,
  onIndustryChange,
  onObjectiveChange,
  onHoursChange,
  onValueChange,
}: PlannerSettingsProps) {
  const profile = getBenchmarkProfile(industry);

  return (
    <div className="bg-surface rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Planning Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Industry Selector */}
        <div>
          <label className="block text-sm text-secondary mb-2">Industry</label>
          <select
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value as Industry)}
            className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {INDUSTRY_LABELS[ind]}
              </option>
            ))}
          </select>
        </div>

        {/* Objective Selector */}
        <div>
          <label className="block text-sm text-secondary mb-2">Business Objective</label>
          <select
            value={objective}
            onChange={(e) => onObjectiveChange(e.target.value as BusinessObjective)}
            className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors"
          >
            {OBJECTIVES.map((obj) => (
              <option key={obj} value={obj}>
                {OBJECTIVE_LABELS[obj]}
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Capacity */}
        <div>
          <label className="block text-sm text-secondary mb-2">Monthly Production Hours</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={monthlyAvailableHours}
            onChange={(e) => onHoursChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 min-h-[44px] text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors tabular-nums"
            placeholder="e.g. 160"
          />
        </div>

        {/* Value per Conversion */}
        <div>
          <label className="block text-sm text-secondary mb-2">Value per Conversion ($)</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={valuePerConversion}
            onChange={(e) => onValueChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 min-h-[44px] text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors tabular-nums"
            placeholder="e.g. 50"
          />
          <p className="text-xs text-secondary/70 mt-1.5">{profile.valuePerConversionGuidance}</p>
        </div>
      </div>
    </div>
  );
}
