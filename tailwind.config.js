
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
                  DEFAULT: '#2b703b',
        light: '#3a944e',
        dark: '#1e4f29',
        },
        secondary: colors.blue,
        accent: colors.red,
        background: '#FFFFFF',
        textPrimary: colors.gray[800],
        textSecondary: colors.gray[500],
        card: '#FFFFFF',
        inputBg: colors.gray[100],
      },
    },
  },
  plugins: [],
}

