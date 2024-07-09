export const contentOfStyledFile = `
import { makeStyled } from "@colliejs/react";
import { css as _css } from "@colliejs/core";
import config from "../collie.config";

const cssConfig = config["css"];

export const styled = makeStyled(cssConfig);
export const css = _css<typeof cssConfig>;
`;

export const contentOfCollieConfigFile = (entryFile: string) => `
  import { defaultConfig, type CollieConfig } from "@colliejs/config";
  export default {
    build: {
      entry: "${entryFile}",
      alias: { "@/": "src/" },
      include: ["src/**/*.tsx", "src/**/*.ts"],
      exclude: ["**/node_modules"],
    },
    css: {
      ...defaultConfig,
      breakpoints: [320, 768],
      theme: {
        colors: {
          white01: "rgba(255,255,255,0.1)",
          white09: "rgba(255,255,255,0.9)",
          black09: "rgba(0,0,0,0.9)",
          
        },
      },
    },
  } as const satisfies CollieConfig;
`;
