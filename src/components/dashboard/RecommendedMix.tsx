'use client';

import { RecommendedChannelMix } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES } from './channel-colors';

function fmtCurrency(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

interface RecommendedMixProps {
  mix: RecommendedChannelMix[];
}

export default function RecommendedMix({ mix }: RecommendedMixProps) {
  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Recommended Mix
        </h2>
      </div>
      <div className="p-4 space-y-2">
        {mix.map((m) => {
          const accent = CHANNEL_ACCENT_CLASSES[m.channel];
          const deltaColor =
            m.delta > 0
              ? 'text-status-strong'
              : m.delta < 0
              ? 'text-status-weak'
              : 'text-text-tertiary';
          const deltaPrefix = m.delta > 0 ? '+' : '';

          return (
            <div
              key={m.channel}
              className={`px-3.5 py-3 rounded-md border-l-[3px] ${accent.border} bg-surface-light/50`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.bg} shrink-0`} />
                  <span className="text-text-primary text-[13px] font-medium">
                    {CHANNEL_LABELS[m.channel]}
                  </span>
                </div>
                <span className={`text-[13px] font-mono font-medium ${deltaColor}`}>
                  {deltaPrefix}{m.delta} units
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-secondary pl-[18px]">
                <span>
                  Current <span className="font-mono text-text-primary">{m.currentUnits}</span>
                </span>
                <span className="text-text-tertiary">→</span>
                <span>
                  Recommended <span className="font-mono text-text-primary">{m.recommendedUnits}</span>
                </span>
                <span className="hidden sm:inline ml-auto text-text-tertiary">
                  Rev/Unit <span className="font-mono text-text-secondary">{fmtCurrency(m.revenuePerUnit)}</span>
                </span>
                <span className="hidden sm:inline text-text-tertiary">
                  Rev/Hour <span className="font-mono text-text-secondary">{fmtCurrency(m.revenuePerHour)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
