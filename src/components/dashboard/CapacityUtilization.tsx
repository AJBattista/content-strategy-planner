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
  const cutChannels = mix.filter((m) => m.delta < 0);

  const barColor = isOver
    ? 'bg-status-weak'
    : utilization > 0.85
    ? 'bg-status-caution'
    : 'bg-status-strong';

  const barWidth = Math.min(pct, 100);

  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden h-full">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Capacity Utilization
        </h2>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-text-secondary text-[11px]">Monthly hours used</span>
          <span className={`font-mono text-xl font-semibold leading-none ${isOver ? 'text-status-weak' : 'text-text-primary'}`}>
            {pct}%
          </span>
        </div>

        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {isOver && cutChannels.length > 0 && (
          <div className="mt-4 px-3.5 py-3 rounded-md bg-status-weak/[0.06] border border-status-weak/[0.15]">
            <p className="text-status-weak text-[11px] font-medium mb-2">
              Over capacity — reduce these channels first
            </p>
            <ul className="space-y-1.5">
              {cutChannels.map((c) => (
                <li key={c.channel} className="text-[11px] flex justify-between">
                  <span className="text-text-secondary">{CHANNEL_LABELS[c.channel]}</span>
                  <span className="font-mono text-status-weak">
                    {c.currentUnits} → {c.recommendedUnits} ({c.delta})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isOver && (
          <p className="mt-3 text-text-tertiary text-[11px] leading-relaxed">
            {pct <= 70
              ? 'Room to expand high-performing channels'
              : pct <= 85
              ? 'Healthy utilization'
              : 'Approaching capacity — prioritize highest-return channels'}
          </p>
        )}
      </div>
    </section>
  );
}
