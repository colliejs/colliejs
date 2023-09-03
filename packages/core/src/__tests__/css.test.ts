import { CSSPropertiesComplex } from "../type";
import { arraySyntax } from "./../css";
import { css } from "../css";
import { defaultConfig } from "../config";

describe("test cases", () => {
  it("should work ", () => {
    const cssRawObj = {
      width: [10, 20],
      h: [20, 50],
    } as unknown as CSSPropertiesComplex;
    const res = css(cssRawObj, [".button"], undefined, defaultConfig);
    expect(res).toMatchInlineSnapshot(`
      "@media (max-width:767.9999px){.button{width:10px;height:20px}}
      @media (min-width:768px){.button{width:20px;height:50px}}"
    `);
  });
  it.skip("should work ", () => {
    const cssRawObj = {
      width: [10, 20],
      "& > span": {
        width: [10, 20],
        "@media (support:xxx)": { width: [10, 20] },
      },
    } as unknown as CSSPropertiesComplex;
    const res = css(cssRawObj, [".button"], [], defaultConfig);
    expect(res).toMatchInlineSnapshot(`
      "@media (max-width:767.9999px){.button{width:10px}}
      @media (min-width:768px){.button{width:20px}}
      @media (max-width:767.9999px){.button > span{width:10px}}
      @media (min-width:768px){.button > span{width:20px}}
      @media (support:xxx){@media (max-width:767.9999px){.button > span{width:10px}}}
      @media (support:xxx){@media (min-width:768px){.button > span{width:20px}}}"
    `);
  });
  it.skip("support variable", () => {
    const cssRawObj = {
      color: "$primary",
      w: 100,
    } as unknown as CSSPropertiesComplex;
    const res = css(cssRawObj, [".button"], [], defaultConfig);
    expect(res).toMatchInlineSnapshot(
      `".button{color:var(--co-colors-primary);width:100px}"`
    );
  });
});
