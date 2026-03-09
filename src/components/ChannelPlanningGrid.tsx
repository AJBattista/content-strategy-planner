'use client';

import {
  Industry,
  BusinessObjective,
  Channel,
  ChannelPlanInput,
} from '@/lib/types';
import {
  CHANNEL_LABELS,
} from '@/lib/constants';
import {
  getAvailableChannels,
  getValidFormatsForChannel,
  getDefaultCVR,
} from '@/lib/benchmarks';
import ChannelPlanRow from './ChannelPlanRow';

const ALL_CHANNELS: Channel[] = [
  Channel.Instagram,
  Channel.TikTok,
  Channel.LinkedIn,
  Channel.Email,
  Channel.BlogSEO,
  Channel.Webinar,
];

const CHANNEL_COLOR_CLASSES: Record<Channel, string> = {
  [Channel.Instagram]: 'border-channel-instagram',
  [Channel.TikTok]: 'border-channel-tiktok',
  [Channel.LinkedIn]: 'border-channel-linkedin',
  [Channel.Email]: 'border-channel-email',
  [Channel.BlogSEO]: 'border-channel-seo',
  [Channel.Webinar]: 'border-channel-webinar',
};

const CHANNEL_DOT_CLASSES: Record<Channel, string> = {
  [Channel.Instagram]: 'bg-channel-instagram',
  [Channel.TikTok]: 'bg-channel-tiktok',
  [Channel.LinkedIn]: 'bg-channel-linkedin',
  [Channel.Email]: 'bg-channel-email',
  [Channel.BlogSEO]: 'bg-channel-seo',
  [Channel.Webinar]: 'bg-channel-webinar',
};

interface ChannelPlanningGridProps {
  industry: Industry;
  objective: BusinessObjective;
  enabledChannels: Set<Channel>;
  channelPlans: Record<Channel, ChannelPlanInput>;
  onToggleChannel: (channel: Channel) => void;
  onUpdatePlan: (channel: Channel, updates: Partial<ChannelPlanInput>) => void;
}

export default function ChannelPlanningGrid({
  industry,
  objective,
  enabledChannels,
  channelPlans,
  onToggleChannel,
  onUpdatePlan,
}: ChannelPlanningGridProps) {
  const availableChannels = getAvailableChannels(industry);

  return (
    <div className="bg-surface rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Channel Planning</h2>

      <div className="space-y-3">
        {ALL_CHANNELS.map((channel) => {
          const isAvailable = availableChannels.includes(channel);
          const isEnabled = enabledChannels.has(channel) && isAvailable;
          const plan = channelPlans[channel];
          const defaultCVR = getDefaultCVR(industry, channel, objective);
          const validFormats = getValidFormatsForChannel(channel);

          return (
            <div
              key={channel}
              className={`rounded-lg border-l-2 transition-all ${
                isEnabled
                  ? `${CHANNEL_COLOR_CLASSES[channel]} bg-surface-light`
                  : 'border-secondary/10 bg-surface-light/40'
              } ${!isAvailable ? 'opacity-40' : ''}`}
            >
              {/* Channel Toggle Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onToggleChannel(channel)}
                  className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                    isEnabled ? 'bg-status-teal' : 'bg-secondary/30'
                  } ${!isAvailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Toggle ${CHANNEL_LABELS[channel]}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CHANNEL_DOT_CLASSES[channel]}`} />
                <span className={`text-sm font-medium ${isEnabled ? 'text-foreground' : 'text-secondary'}`}>
                  {CHANNEL_LABELS[channel]}
                </span>
                {!isAvailable && (
                  <span className="text-xs text-secondary/50 ml-auto">Not available for this industry</span>
                )}
              </div>

              {/* Expanded Plan Inputs */}
              {isEnabled && (
                <ChannelPlanRow
                  channel={channel}
                  plan={plan}
                  defaultCVR={defaultCVR}
                  validFormats={validFormats}
                  onUpdate={(updates) => onUpdatePlan(channel, updates)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
