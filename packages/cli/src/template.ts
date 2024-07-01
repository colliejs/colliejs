export const contentOfStyledFile = `
  import { makeStyled } from "@colliejs/react";
  import { CSSObject, css as _css } from "@colliejs/core";
  import config from "../collie.config";

  const cssConfig = config["css"];
  type CSSConfig = typeof cssConfig;
  export const styled = makeStyled(cssConfig);
  export const css = (cssObj: CSSObject<CSSConfig>) => _css<CSSConfig>(cssObj);
`;

export const contentOfCollieConfigFile = `
  import { defaultConfig, type CollieConfig } from "@colliejs/config";
  export default {
    build: {
      entry: "src/index.tsx",
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
