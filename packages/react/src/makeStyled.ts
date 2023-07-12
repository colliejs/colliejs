import { styled } from "./styled";
import { Config, defaultConfig } from "@colliejs/core";
import { MakeStyled } from "./types";

export const makeStyled = <T extends typeof defaultConfig>(config: T) => {
  return styled as unknown as MakeStyled<T>;
};
