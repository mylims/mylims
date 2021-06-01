'use strict';

const commonWidth = {
  '1/4': '25%',
  '1/3': '33%',
  '1/2': '50%',
  '3/4': '75%',
};

module.exports = {
  presets: [
    require('@zakodium/tailwind-config')({
      colors: {
        neutral: 'cool-gray',
      },
    }),
  ],
  theme: {
    minWidth: {
      0: '0',
      ...commonWidth,
      full: '100%',
    },
    maxWidth: {
      ...commonWidth,
    },
    width: {
      ...commonWidth,
    },
  },
};
