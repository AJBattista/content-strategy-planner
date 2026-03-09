'use client';

import {
  Channel,
  ContentFormat,
  ChannelPlanInput,
} from '@/lib/types';
import { FORMAT_LABELS } from '@/lib/constants';

interface ChannelPlanRowProps {
  channel: Channel;
  plan: ChannelPlanInput;
  defaultCVR: number;
  validFormats: ContentFormat[];
  onUpdate: (updates: Partial<ChannelPlanInput>) => void;
}

export default function ChannelPlanRow({
  plan,
  defaultCVR,
  validFormats,
  onUpdate,
}: ChannelPlanRowProps) {
  const useCustomCVR = plan.destinationCVR !== undefined;
  const displayCVR = useCustomCVR ? (plan.destinationCVR! * 100) : (defaultCVR * 100);

  return (
    <div className="px-4 pb-4 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Monthly Content Units */}
        <div>
          <label className="block text-xs text-secondary mb-1">Monthly Content Units</label>
          <input
            type="number"
            min={0}
            value={plan.monthlyUnits}
            onChange={(e) => onUpdate({ monthlyUnits: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
            placeholder="0"
          />
        </div>

        {/* Primary Format */}
        <div>
          <label className="block text-xs text-secondary mb-1">Primary Format</label>
          <select
            value={plan.format}
            onChange={(e) => onUpdate({ format: e.target.value as ContentFormat })}
            className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors"
          >
            {validFormats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {FORMAT_LABELS[fmt]}
              </option>
            ))}
          </select>
        </div>

        {/* Average Traffic per Unit */}
        <div>
          <label className="block text-xs text-secondary mb-1">Avg Traffic per Unit</label>
          <input
            type="number"
            min={0}
            value={plan.trafficPerUnit}
            onChange={(e) => onUpdate({ trafficPerUnit: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
            placeholder="0"
          />
        </div>

        {/* Production Hours */}
        <div>
          <label className="block text-xs text-secondary mb-1">Production Hours / Mo</label>
          <input
            type="number"
            min={0}
            step="0.5"
            value={plan.productionHours}
            onChange={(e) => onUpdate({ productionHours: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
            placeholder="0"
          />
        </div>

        {/* Destination Conversion Rate */}
        <div>
          <label className="block text-xs text-secondary mb-1">Destination CVR (%)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={Number(displayCVR.toFixed(2))}
              onChange={(e) => {
                const pct = Number(e.target.value);
                onUpdate({ destinationCVR: Math.max(0, pct / 100) });
              }}
              className={`flex-1 bg-background border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums ${
                useCustomCVR ? 'border-status-amber/40' : 'border-secondary/20'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                if (useCustomCVR) {
                  onUpdate({ destinationCVR: undefined });
                } else {
                  onUpdate({ destinationCVR: defaultCVR });
                }
              }}
              className={`text-xs px-2 py-1.5 rounded transition-colors flex-shrink-0 ${
                useCustomCVR
                  ? 'bg-status-amber/20 text-status-amber hover:bg-status-amber/30'
                  : 'bg-status-steel/20 text-status-steel hover:bg-status-steel/30'
              }`}
              title={useCustomCVR ? 'Reset to benchmark default' : 'Enter custom rate'}
            >
              {useCustomCVR ? 'Reset' : 'Default'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
