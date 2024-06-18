import { getCssText } from "../css";
import type { CSSObject } from "../type";
import { describe, it ,expect} from "vitest";

describe("toHash", () => {
  it("should work ", () => {
    const cssObj = {
      lineHeight: 1,
    } as unknown as CSSObject<any>;
    const res = getCssText(cssObj, [".button"], undefined, {});
    expect(res).toMatchInlineSnapshot(`".button{line-height:1}"`);
  });
});
