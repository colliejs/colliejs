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
            loader: path.resolve(
              __dirname,
              "./node_modules/@colliejs/webpack/dist/loader.mjs"
            ),
            options: {
              styledConfig: defaultConfig,
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
