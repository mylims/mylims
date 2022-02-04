'use strict';

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [
    require('@zakodium/tailwind-config')({ colors: { neutral: 'slate' } }),
  ],
  theme: {
    minWidth: {
      0: '0',
      '1/4': '25%',
      '1/3': '33%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
    },
  },
};
