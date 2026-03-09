'use client';

import { PlannerOutput } from '@/lib/types';

function fmtCurrency(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function delta(current: number, snapshot: number): string {
  const diff = current - snapshot;
  const sign = diff > 0 ? '+' : '';
  return sign + fmt(diff);
}

function deltaCurrency(current: number, snapshot: number): string {
  const diff = current - snapshot;
  const sign = diff > 0 ? '+' : '';
  return sign + fmtCurrency(diff);
}

interface ScenarioCompareProps {
  currentOutput: PlannerOutput;
  snapshotOutput: PlannerOutput | null;
  onSnapshot: () => void;
  onClearSnapshot: () => void;
}

export default function ScenarioCompare({
  currentOutput,
  snapshotOutput,
  onSnapshot,
  onClearSnapshot,
}: ScenarioCompareProps) {
  return (
    <section className="bg-surface rounded-lg border border-surface-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-surface-border flex items-center justify-between">
        <h2 className="text-text-primary font-semibold text-[11px] uppercase tracking-[0.08em] leading-none">
          Scenario Compare
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSnapshot}
            className="text-[11px] px-3 py-1.5 rounded bg-status-neutral/10 text-status-neutral hover:bg-status-neutral/20 transition-colors font-medium"
          >
            {snapshotOutput ? 'Update Snapshot' : 'Save Current as Baseline'}
          </button>
          {snapshotOutput && (
            <button
              type="button"
              onClick={onClearSnapshot}
              className="text-[11px] px-3 py-1.5 rounded bg-status-weak/10 text-status-weak hover:bg-status-weak/20 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {!snapshotOutput ? (
          <p className="text-text-tertiary text-xs">
            Save a baseline snapshot, then modify your inputs to compare scenarios side by side.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-text-tertiary text-[10px] uppercase tracking-[0.06em]">
                  <th className="text-left pr-3 py-2 font-medium">Metric</th>
                  <th className="text-right px-3 py-2 font-medium">Baseline</th>
                  <th className="text-right px-3 py-2 font-medium">Current</th>
                  <th className="text-right pl-3 py-2 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow
                  label="Forecast Traffic"
                  baseline={fmt(snapshotOutput.totalForecastTraffic)}
                  current={fmt(currentOutput.totalForecastTraffic)}
                  deltaStr={delta(currentOutput.totalForecastTraffic, snapshotOutput.totalForecastTraffic)}
                  deltaNum={currentOutput.totalForecastTraffic - snapshotOutput.totalForecastTraffic}
                />
                <CompareRow
                  label="Forecast Conversions"
                  baseline={fmt(snapshotOutput.totalForecastConversions)}
                  current={fmt(currentOutput.totalForecastConversions)}
                  deltaStr={delta(currentOutput.totalForecastConversions, snapshotOutput.totalForecastConversions)}
                  deltaNum={currentOutput.totalForecastConversions - snapshotOutput.totalForecastConversions}
                />
                <CompareRow
                  label="Forecast Revenue"
                  baseline={fmtCurrency(snapshotOutput.totalForecastRevenue)}
                  current={fmtCurrency(currentOutput.totalForecastRevenue)}
                  deltaStr={deltaCurrency(currentOutput.totalForecastRevenue, snapshotOutput.totalForecastRevenue)}
                  deltaNum={currentOutput.totalForecastRevenue - snapshotOutput.totalForecastRevenue}
                />
                <CompareRow
                  label="Capacity Utilization"
                  baseline={`${Math.round(snapshotOutput.capacityUtilization * 100)}%`}
                  current={`${Math.round(currentOutput.capacityUtilization * 100)}%`}
                  deltaStr={`${Math.round((currentOutput.capacityUtilization - snapshotOutput.capacityUtilization) * 100)}pp`}
                  deltaNum={currentOutput.capacityUtilization - snapshotOutput.capacityUtilization}
                />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function CompareRow({
  label,
  baseline,
  current,
  deltaStr,
  deltaNum,
}: {
  label: string;
  baseline: string;
  current: string;
  deltaStr: string;
  deltaNum: number;
}) {
  return (
    <tr className="border-t border-surface-border/60 hover:bg-surface-hover transition-colors duration-150">
      <td className="py-2.5 pr-3 text-text-primary text-[13px] font-medium">{label}</td>
      <td className="py-2.5 px-3 text-right font-mono text-[13px] text-text-secondary">{baseline}</td>
      <td className="py-2.5 px-3 text-right font-mono text-[13px] text-text-primary">{current}</td>
      <td className={`py-2.5 pl-3 text-right font-mono text-[13px] font-medium ${
        deltaNum > 0 ? 'text-status-strong' : deltaNum < 0 ? 'text-status-weak' : 'text-text-tertiary'
      }`}>
        {deltaStr}
      </td>
    </tr>
  );
}
