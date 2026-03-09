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
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden h-full">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Channel Diagnostics
        </h2>
      </div>
      <div className="p-4 space-y-1.5">
        {forecastsWithDiag.map((f) => {
          const accent = CHANNEL_ACCENT_CLASSES[f.channel];
          const isExpanded = expandedChannel === f.channel;
          const diag = f.diagnostics!;

          return (
            <div key={f.channel} className={`rounded-md border-l-[3px] ${accent.border} bg-surface-light/50 overflow-hidden`}>
              <button
                onClick={() => setExpandedChannel(isExpanded ? null : f.channel)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-surface-hover transition-colors duration-150"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
                  <span className="text-text-primary text-[13px] font-medium">
                    {CHANNEL_LABELS[f.channel]}
                  </span>
                  <span className="text-text-tertiary text-[10px] uppercase tracking-wider">
                    {diag.type}
                  </span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3 pt-0.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {diag.type === 'social' && (
                    <>
                      <Metric label="Impressions" value={fmt(diag.impressions)} />
                      <Metric label="Engagement Rate" value={fmtPct(diag.engagementRate)} />
                      <Metric label="Engagements" value={fmt(diag.engagements)} />
                    </>
                  )}
                  {diag.type === 'email' && (
                    <>
                      <Metric label="Sends" value={fmt(diag.sends)} />
                      <Metric label="Open Rate" value={fmtPct(diag.openRate)} />
                      <Metric label="Opens" value={fmt(diag.opens)} />
                      <Metric label="Click Rate" value={fmtPct(diag.clickRate)} />
                      <Metric label="Clicks" value={fmt(diag.clicks)} />
                      <Metric label="Conversions" value={fmt(diag.conversions)} />
                    </>
                  )}
                  {diag.type === 'seo' && (
                    <>
                      <Metric label="Articles" value={fmt(diag.articles)} />
                      <Metric label="Sessions / Article" value={fmt(diag.sessionsPerArticle)} />
                      <Metric label="SEO CVR" value={fmtPct(diag.seoCVR)} />
                      <Metric label="Conversions" value={fmt(diag.conversions)} />
                    </>
                  )}
                  {diag.type === 'webinar' && (
                    <>
                      <Metric label="Registrations" value={fmt(diag.registrations)} />
                      <Metric label="Attendees" value={fmt(diag.attendees)} />
                      <Metric label="CTA Clicks" value={fmt(diag.ctaClicks)} />
                      <Metric label="Conversions" value={fmt(diag.conversions)} />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded px-3 py-2">
      <div className="text-text-tertiary text-[9px] uppercase tracking-[0.06em] mb-1 leading-none">{label}</div>
      <div className="text-text-primary text-[13px] font-mono leading-none">{value}</div>
    </div>
  );
}
