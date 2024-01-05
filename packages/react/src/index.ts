import { defaultConfig } from "@colliejs/config";
import { makeStyled } from "./makeStyled";
export type * from "./types";
export const styled = makeStyled(defaultConfig);
export { makeStyled };
