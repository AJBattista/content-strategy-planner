'use client';

import { useState } from 'react';
import {
  Industry,
  BusinessObjective,
  Channel,
} from '@/lib/types';
import {
  CHANNEL_LABELS,
} from '@/lib/constants';
import {
  getBenchmarkProfile,
  getAvailableChannels,
  getDefaultCVR,
} from '@/lib/benchmarks';

interface IndustryBenchmarksProps {
  industry: Industry;
  objective: BusinessObjective;
}

interface RPCOverrides {
  floor: string;
  base: string;
  ceiling: string;
}

interface ChannelBenchmarkOverrides {
  floor: string;
  base: string;
  ceiling: string;
  spendCap: string;
}

const CHANNEL_DOT_CLASSES: Record<Channel, string> = {
  [Channel.Instagram]: 'bg-channel-instagram',
  [Channel.TikTok]: 'bg-channel-tiktok',
  [Channel.LinkedIn]: 'bg-channel-linkedin',
  [Channel.Email]: 'bg-channel-email',
  [Channel.BlogSEO]: 'bg-channel-seo',
  [Channel.Webinar]: 'bg-channel-webinar',
};

function deriveRPCDefaults(
  industry: Industry,
  objective: BusinessObjective
): RPCOverrides {
  const channels = getAvailableChannels(industry);
  const cvrs = channels.map((ch) => getDefaultCVR(industry, ch, objective));
  const avgCVR = cvrs.length > 0 ? cvrs.reduce((a, b) => a + b, 0) / cvrs.length : 0.02;
  return {
    floor: String(Number((avgCVR * 0.5).toFixed(4))),
    base: String(Number(avgCVR.toFixed(4))),
    ceiling: String(Number((avgCVR * 2.0).toFixed(4))),
  };
}

function deriveChannelDefaults(
  industry: Industry,
  objective: BusinessObjective,
  channel: Channel
): ChannelBenchmarkOverrides {
  const benchmark = getBenchmarkProfile(industry).channels[channel];
  const cadence = benchmark.benchmarkCadenceMonthly;
  return {
    floor: String(Math.round(cadence * 0.5)),
    base: String(cadence),
    ceiling: String(Math.round(cadence * 2.0)),
    spendCap: String(Math.round(cadence * 1.5)),
  };
}

export default function IndustryBenchmarks({
  industry,
  objective,
}: IndustryBenchmarksProps) {
  const [expanded, setExpanded] = useState(false);

  const rpcDefaults = deriveRPCDefaults(industry, objective);
  const [rpc, setRpc] = useState<RPCOverrides>(rpcDefaults);

  const availableChannels = getAvailableChannels(industry);
  const [channelOverrides, setChannelOverrides] = useState<
    Record<string, ChannelBenchmarkOverrides>
  >(() => {
    const overrides: Record<string, ChannelBenchmarkOverrides> = {};
    for (const ch of availableChannels) {
      overrides[ch] = deriveChannelDefaults(industry, objective, ch);
    }
    return overrides;
  });

  const handleRpcChange = (field: keyof RPCOverrides, value: string) => {
    setRpc((prev) => ({ ...prev, [field]: value }));
  };

  const handleChannelChange = (
    channel: Channel,
    field: keyof ChannelBenchmarkOverrides,
    value: string
  ) => {
    setChannelOverrides((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], [field]: value },
    }));
  };

  return (
    <div className="bg-surface rounded-lg p-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <svg
          className={`w-4 h-4 text-secondary transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <h2 className="text-lg font-semibold text-foreground">Industry Benchmarks</h2>
        <span className="text-xs text-secondary ml-2">Advanced Controls</span>
      </button>

      {expanded && (
        <div className="mt-6 space-y-6">
          {/* RPC Floor / Base / Ceiling */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Revenue per Click (RPC)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1">RPC Floor</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.001"
                  value={rpc.floor}
                  onChange={(e) => handleRpcChange('floor', e.target.value)}
                  className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 min-h-[44px] text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">RPC Base</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.001"
                  value={rpc.base}
                  onChange={(e) => handleRpcChange('base', e.target.value)}
                  className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 min-h-[44px] text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">RPC Ceiling</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.001"
                  value={rpc.ceiling}
                  onChange={(e) => handleRpcChange('ceiling', e.target.value)}
                  className="w-full bg-surface-light border border-secondary/20 rounded-md px-3 py-2 min-h-[44px] text-foreground text-sm focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Per-channel benchmark fields */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Channel Benchmarks
            </h3>
            <div className="space-y-4">
              {availableChannels.map((channel) => {
                const overrides = channelOverrides[channel];
                if (!overrides) return null;
                return (
                  <div key={channel} className="bg-surface-light rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CHANNEL_DOT_CLASSES[channel]}`} />
                      <span className="text-sm font-medium text-foreground">
                        {CHANNEL_LABELS[channel]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-secondary mb-1">Floor</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={overrides.floor}
                          onChange={(e) =>
                            handleChannelChange(channel, 'floor', e.target.value)
                          }
                          className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 min-h-[44px] text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary mb-1">Base</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={overrides.base}
                          onChange={(e) =>
                            handleChannelChange(channel, 'base', e.target.value)
                          }
                          className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 min-h-[44px] text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary mb-1">Ceiling</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={overrides.ceiling}
                          onChange={(e) =>
                            handleChannelChange(channel, 'ceiling', e.target.value)
                          }
                          className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 min-h-[44px] text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary mb-1">Spend Cap</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={overrides.spendCap}
                          onChange={(e) =>
                            handleChannelChange(channel, 'spendCap', e.target.value)
                          }
                          className="w-full bg-background border border-secondary/20 rounded px-3 py-1.5 min-h-[44px] text-sm text-foreground focus:outline-none focus:border-status-steel transition-colors tabular-nums"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
