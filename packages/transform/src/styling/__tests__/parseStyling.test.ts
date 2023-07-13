import { Background } from "./../../../../react/src/types/css.d";
import { defaultConfig, CSSPropertiesComplex } from "@colliejs/core";
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
          "cssGenText": ".baseStyle-lcviVg{background:red;line-height:1}",
          "cssRawObj": {
            "background": "red",
            "lineHeight": 1,
          },
        },
        "variants-static-size-medium": {
          "className": "variants-static-size-medium-cZffyS",
          "cssGenText": ".variants-static-size-medium-cZffyS{width:200px}",
          "cssRawObj": {
            "w": 200,
          },
        },
        "variants-static-size-small": {
          "className": "variants-static-size-small-qoyAQ",
          "cssGenText": ".variants-static-size-small-qoyAQ{width:100px}
      .variants-static-size-small-qoyAQ span{width:50px}",
          "cssRawObj": {
            "span": {
              "w": 50,
            },
            "width": "100px",
          },
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
          "cssGenText": "",
          "cssRawObj": {},
        },
        "variants-dynamic-gap": {
          "className": "variants-dynamic-gap-icbYTO",
          "cssGenText": ".variants-dynamic-gap-icbYTO{gap:var(--variants-dynamic-gap)}",
          "cssRawObj": {
            "gap": "var(--variants-dynamic-gap)",
          },
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
          "cssGenText": "",
          "cssRawObj": {},
        },
        "variants-dynamic-gap": {
          "className": "variants-dynamic-gap-icbYTO",
          "cssGenText": ".variants-dynamic-gap-icbYTO{gap:var(--variants-dynamic-gap)}",
          "cssRawObj": {
            "gap": "var(--variants-dynamic-gap)",
          },
        },
      }
    `);
  });
  it("compound variants", () => {
    const styleObj: Styling = {
      variants: {
        size: {
          small: { width: "100px" },
        },
        type: {
          primary: {
            color: "red",
          },
        },
      },
      compoundVariants: [
        {
          size: "small",
          type: "primary",
          css: {
            background: "red",
          },
        },
      ],
    };
    const res = parseStyling(styleObj, defaultConfig);
    res;
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-PJLV",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "compoundVariants-size-small-type-primary-elTJue": {
          "className": "compoundVariants-size-small-type-primary-elTJue",
          "cssGenText": ".compoundVariants-size-small-type-primary-elTJue{background:red}",
          "cssRawObj": {
            "background": "red",
          },
        },
        "variants-static-size-small": {
          "className": "variants-static-size-small-iMBqpA",
          "cssGenText": ".variants-static-size-small-iMBqpA{width:100px}",
          "cssRawObj": {
            "width": "100px",
          },
        },
        "variants-static-type-primary": {
          "className": "variants-static-type-primary-gmqXFB",
          "cssGenText": ".variants-static-type-primary-gmqXFB{color:red}",
          "cssRawObj": {
            "color": "red",
          },
        },
      }
    `);
  });
});
