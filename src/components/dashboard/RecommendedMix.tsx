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
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Recommended Mix
        </h2>
      </div>
      <div className="p-5 space-y-3">
        {mix.map((m) => {
          const accent = CHANNEL_ACCENT_CLASSES[m.channel];
          const deltaColor =
            m.delta > 0
              ? 'text-status-strong'
              : m.delta < 0
              ? 'text-status-weak'
              : 'text-text-secondary';
          const deltaPrefix = m.delta > 0 ? '+' : '';

          return (
            <div
              key={m.channel}
              className={`p-3 rounded-md border-l-2 ${accent.border} bg-surface-light/40`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                  <span className="text-text-primary text-sm font-medium">
                    {CHANNEL_LABELS[m.channel]}
                  </span>
                </div>
                <span className={`text-sm font-mono font-medium ${deltaColor}`}>
                  {deltaPrefix}{m.delta} units
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span>
                  Current: <span className="font-mono text-text-primary">{m.currentUnits}</span>
                </span>
                <span>→</span>
                <span>
                  Recommended: <span className="font-mono text-text-primary">{m.recommendedUnits}</span>
                </span>
                <span className="ml-auto hidden sm:inline">
                  Rev/Unit {fmtCurrency(m.revenuePerUnit)}
                </span>
                <span className="hidden sm:inline">
                  Rev/Hour {fmtCurrency(m.revenuePerHour)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
