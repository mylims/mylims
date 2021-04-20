'use strict';

const compress = process.env.NODE_ENV !== 'production';

module.exports = {
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  compress,
};
