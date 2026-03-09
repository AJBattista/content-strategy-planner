'use client';

import { ChannelForecast } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { CHANNEL_ACCENT_CLASSES } from './channel-colors';

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function fmtCurrency(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

interface ForecastTableProps {
  forecasts: ChannelForecast[];
  totalTraffic: number;
  totalConversions: number;
  totalRevenue: number;
}

export default function ForecastTable({
  forecasts,
  totalTraffic,
  totalConversions,
  totalRevenue,
}: ForecastTableProps) {
  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Channel Forecast
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-text-tertiary text-[10px] uppercase tracking-[0.06em]">
              <th className="text-left pl-5 pr-3 py-2.5 font-medium">Channel</th>
              <th className="text-right px-3 py-2.5 font-medium">Forecast Traffic</th>
              <th className="text-right px-3 py-2.5 font-medium">Forecast Conversions</th>
              <th className="text-right px-3 py-2.5 font-medium">Forecast Revenue</th>
              <th className="text-right px-3 py-2.5 font-medium">Revenue / Unit</th>
              <th className="text-right pl-3 pr-5 py-2.5 font-medium">Revenue / Hour</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => {
              const accent = CHANNEL_ACCENT_CLASSES[f.channel];
              return (
                <tr
                  key={f.channel}
                  className="border-t border-surface-border/60 hover:bg-surface-hover transition-colors duration-150"
                >
                  <td className="pl-5 pr-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.bg} shrink-0`} />
                      <span className="text-text-primary text-[13px] font-medium">
                        {CHANNEL_LABELS[f.channel]}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary">
                    {fmt(f.forecastTraffic)}
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary">
                    {fmt(f.forecastConversions)}
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary font-medium">
                    {fmtCurrency(f.forecastRevenue)}
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-[13px] text-text-secondary">
                    {fmtCurrency(f.revenuePerUnit)}
                  </td>
                  <td className="text-right pl-3 pr-5 py-3 font-mono text-[13px] text-text-secondary">
                    {fmtCurrency(f.revenuePerHour)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-surface-border bg-surface-light/50">
              <td className="pl-5 pr-3 py-3 text-text-primary text-[13px] font-semibold">Total</td>
              <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary font-semibold">
                {fmt(totalTraffic)}
              </td>
              <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary font-semibold">
                {fmt(totalConversions)}
              </td>
              <td className="text-right px-3 py-3 font-mono text-[13px] text-text-primary font-semibold">
                {fmtCurrency(totalRevenue)}
              </td>
              <td className="px-3 py-3" />
              <td className="pl-3 pr-5 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
