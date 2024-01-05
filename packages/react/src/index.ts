import { makeStyled } from "./types";
import { defaultConfig } from "@colliejs/config";

export { makeStyled } from "./makeStyled";
export type * from "./types";
export const styled = makeStyled(defaultConfig);
