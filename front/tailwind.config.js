'use strict'

module.exports = {
  presets: [
    require('@zakodium/tailwind-config')({
      colors: {
        neutral: 'cool-gray'
      }
    })
  ],
  theme: {
    minWidth: {
      0: '0',
      '1/4': '25%',
      '1/3': '33%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%'
    }
  }
}
