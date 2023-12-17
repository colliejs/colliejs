import type { CSSProperties, Prefixed } from "./types";
import { CSS } from "./types";
export type { Prefixed } from "./types";
//===========================================================
// BaseConfig Type,not the Actual Type
//===========================================================
export type BaseConfig = {
  prefix?: string;
  media?: {
    [name: string]: string;
  };
  theme?: object;
  themeMap?: object;
  utils?: {
    [key: string]: (value: any) => CSSProperties | any; //CSSObject<Config>
  };
  layername?: string;
};

//===========================================================
// used by function css()
//===========================================================
type Media<Config extends BaseConfig> = Prefixed<"@", keyof Config["media"]>;
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]:
    | CSS<Config>[K]
    | Record<Media<Config>, CSS<Config>[K]>;
};

declare const css: <Config extends BaseConfig>(
  cssObj: CSSObject<Config>,
  selector: string[],
  pseudoSelector: string[],
  config: Config
) => string;

declare const createTheme: <Config extends BaseConfig>(config: Config) => void;

declare const defaultConfig: BaseConfig;
