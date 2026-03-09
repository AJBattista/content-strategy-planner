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
    <section className="bg-surface rounded-lg border border-surface-border">
      <div className="px-5 py-4 border-b border-surface-border">
        <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
          Channel Forecast
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Channel</th>
              <th className="text-right px-5 py-3 font-medium">Forecast Traffic</th>
              <th className="text-right px-5 py-3 font-medium">Forecast Conversions</th>
              <th className="text-right px-5 py-3 font-medium">Forecast Revenue</th>
              <th className="text-right px-5 py-3 font-medium">Rev / Unit</th>
              <th className="text-right px-5 py-3 font-medium">Rev / Hour</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => {
              const accent = CHANNEL_ACCENT_CLASSES[f.channel];
              return (
                <tr
                  key={f.channel}
                  className="border-t border-surface-border hover:bg-surface-light/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                      <span className="text-text-primary font-medium">
                        {CHANNEL_LABELS[f.channel]}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-5 py-3 font-mono text-text-primary">
                    {fmt(f.forecastTraffic)}
                  </td>
                  <td className="text-right px-5 py-3 font-mono text-text-primary">
                    {fmt(f.forecastConversions)}
                  </td>
                  <td className="text-right px-5 py-3 font-mono text-text-primary">
                    {fmtCurrency(f.forecastRevenue)}
                  </td>
                  <td className="text-right px-5 py-3 font-mono text-text-secondary">
                    {fmtCurrency(f.revenuePerUnit)}
                  </td>
                  <td className="text-right px-5 py-3 font-mono text-text-secondary">
                    {fmtCurrency(f.revenuePerHour)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-surface-border bg-surface-light/30">
              <td className="px-5 py-3 text-text-primary font-semibold">Total</td>
              <td className="text-right px-5 py-3 font-mono text-text-primary font-semibold">
                {fmt(totalTraffic)}
              </td>
              <td className="text-right px-5 py-3 font-mono text-text-primary font-semibold">
                {fmt(totalConversions)}
              </td>
              <td className="text-right px-5 py-3 font-mono text-text-primary font-semibold">
                {fmtCurrency(totalRevenue)}
              </td>
              <td className="px-5 py-3" />
              <td className="px-5 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
