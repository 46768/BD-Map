import type { Config } from "tailwindcss";
import daisyui from "daisyui"
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        '18': '4.5rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'wh': 'width height',
      },
      height: {
        '10vh': '10vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh',
        '10/100': '10%',
        '20/100': '20%',
        '30/100': '30%',
        '40/100': '40%',
        '50/100': '50%',
        '60/100': '60%',
        '70/100': '70%',
        '80/100': '80%',
        '90/100': '90%',
        '100vh-Navrem': 'calc(100vh - 8rem)',
      },
    },
  },
  plugins: [
    daisyui,
  ],

  daisyui: {
    themes: ['dark', 'light', 'winter']
  },
};
export default config;
