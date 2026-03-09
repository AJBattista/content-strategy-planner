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
      <section className="bg-surface rounded-lg border border-surface-border">
        <div className="px-5 py-4 border-b border-surface-border">
          <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
            Warnings
          </h2>
        </div>
        <div className="p-5">
          <p className="text-text-secondary text-sm">No warnings for current plan.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Warnings
        </h2>
      </div>
      <div className="p-5 space-y-4">
        {underinvested.length > 0 && (
          <div>
            <h3 className="text-status-strong text-xs font-semibold uppercase tracking-wider mb-2">
              Underinvested Opportunity
            </h3>
            <div className="space-y-2">
              {underinvested.map((w, i) => {
                const accent = CHANNEL_ACCENT_CLASSES[w.channel];
                return (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-status-strong/5 border border-status-strong/20"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                      <span className="text-text-primary text-sm font-medium">
                        {CHANNEL_LABELS[w.channel]}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mb-1">{w.reason}</p>
                    <p className="text-status-strong text-xs font-medium">{w.suggestion}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {overinvested.length > 0 && (
          <div>
            <h3 className="text-status-caution text-xs font-semibold uppercase tracking-wider mb-2">
              Overinvested Channel
            </h3>
            <div className="space-y-2">
              {overinvested.map((w, i) => {
                const accent = CHANNEL_ACCENT_CLASSES[w.channel];
                return (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-status-caution/5 border border-status-caution/20"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                      <span className="text-text-primary text-sm font-medium">
                        {CHANNEL_LABELS[w.channel]}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mb-1">{w.reason}</p>
                    <p className="text-status-caution text-xs font-medium">{w.suggestion}</p>
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
