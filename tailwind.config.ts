import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a2540",      // Corporativo Blu Navy Scuro
        accent: "#c5a880",       // Oro / Bronzo per evidenziazioni & CTA
        'accent-hover': "#b4966d", // Oro scuro per hover
        base: "#f8fafc",         // Sfondo grigio chiarissimo residenziale / commerciale
        'text-base': "#1e293b",  // Testo grigio scuro ad alta leggibilità
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
