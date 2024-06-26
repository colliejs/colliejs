
export const contentOfStyledFile = `
  import { makeStyled } from "@colliejs/react";
  import { CSSObject, css as _css } from "@colliejs/core";
  import config from "../collie.config";
  export type MyConfig = typeof config;
  export const styled = makeStyled(config.css);
  export const css = (cssObj: CSSObject<MyConfig["css"]>) =>
    _css<MyConfig["css"]>(cssObj);
`;
