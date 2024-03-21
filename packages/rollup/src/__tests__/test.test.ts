import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import { rollup, type RollupOptions } from "rollup";
import collie from "../index";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

const input = path.join(__dirname, "./fixtures/index.tsx");
const outputFile = path.join(__dirname, "../dist/bundle.js");
const babelConfigFile = path.join(__dirname, "../../../../babel.config.cjs");
const config: RollupOptions = {
  input: input,
  plugins: [
    resolve({ extensions }),
    commonjs(),
    collie(),
    babel({ babelHelpers: "bundled", extensions, configFile: babelConfigFile }),
  ],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-dom/client",
    /@colliejs/,
  ],
  output: [
    {
      file: outputFile,
      format: "es",
    },
  ],
};

describe("test cas2es", () => {
  it("should work ", async () => {
    const res = await rollup(config);
    //@ts-ignore
    const { output } = await res.generate(config.output[0]);
    const code = output[0].code;
    expect(code).toMatchInlineSnapshot(`
      "import 'react';
      import { styled } from '@colliejs/react';
      import { jsx } from 'react/jsx-runtime';
      import { createRoot } from 'react-dom/client';

      const BaseButton = styled('button', "baseStyle-1sjqm9w", [], {}, [], []);

      const Button = styled(BaseButton, "baseStyle-129ntb2", ["variants-shape-square-4trf62", "variants-shape-round-q6q02o"], {}, [], []);

      function App() {
        return /*#__PURE__*/jsx(Button, {
          shape: "round",
          className: "css-16n2od3",
          children: "My button"
        });
      }

      const container = document.getElementById('app');
      const root = createRoot(container);
      root.render( /*#__PURE__*/jsx(App, {}));
      "
    `);
  });
});
