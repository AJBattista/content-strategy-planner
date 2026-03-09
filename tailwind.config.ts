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
          DEFAULT: '#161925',
          light: '#1e2130',
          hover: '#242738',
          border: '#272b3d',
        },

        // Text hierarchy
        'text-primary': '#e2e4e9',
        'text-secondary': '#7d8499',
        'text-tertiary': '#565c6e',

        // Legacy alias used by input form components
        secondary: '#7d8499',

        // Status colors
        'status-neutral': '#5b8fb9',
        'status-strong': '#4a9e8e',
        'status-caution': '#c49229',
        'status-weak': '#b05050',

        // Legacy status aliases used by input form components
        'status-steel': '#5b8fb9',
        'status-teal': '#4a9e8e',
        'status-amber': '#c49229',
        'status-red': '#b05050',

        // Channel accents
        'channel-instagram': '#a8467a',
        'channel-tiktok': '#4797a8',
        'channel-linkedin': '#4670a8',
        'channel-email': '#b8892a',
        'channel-seo': '#3a9468',
        'channel-webinar': '#7356a8',
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
