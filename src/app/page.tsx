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
      {/* Header */}
      <header className="border-b border-surface-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-text-primary text-lg font-semibold tracking-tight">
            Content Strategy Planner
          </h1>
          <p className="text-text-secondary text-xs mt-0.5">
            Monthly content allocation — DTC Ecommerce · Purchase
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label="Forecast Traffic"
            value={Math.round(output.totalForecastTraffic).toLocaleString()}
          />
          <SummaryCard
            label="Forecast Conversions"
            value={Math.round(output.totalForecastConversions).toLocaleString()}
          />
          <SummaryCard
            label="Forecast Revenue"
            value={'$' + Math.round(output.totalForecastRevenue).toLocaleString()}
          />
        </div>

        {/* Forecast table — traffic, conversions, revenue by channel */}
        <ForecastTable
          forecasts={output.channelForecasts}
          totalTraffic={output.totalForecastTraffic}
          totalConversions={output.totalForecastConversions}
          totalRevenue={output.totalForecastRevenue}
        />

        {/* Two-column layout: Benchmark Fit + Capacity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BenchmarkFitPanel forecasts={output.channelForecasts} />
          <CapacityUtilization
            utilization={output.capacityUtilization}
            mix={output.recommendedMix}
          />
        </div>

        {/* Recommended Mix */}
        <RecommendedMix mix={output.recommendedMix} />

        {/* Two-column layout: Warnings + Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WarningsPanel warnings={output.warnings} />
          <DiagnosticsPanel forecasts={output.channelForecasts} />
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4">
      <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="text-text-primary text-2xl font-mono font-semibold">{value}</div>
    </div>
  );
}
