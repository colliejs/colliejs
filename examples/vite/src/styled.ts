
import { makeStyled } from "@colliejs/react";
import { css as _css } from "@colliejs/core";
import config from "../collie.config";

const cssConfig = config["css"];

export const styled = makeStyled(cssConfig);
export const css = _css<typeof cssConfig>;
