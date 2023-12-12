import { makeStyled } from "./makeStyled";
import { defaultConfig } from "./defaultConfig";
export { makeStyled };

export const styled = makeStyled(defaultConfig);
export { defaultConfig };
export type * from "./types";
