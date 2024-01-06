import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import collieWebpackLoader from "@colliejs/webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { defaultConfig } from "@colliejs/config";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    extensions: [".tsx", ".ts", ".mjs", ".jsx", ".js"],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(".", "index.htm"),
    }),
    new MiniCssExtractPlugin({ filename: "collie.css" }),

    // new CollieWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
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
            loader: "@colliejs/webpack",
            options: {
              styledConfig: {
                ...defaultConfig,
                theme: { colors: { primary: "red" } },
              },
              entry: "./src/index.tsx",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
