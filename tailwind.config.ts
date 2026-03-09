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
        surface: {
          DEFAULT: '#1e2130',
          light: '#262a3d',
          border: '#2e3348',
        },
        'text-primary': '#e8eaed',
        'text-secondary': '#8b91a3',
        'status-neutral': '#5b8fb9',
        'status-strong': '#4a9e8e',
        'status-caution': '#c9952c',
        'status-weak': '#b55454',
        'channel-instagram': '#b24a7a',
        'channel-tiktok': '#4a9eb2',
        'channel-linkedin': '#4a72b2',
        'channel-email': '#c9952c',
        'channel-seo': '#3d9e6e',
        'channel-webinar': '#7a5bb2',
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
