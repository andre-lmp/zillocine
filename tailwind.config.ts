import type { Config } from "tailwindcss";

const config: Config = {

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'var(--font-roboto)'],
        raleway: ['var(--font-raleway)', 'var(--font-poppins)'],
        roboto: ['var(--font-roboto)', 'var(--font-poppins)'],
        noto_sans: ['var(--font-noto-sans)', 'var(--font-poppins)']
      },

      colors: {
        orangered: 'rgb(255, 69, 0)',
        darkslateblue: '#483D8B',
        darkpurple: '#16142B',
        richblack: '#080C1E',
        deepnight: '#020515'
      },
    },
  },

  plugins: [
    require('daisyui'),
  ],


};
export default config;
