import { defaultConfig } from "../config";
import { css } from "../css";
import { CSSPropertiesComplex } from "../type";

describe("toHash", () => {
  it("should work ", () => {
    const cssObj = {
      typo: {
        lineHeight: 1,
      },
    } as unknown as CSSPropertiesComplex;
    const res = css(cssObj, [".button"], undefined, defaultConfig);
    expect(res).toMatchInlineSnapshot(`".button{line-height:1}"`);
  });
});
