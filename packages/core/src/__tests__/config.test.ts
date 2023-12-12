import { CSSObject, defaultConfig } from "../";
import { css } from "../css";

describe("toHash", () => {
  it("should work ", () => {
    const cssObj = {
      lineHeight: 1,
    } as unknown as CSSObject<any>;
    const res = css(cssObj, [".button"], undefined, defaultConfig);
    expect(res).toMatchInlineSnapshot(`".button{line-height:1}"`);
  });
});
