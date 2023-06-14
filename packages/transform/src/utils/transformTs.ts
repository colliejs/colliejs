import * as babel from "@babel/core";
import { writeFileSync } from "fs";
export const transformTs =  (file: string) => {
  const x = babel.transformFileSync(file, {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  });
  const resFile = file + ".cjs";
  writeFileSync(resFile, x.code, { encoding: "utf-8" });
  return resFile;
};
