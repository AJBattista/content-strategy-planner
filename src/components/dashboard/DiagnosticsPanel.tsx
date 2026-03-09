'use client';

import { useState } from 'react';
import { ChannelForecast } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES } from './channel-colors';

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(2) + '%';
}

interface DiagnosticsPanelProps {
  forecasts: ChannelForecast[];
}

export default function DiagnosticsPanel({ forecasts }: DiagnosticsPanelProps) {
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const forecastsWithDiag = forecasts.filter((f) => f.diagnostics !== null);
  if (forecastsWithDiag.length === 0) return null;

  return (
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Channel Diagnostics
        </h2>
      </div>
      <div className="p-5 space-y-2">
        {forecastsWithDiag.map((f) => {
          const accent = CHANNEL_ACCENT_CLASSES[f.channel];
          const isExpanded = expandedChannel === f.channel;
          const diag = f.diagnostics!;

          return (
            <div key={f.channel} className={`rounded-md border-l-2 ${accent.border} bg-surface-light/40`}>
              <button
                onClick={() => setExpandedChannel(isExpanded ? null : f.channel)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-surface-light/60 transition-colors rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                  <span className="text-text-primary text-sm font-medium">
                    {CHANNEL_LABELS[f.channel]}
                  </span>
                  <span className="text-text-secondary text-xs capitalize">
                    ({diag.type})
                  </span>
                </div>
                <span className="text-text-secondary text-xs">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {diag.type === 'social' && (
                    <>
                      <DiagMetric label="Impressions" value={fmt(diag.impressions)} />
                      <DiagMetric label="Engagement Rate" value={fmtPct(diag.engagementRate)} />
                      <DiagMetric label="Engagements" value={fmt(diag.engagements)} />
                    </>
                  )}
                  {diag.type === 'email' && (
                    <>
                      <DiagMetric label="Sends" value={fmt(diag.sends)} />
                      <DiagMetric label="Open Rate" value={fmtPct(diag.openRate)} />
                      <DiagMetric label="Opens" value={fmt(diag.opens)} />
                      <DiagMetric label="Click Rate" value={fmtPct(diag.clickRate)} />
                      <DiagMetric label="Clicks" value={fmt(diag.clicks)} />
                      <DiagMetric label="Conversions" value={fmt(diag.conversions)} />
                    </>
                  )}
                  {diag.type === 'seo' && (
                    <>
                      <DiagMetric label="Articles" value={fmt(diag.articles)} />
                      <DiagMetric label="Sessions / Article" value={fmt(diag.sessionsPerArticle)} />
                      <DiagMetric label="SEO CVR" value={fmtPct(diag.seoCVR)} />
                      <DiagMetric label="Conversions" value={fmt(diag.conversions)} />
                    </>
                  )}
                  {diag.type === 'webinar' && (
                    <>
                      <DiagMetric label="Registrations" value={fmt(diag.registrations)} />
                      <DiagMetric label="Attendees" value={fmt(diag.attendees)} />
                      <DiagMetric label="CTA Clicks" value={fmt(diag.ctaClicks)} />
                      <DiagMetric label="Conversions" value={fmt(diag.conversions)} />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DiagMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface/60 rounded px-3 py-2">
      <div className="text-text-secondary text-[10px] uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-text-primary text-sm font-mono">{value}</div>
    </div>
  );
}
