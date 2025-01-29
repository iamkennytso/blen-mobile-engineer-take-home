/** @type {import('tailwindcss').Config} */
import { Colors } from './constants/colors';
const { light, dark } = Colors;
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'lt-text': light.text,
        'lt-bg': light.background,
        'lt-tint': light.tint,
        'lt-icon': light.icon,
        'lt-tab-icon': light.tabIconDefault,
        'dk-text': dark.text,
        'dk-bg': dark.background,
        'dk-tint': dark.tint,
        'dk-icon': dark.icon,
        'dk-tab-icon': dark.tabIconDefault,
      },
    },
  },
  plugins: [],
};
