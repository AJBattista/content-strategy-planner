'use client';

import { ChannelForecast } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES, FIT_LABEL_CLASSES } from './channel-colors';

interface BenchmarkFitPanelProps {
  forecasts: ChannelForecast[];
}

export default function BenchmarkFitPanel({ forecasts }: BenchmarkFitPanelProps) {
  return (
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Benchmark Fit
        </h2>
      </div>
      <div className="p-5 space-y-3">
        {forecasts.map((f) => {
          const accent = CHANNEL_ACCENT_CLASSES[f.channel];
          const fit = FIT_LABEL_CLASSES[f.benchmarkFit];
          return (
            <div
              key={f.channel}
              className={`flex items-center justify-between p-3 rounded-md border-l-2 ${accent.border} bg-surface-light/40`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                <span className="text-text-primary text-sm font-medium">
                  {CHANNEL_LABELS[f.channel]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-text-secondary text-xs">
                    Cadence {f.cadenceMultiplier === 1.0 ? 'optimal' : `×${f.cadenceMultiplier.toFixed(2)}`}
                  </span>
                  <span className="text-text-secondary text-xs mx-2">·</span>
                  <span className="text-text-secondary text-xs">
                    Format {f.formatMultiplier === 1.1 ? 'preferred' : f.formatMultiplier === 1.0 ? 'neutral' : 'weak'}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${fit.bg} ${fit.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${fit.dot}`} />
                  {f.benchmarkFit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
