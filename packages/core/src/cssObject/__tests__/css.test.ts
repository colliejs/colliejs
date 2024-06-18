import { BaseConfig } from "../../type";
import { getCssText } from "../css";
import {  CSSObject } from "../type";
import { config } from "./stub/config";
import { describe, it ,expect} from "vitest";

describe("test cases", () => {
  it("should work ", () => {
    const cssRawObj = {
      width: [10, 20],
      h: [20, "var(--xs-height)"],
    } as unknown as CSSObject<BaseConfig>;
    const res = getCssText(cssRawObj, [".button"], undefined, config);
    expect(res).toMatchInlineSnapshot(`
      "@media (min-width:320px){.button{width:10px;height:20px}}
      @media (min-width:768px){.button{width:20px;height:var(--xs-height)}}"
    `);
  });
  it("should work ", () => {
    const cssRawObj = {
      width: [10, 20],
      "& > span": {
        width: [10, 20],
        "@media (support:xxx)": { width: [10, 20] },
      },
    } as unknown as CSSObject<BaseConfig>;
    const res = getCssText(cssRawObj, [".button"], [], config);
    expect(res).toMatchInlineSnapshot(`
      "@media (min-width:320px){.button{width:10px}}
      @media (min-width:768px){.button{width:20px}}
      @media (min-width:320px){.button > span{width:10px}}
      @media (min-width:768px){.button > span{width:20px}}
      @media (support:xxx){@media (min-width:320px){.button > span{width:10px}}}
      @media (support:xxx){@media (min-width:768px){.button > span{width:20px}}}"
    `);
  });
  it("support variable", () => {
    const cssRawObj = {
      color: "$primary",
      w: 100,
    } as unknown as CSSObject<BaseConfig>;
    const res = getCssText(cssRawObj, [".button"], [], config);
    expect(res).toMatchInlineSnapshot(
      `".button{color:var(--co-colors-primary);width:100px}"`
    );
  });
});
