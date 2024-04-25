/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  verbose: true,
  transform: {
    "\\.[tj]sx?$": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },

  testRegex: "packages/.*\\.test\\.(jsx?|tsx?)$",

  // setupFilesAfterEnv: ['<rootDir>/jestSetupTests.js'],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "lcov", "text"],
  watchPathIgnorePatterns: ["/node_modules/", "/dist/", "/.git/"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  rootDir: __dirname,
  transformIgnorePatterns: [],
  globals: {
    __DEV__: true,
    __JEST__: true,
    __VERSION__: require("./package.json").version,
    // "import.meta.url": __filename,
  },
};

module.exports = config;
