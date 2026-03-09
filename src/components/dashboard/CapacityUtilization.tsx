'use client';

import { RecommendedChannelMix } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';

interface CapacityUtilizationProps {
  utilization: number;
  mix: RecommendedChannelMix[];
}

export default function CapacityUtilization({ utilization, mix }: CapacityUtilizationProps) {
  const pct = Math.round(utilization * 100);
  const isOver = utilization > 1;

  // When over capacity, show which channels the engine cut
  const cutChannels = mix.filter((m) => m.delta < 0);

  const barColor = isOver
    ? 'bg-status-weak'
    : utilization > 0.85
    ? 'bg-status-caution'
    : 'bg-status-strong';

  const barWidth = Math.min(pct, 100);

  return (
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Capacity Utilization
        </h2>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-text-secondary text-xs">Monthly Hours Used</span>
          <span className={`font-mono text-lg font-semibold ${isOver ? 'text-status-weak' : 'text-text-primary'}`}>
            {pct}%
          </span>
        </div>
        <div className="h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {isOver && cutChannels.length > 0 && (
          <div className="mt-4 p-3 rounded-md bg-status-weak/5 border border-status-weak/20">
            <p className="text-status-weak text-xs font-medium mb-2">
              Over capacity — reduce these channels first:
            </p>
            <ul className="space-y-1">
              {cutChannels.map((c) => (
                <li key={c.channel} className="text-text-secondary text-xs flex justify-between">
                  <span>{CHANNEL_LABELS[c.channel]}</span>
                  <span className="font-mono text-status-weak">
                    {c.currentUnits} → {c.recommendedUnits} units ({c.delta})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isOver && (
          <p className="mt-2 text-text-secondary text-xs">
            {pct <= 70
              ? 'Room to add more content to high-performing channels'
              : pct <= 85
              ? 'Healthy utilization'
              : 'Approaching capacity — prioritize highest-return channels'}
          </p>
        )}
      </div>
    </section>
  );
}
