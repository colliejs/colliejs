import { makeStyled } from "@colliejs/react";
import { CSSObject, css as _css } from "@colliejs/core";
import config from "../collie.config";
export type MyConfig = typeof config;
export const styled = makeStyled(config);
export const css = (cssObj: CSSObject<MyConfig>) => _css<MyConfig>(cssObj);
