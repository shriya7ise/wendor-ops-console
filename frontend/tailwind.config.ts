import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        // font-mono is shared: her --font-console and your --font-data
        // both resolve to IBM Plex Mono, so one shared mapping is
        // correct for both her screens and yours.
        mono: ['var(--font-data)', 'monospace'],
        // her ("depot console") section — none of these keys exist in
        // your palette below, so nothing here overwrites anything of
        // yours. Names kept exactly as in her original config so her
        // class names (text-accent, bg-ink, text-slate-400, ...) keep
        // working unmodified.
        sans: ['var(--font-body-wendor)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ---- her ("depot console") palette — sarathi-labs-main -------
        // Kept as distinct token names (not overriding neutral/amber/etc
        // below) so her screens render pixel-identical to her original.
        ink: '#161310',
        panel: '#1E1A15',
        line: '#3A3226',
        accent: '#E8A33D',
        accent2: '#4FA7A0',
        success: '#7CB668',
        warn: '#D2A23A',
        danger: '#C1503F',
        slate: {
          100: '#F3EEE4',
          200: '#DED5C4',
          300: '#B7AB93',
          400: '#8C7F68',
          500: '#6B6250',
          600: '#4B4536',
          700: '#332F25',
        },
        // ----------------------------------------------------------------
        // Cool ink/graphite structural scale (replaces default neutral everywhere in the app)
        neutral: {
          50: '#F5F6F7',
          100: '#EBEDEF',
          200: '#DDE1E5',
          300: '#C3C9D0',
          400: '#98A0AB',
          500: '#717986',
          600: '#545C68',
          700: '#3E4652',
          800: '#262C35',
          900: '#14181F',
        },
        // Refined brick alarm red (negative / critical / failed states)
        red: {
          50: '#FBF0EE',
          100: '#F5DCD6',
          200: '#E9B7AC',
          300: '#DC9282',
          400: '#CC6B57',
          500: '#BB4A34',
          600: '#A33A26',
          700: '#832E1E',
          800: '#63230C',
          900: '#4A1B12',
        },
        // Teal-green positive / completed / online states
        emerald: {
          50: '#EEF7F4',
          100: '#D3EDE4',
          200: '#A8DBC9',
          300: '#7BC7AF',
          400: '#4FAE93',
          500: '#2F9078',
          600: '#1F7A64',
          700: '#186354',
          800: '#134C41',
          900: '#0E362F',
        },
        // Ink-blue info states
        sky: {
          50: '#EFF5F9',
          100: '#DCEAF3',
          200: '#B7D6E8',
          300: '#8FC0DB',
          400: '#5FA3C7',
          500: '#3D84AC',
          600: '#2C6A8C',
          700: '#235571',
          800: '#1B4258',
          900: '#142F3F',
        },
        // Copper/coin accent — primary brand color, warning states, links
        amber: {
          50: '#FBF3E7',
          100: '#F3E0BE',
          200: '#E7C489',
          300: '#D9A65A',
          400: '#CC8F3B',
          500: '#C77D22',
          600: '#B06A17',
          700: '#8F5513',
          800: '#6E410F',
          900: '#4D2E0B',
        },
        // Dark console shell (sidebar/topbar chrome)
        shell: {
          DEFAULT: '#11151B',
          raised: '#171C24',
          line: '#242B35',
          text: '#D8DCE2',
          muted: '#7D8695',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 31, 0.04), 0 1px 12px rgba(20, 24, 31, 0.03)',
      },
      borderRadius: {
        xl: '10px',
        // her radius scale, isolated under its own key (her components
        // were rewritten from rounded-lg/rounded-xl -> rounded-console,
        // see MERGE_NOTES.md) so it can't collide with xl above.
        console: '5px',
      },
    },
  },
  plugins: [],
};
export default config;
