'use client';

import { ChannelForecast } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES, FIT_LABEL_CLASSES } from './channel-colors';

interface BenchmarkFitPanelProps {
  forecasts: ChannelForecast[];
}

export default function BenchmarkFitPanel({ forecasts }: BenchmarkFitPanelProps) {
  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden h-full">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Benchmark Fit
        </h2>
      </div>
      <div className="p-4 space-y-2">
        {forecasts.map((f) => {
          const accent = CHANNEL_ACCENT_CLASSES[f.channel];
          const fit = FIT_LABEL_CLASSES[f.benchmarkFit];
          const cadenceLabel = f.cadenceMultiplier === 1.0 ? 'Optimal' : `×${f.cadenceMultiplier.toFixed(2)}`;
          const formatLabel = f.formatMultiplier >= 1.1 ? 'Preferred' : f.formatMultiplier >= 1.0 ? 'Neutral' : 'Weak';
          return (
            <div
              key={f.channel}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-md border-l-[3px] ${accent.border} bg-surface-light/50`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full ${accent.bg} shrink-0`} />
                <span className="text-text-primary text-[13px] font-medium truncate">
                  {CHANNEL_LABELS[f.channel]}
                </span>
                <div className="hidden sm:flex items-center gap-1.5 ml-1">
                  <span className="text-text-tertiary text-[10px]">{cadenceLabel}</span>
                  <span className="text-text-tertiary text-[10px]">·</span>
                  <span className="text-text-tertiary text-[10px]">{formatLabel}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium shrink-0 ${fit.bg} ${fit.text}`}
              >
                <span className={`w-1 h-1 rounded-full ${fit.dot}`} />
                {f.benchmarkFit}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
