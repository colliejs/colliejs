import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import collieWebpackLoader from "@colliejs/webpack/loader";
import CollieWebpackPlugin from "@colliejs/webpack/plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * @type {import("webpack").Configuration}
 */
export default {
  entry: "./src/index.tsx",
  mode: "production",
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".mjs", ".jsx",'.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(".", "index.htm"),
    }),
    new CollieWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.[tj]sx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      // esmodules: true,
                    },
                  },
                ],
                "@babel/preset-typescript",
              ],
            },
          },
          {
            loader: path.resolve(
              __dirname,
              "./node_modules/@colliejs/webpack/dist/loader.js"
            ),
            options: {},
          },
        ],
      },
    ],
  },

};
