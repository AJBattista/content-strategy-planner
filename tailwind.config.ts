import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Surface layers
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F7F5F2',
          hover: '#F0EDE8',
          border: '#D8D2CA',
        },

        // Text hierarchy
        'text-primary': '#1F1F1F',
        'text-secondary': '#5A5A5A',
        'text-tertiary': '#7A7A7A',

        // Legacy alias used by input form components
        secondary: '#5A5A5A',

        // Status colors
        'status-neutral': '#5B7A94',
        'status-strong': '#3D7A5C',
        'status-caution': '#B8862D',
        'status-weak': '#9E2F2F',

        // Legacy status aliases used by input form components
        'status-steel': '#5B7A94',
        'status-teal': '#3D7A5C',
        'status-amber': '#B8862D',
        'status-red': '#9E2F2F',

        // Channel accents
        'channel-instagram': '#964270',
        'channel-tiktok': '#3D7A8A',
        'channel-linkedin': '#3D5A80',
        'channel-email': '#C9A96E',
        'channel-seo': '#4A8C65',
        'channel-webinar': '#6B5080',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
