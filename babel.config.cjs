const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current",
        chrome: "90",
      },
    },
  ],
  "@babel/preset-typescript",
  [
    "@babel/preset-react",
    {
      runtime: "automatic",
    },
  ],
];

module.exports = {
  presets: presets,
  plugins: [],
};
