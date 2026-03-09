'use client';

import { PlannerWarning } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES } from './channel-colors';

interface WarningsPanelProps {
  warnings: PlannerWarning[];
}

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  const underinvested = warnings.filter((w) => w.type === 'underinvested');
  const overinvested = warnings.filter((w) => w.type === 'overinvested');

  if (warnings.length === 0) {
    return (
      <section className="bg-surface rounded-lg border border-surface-border overflow-hidden h-full">
        <div className="px-5 py-3.5 border-b border-surface-border">
          <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
            Warnings
          </h2>
        </div>
        <div className="p-5 flex items-center justify-center min-h-[120px]">
          <p className="text-text-tertiary text-xs">No warnings for current plan</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden h-full">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Warnings
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {underinvested.length > 0 && (
          <div>
            <h3 className="text-status-strong text-[10px] font-semibold uppercase tracking-[0.08em] mb-2 leading-none">
              Underinvested Opportunity
            </h3>
            <div className="space-y-2">
              {underinvested.map((w, i) => {
                const accent = CHANNEL_ACCENT_CLASSES[w.channel];
                return (
                  <div
                    key={i}
                    className="px-3.5 py-3 rounded-md bg-status-strong/[0.06] border border-status-strong/[0.15]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
                      <span className="text-text-primary text-[13px] font-medium">
                        {CHANNEL_LABELS[w.channel]}
                      </span>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed mb-1.5 pl-[18px]">{w.reason}</p>
                    <p className="text-status-strong text-[11px] font-medium pl-[18px]">{w.suggestion}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {overinvested.length > 0 && (
          <div>
            <h3 className="text-status-caution text-[10px] font-semibold uppercase tracking-[0.08em] mb-2 leading-none">
              Overinvested Channel
            </h3>
            <div className="space-y-2">
              {overinvested.map((w, i) => {
                const accent = CHANNEL_ACCENT_CLASSES[w.channel];
                return (
                  <div
                    key={i}
                    className="px-3.5 py-3 rounded-md bg-status-caution/[0.06] border border-status-caution/[0.15]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
                      <span className="text-text-primary text-[13px] font-medium">
                        {CHANNEL_LABELS[w.channel]}
                      </span>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed mb-1.5 pl-[18px]">{w.reason}</p>
                    <p className="text-status-caution text-[11px] font-medium pl-[18px]">{w.suggestion}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
