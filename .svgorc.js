module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
          removeDesc: false,
        },
      },
    },
    {
      name: 'removeDimensions',
    },
    {
      name: 'removeXMLNS',
    },
  ],
}; 