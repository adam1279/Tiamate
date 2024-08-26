const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-dark": "#303030",
        "gray": "#a3a3a3",
        "gray-light": "#f0f0f0",
        "tiamate-green": "#80C080",
        "gray-darker": "#202020",
        "warning-red": "#e81123",
        "tiamate-blue": "#4392F1",
        "tiamate-red": "#D17272",
        "tiamate-orange": "#DE8F6E",
        "tiamate-yellow": "#FFD277",
        "tiamate-purple": "#C892BB"
      },
      fontFamily: {
        "sans": "Montserrat",
        "mono": "Noto Sans Mono"
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        border: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 var(--tw-shadow-color)'
      },
      keyframes: {
        huerotate: {
          "0%": {
              filter: "hue-rotate(0deg)"
          },
          "100%": {
              filter: "hue-rotate(360deg)"
          }
        }
      },
      animation: {
        huerotate: "huerotate 1s ease-in-out infinite"
      }
    }
  },
  plugins: [
    plugin(function ({addUtilities}) {
      addUtilities({
        ".drag-none": {
          '-webkit-user-drag': 'none',
					'-khtml-user-drag': 'none',
					'-moz-user-drag': 'none',
					'-o-user-drag': 'none',
					'user-drag': 'none'
        }
      })
    }),
    function({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
    require("@designbycode/tailwindcss-text-stroke"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
  safelist: [
    {
      pattern: /to-.+/
    },
    {
      pattern: /from-.+/
    },
    {
      pattern: /to-.+-.+/
    },
    {
      pattern: /from-.+-.+/
    },
    {
      pattern: /text-.+-.+/,
      variants: ["hover"]
    },
    {
      pattern: /bg-.+-.+/,
      variants: ["hover"]
    },
    {
      pattern: /fill-.+-.+/,
      variants: ["hover"]
    },
    {
      pattern: /stroke-1/,
      variants: ["hover"]
    },
    {
      pattern: /shrink-0/,
      variants: ["hover"]
    }
  ]
}