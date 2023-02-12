const config = {
  entries: [
    {
      filePath: "./src/index.ts",
      outFile: "./dist/svg-path-commander.d.ts",
      noCheck: false,
      output: {
        umdModuleName: 'SVGPathCommander',
        noBanner: true,
      }
    },
  ],
};

module.exports = config;
