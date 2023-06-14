import { defaultConfig, CSSPropertiesComplex } from "@border-collie-js/core";
import { parseStyling, Styling } from "../styling";

describe("parseStyleObj", () => {
  it("plain object ", () => {
    const styleObj: Styling = {
      background: "red",
      lineHeight: 1,
      variants: {
        size: {
          small: { width: "100px", span: { w: 50 } } as CSSPropertiesComplex,
          medium: { w: 200 },
        },
      },
    };
    const res = parseStyling(styleObj, defaultConfig);
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-lcviVg",
          "cssObj": {
            "background": "red",
            "lineHeight": 1,
          },
          "cssText": ".baseStyle-lcviVg{background:red;line-height:1}",
        },
        "variants-static-size-medium": {
          "className": "variants-static-size-medium-cZffyS",
          "cssObj": {
            "w": 200,
          },
          "cssText": ".variants-static-size-medium-cZffyS{width:200px}",
        },
        "variants-static-size-small": {
          "className": "variants-static-size-small-qoyAQ",
          "cssObj": {
            "span": {
              "w": 50,
            },
            "width": "100px",
          },
          "cssText": ".variants-static-size-small-qoyAQ{width:100px}
      .variants-static-size-small-qoyAQ span{width:50px}",
        },
      }
    `);
  });
  it("with function", () => {
    const styleObj: Styling = {
      variants: {
        gap: {
          dynamic: x => ({ gap: x }),
        },
      },
    };
    const res = parseStyling(styleObj, defaultConfig, "prefix");
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-prefix-PJLV",
          "cssObj": {},
          "cssText": "",
        },
        "variants-dynamic-gap": {
          "className": "variants-dynamic-gap-icbYTO",
          "cssObj": {
            "gap": "var(--variants-dynamic-gap)",
          },
          "cssText": ".variants-dynamic-gap-icbYTO{gap:var(--variants-dynamic-gap)}",
        },
      }
    `);
  });
  it("with spreed function", () => {
    const f = x => ({ gap: x });
    const styleObj: Styling = {
      variants: {
        gap: {
          dynamic: x => ({ ...f(x) }),
        },
      },
    };
    const res = parseStyling(styleObj, defaultConfig);
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-PJLV",
          "cssObj": {},
          "cssText": "",
        },
        "variants-dynamic-gap": {
          "className": "variants-dynamic-gap-icbYTO",
          "cssObj": {
            "gap": "var(--variants-dynamic-gap)",
          },
          "cssText": ".variants-dynamic-gap-icbYTO{gap:var(--variants-dynamic-gap)}",
        },
      }
    `);
  });
});
