import { Channel, BenchmarkFitLabel } from '@/lib/types';

export const CHANNEL_ACCENT_CLASSES: Record<Channel, { border: string; text: string; bg: string }> = {
  [Channel.Instagram]: { border: 'border-channel-instagram', text: 'text-channel-instagram', bg: 'bg-channel-instagram' },
  [Channel.TikTok]: { border: 'border-channel-tiktok', text: 'text-channel-tiktok', bg: 'bg-channel-tiktok' },
  [Channel.LinkedIn]: { border: 'border-channel-linkedin', text: 'text-channel-linkedin', bg: 'bg-channel-linkedin' },
  [Channel.Email]: { border: 'border-channel-email', text: 'text-channel-email', bg: 'bg-channel-email' },
  [Channel.BlogSEO]: { border: 'border-channel-seo', text: 'text-channel-seo', bg: 'bg-channel-seo' },
  [Channel.Webinar]: { border: 'border-channel-webinar', text: 'text-channel-webinar', bg: 'bg-channel-webinar' },
};

export const FIT_LABEL_CLASSES: Record<BenchmarkFitLabel, { text: string; bg: string; dot: string }> = {
  'Strong Fit': { text: 'text-status-strong', bg: 'bg-status-strong/15', dot: 'bg-status-strong' },
  'Viable': { text: 'text-status-neutral', bg: 'bg-status-neutral/15', dot: 'bg-status-neutral' },
  'Weak Fit': { text: 'text-status-weak', bg: 'bg-status-weak/15', dot: 'bg-status-weak' },
  'Overextended': { text: 'text-status-caution', bg: 'bg-status-caution/15', dot: 'bg-status-caution' },
};
