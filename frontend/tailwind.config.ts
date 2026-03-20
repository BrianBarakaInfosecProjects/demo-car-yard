/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sassy Dark Theme — mapped to CSS variables
        'bg-page': 'var(--bg-page)',
        'bg-card': 'var(--bg-card)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-on-accent': 'var(--text-primary)',
        'border-subtle': 'var(--border-color)',
        
        // Legacy aliases
        brand: {
          ink: '#0c0a08',
          'ink-mid': '#161310',
          'ink-soft': '#1c1814',
          gold: '#c4933f',
          'gold-lt': '#deb96a',
          'gold-pale': '#f0d898',
          cream: '#f0ebe0',
          'cream-warm': '#faf6ef',
        },
        bg: {
          primary: '#0c0a08',
          card: '#1c1814',
          elevated: '#161310',
          mid: '#161310',
        },
        primary: {
          DEFAULT: '#1e40af',
          dark: '#1e3a8a',
          light: '#3b82f6',
        },
        secondary: '#0ea5e9',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        whatsapp: '#25D366',
        ink: '#0c0a08',
        cream: '#f0ebe0',
        border: {
          DEFAULT: '#2d2d2d',
          light: '#3d3d3d',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        cond: ['Barlow Condensed', 'Barlow', 'sans-serif'],
      },
      fontSize: {
        'body': 'var(--size-body)',
        'small': 'var(--size-small)',
      },
      spacing: {
        'navbar': 'var(--navbar-height)',
        'page-x': 'var(--page-padding-x)',
        'section-y': 'var(--section-padding-y)',
      },
      maxWidth: {
        'content': 'var(--max-content-width)',
        'container': '1400px',
      },
      height: {
        'nav': 'var(--navbar-height)',
        'nav-mobile': '56px',
        'btn': '44px',
        'btn-sm': '40px',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'button': 'var(--radius-button)',
        'modal': '16px',
      },
    },
  },
  plugins: [],
}
