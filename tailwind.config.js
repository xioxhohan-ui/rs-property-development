const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* ── Brand ── */
        'bold-blue':  '#1E466B',
        'light-blue': '#67BAF4',
        'soft-white': '#FAFAFA',
        'jet-black':  '#0D0D0D',

        /* ── Tailwind semantic tokens ── */
        border:     "var(--border-color)",
        input:      "var(--border-color)",
        ring:       "var(--light-blue)",
        background: "var(--soft-white)",
        foreground: "var(--jet-black)",

        primary: {
          DEFAULT:    "#1E466B",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT:    "#FAFAFA",
          foreground: "#0D0D0D",
        },
        accent: {
          DEFAULT:    "#67BAF4",
          foreground: "#0D0D0D",
        },
        muted: {
          DEFAULT:    "#f1f5f9",
          foreground: "#5a6a7a",
        },
        card: {
          DEFAULT:    "#FFFFFF",
          foreground: "#0D0D0D",
        },
        popover: {
          DEFAULT:    "#FFFFFF",
          foreground: "#0D0D0D",
        },
        destructive: {
          DEFAULT:    "hsl(0 84.2% 60.2%)",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.875rem",
        md: "0.625rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        heading: ["Poppins", ...fontFamily.sans],
      },
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(30, 70, 107, 0.08)',
        'brand-md': '0 4px 12px -2px rgba(30, 70, 107, 0.14)',
        'brand-lg': '0 10px 30px -4px rgba(30, 70, 107, 0.18)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
