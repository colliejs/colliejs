// @ts-nocheck

import * as babel from "@babel/core";
import { writeFileSync } from "fs";
export const transformTs = (file: string) => {
  const { code } = babel.transformFileSync(file, {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  });
  return code;
};
