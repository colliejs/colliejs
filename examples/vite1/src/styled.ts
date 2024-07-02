import { makeStyled } from "@colliejs/react";
import { CSSObject, css as _css } from "@colliejs/core";
import config from "../collie.config";

const cssConfig = config["css"];
type CSSConfig = typeof cssConfig;
export const styled = makeStyled(cssConfig);
export const css = (cssObj: CSSObject<CSSConfig>) => _css<CSSConfig>(cssObj);
