import { makeStyled } from "@colliejs/react";
import { CSSObject, css as _css } from "@colliejs/core";
import config from "../collie.config";
export type CustomConfig = typeof config;
export const styled = makeStyled(config.css);
export const css = (cssObj: CSSObject<CustomConfig["css"]>) =>
  _css<CustomConfig["css"]>(cssObj);
