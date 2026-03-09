'use client';

import {
  ForecastTable,
  BenchmarkFitPanel,
  RecommendedMix,
  WarningsPanel,
  CapacityUtilization,
  DiagnosticsPanel,
} from '@/components/dashboard';
import { placeholderOutput } from '@/components/dashboard/placeholder-data';

export default function Home() {
  const output = placeholderOutput;

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-text-primary text-base font-semibold tracking-tight leading-none">
              Content Strategy Planner
            </h1>
            <p className="text-text-secondary text-[11px] mt-1.5 tracking-wide">
              Monthly content allocation — DTC Ecommerce · Purchase
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8 space-y-6">
        {/* KPI summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            label="Forecast Traffic"
            value={Math.round(output.totalForecastTraffic).toLocaleString()}
          />
          <KPICard
            label="Forecast Conversions"
            value={Math.round(output.totalForecastConversions).toLocaleString()}
          />
          <KPICard
            label="Forecast Revenue"
            value={'$' + Math.round(output.totalForecastRevenue).toLocaleString()}
            highlight
          />
        </div>

        <ForecastTable
          forecasts={output.channelForecasts}
          totalTraffic={output.totalForecastTraffic}
          totalConversions={output.totalForecastConversions}
          totalRevenue={output.totalForecastRevenue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <BenchmarkFitPanel forecasts={output.channelForecasts} />
          </div>
          <div className="lg:col-span-2">
            <CapacityUtilization
              utilization={output.capacityUtilization}
              mix={output.recommendedMix}
            />
          </div>
        </div>

        <RecommendedMix mix={output.recommendedMix} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WarningsPanel warnings={output.warnings} />
          <DiagnosticsPanel forecasts={output.channelForecasts} />
        </div>
      </main>

      <footer className="border-t border-surface-border mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4">
          <p className="text-text-tertiary text-[10px] tracking-wide">
            Forecasts use industry benchmark data. Actual results depend on execution quality, audience size, and market conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}

function KPICard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border px-5 py-4">
      <div className="text-text-secondary text-[10px] uppercase tracking-[0.08em] mb-2 leading-none">{label}</div>
      <div className={`text-2xl font-mono font-semibold leading-none ${highlight ? 'text-status-strong' : 'text-text-primary'}`}>
        {value}
      </div>
    </div>
  );
}
