import { config } from "../../cssObject/__tests__/stub/config";
import { extractFromStyledObject } from "../extract";
import { StyledObject } from "../types";
import { describe, it ,expect} from "vitest";
describe("parseStyleObj", () => {
  it("plain object ", () => {
    const styleObj: any = {
      background: "red",
      lineHeight: 1,
      variants: {
        size: {
          small: { width: "100px", span: { w: 50 } },
          medium: { w: 200 },
        },
        type: {
          title: {
            mixins: ["size.small"],
            background: "green",
          },
        },
        big:{
          true:{
            width: 200
          }
        }
      },
    };
    const res = extractFromStyledObject(styleObj, config);
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-1v6vumz",
          "cssGenText": ".baseStyle-1v6vumz{background:red;line-height:1}",
          "cssRawObj": {
            "background": "red",
            "lineHeight": 1,
          },
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-big-true": {
          "className": "variants-big-true-1gvmlhe",
          "cssGenText": ".variants-big-true-1gvmlhe{width:200px}",
          "cssRawObj": {
            "width": 200,
          },
        },
        "variants-size-medium": {
          "className": "variants-size-medium-1pcm56b",
          "cssGenText": ".variants-size-medium-1pcm56b{width:200px}",
          "cssRawObj": {
            "w": 200,
          },
        },
        "variants-size-small": {
          "className": "variants-size-small-4b43qv",
          "cssGenText": ".variants-size-small-4b43qv{width:100px}
      .variants-size-small-4b43qv span{width:50px}",
          "cssRawObj": {
            "span": {
              "w": 50,
            },
            "width": "100px",
          },
        },
        "variants-type-title": {
          "className": "variants-type-title-gwbdgl",
          "cssGenText": ".variants-type-title-gwbdgl{background:green}",
          "cssRawObj": {
            "background": "green",
            "mixins": [
              "size.small",
            ],
          },
        },
      }
    `);
  });
  it("dynamic function with breakpoints", () => {
    const styleObj: any = {
      variants: {
        gap: {
          dynamic: x => ({ gap: x }),
        },
      },
    };
    const res = extractFromStyledObject(styleObj, config, "prefix");
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-gap-dynamic": {
          "canAddPx": true,
          "className": "variants-gap-dynamic-1dnk4w",
          "cssGenText": "@media (min-width:320px){.variants-gap-dynamic-1dnk4w{gap:var(--variants-gap-at320)}}
      @media (min-width:768px){.variants-gap-dynamic-1dnk4w{gap:var(--variants-gap-at768)}}",
          "cssRawObj": {
            "gap": [
              "var(--variants-gap-at320)",
              "var(--variants-gap-at768)",
            ],
          },
        },
      }
    `);
  });

  it("with spreed function", () => {
    const f = x => ({ gap: x });
    const styleObj = {
      variants: {
        gap: {
          dynamic: x => ({ ...f(x) }),
        },
      },
    };
    const res = extractFromStyledObject(styleObj, config);
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-gap-dynamic": {
          "canAddPx": true,
          "className": "variants-gap-dynamic-1dnk4w",
          "cssGenText": "@media (min-width:320px){.variants-gap-dynamic-1dnk4w{gap:var(--variants-gap-at320)}}
      @media (min-width:768px){.variants-gap-dynamic-1dnk4w{gap:var(--variants-gap-at768)}}",
          "cssRawObj": {
            "gap": [
              "var(--variants-gap-at320)",
              "var(--variants-gap-at768)",
            ],
          },
        },
      }
    `);
  });
  it("compound variants", () => {
    const styleObj: StyledObject<any> = {
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
    const res = extractFromStyledObject(styleObj, config);
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-size-small": {
          "className": "variants-size-small-13jn9t5",
          "cssGenText": ".variants-size-small-13jn9t5{width:100px}",
          "cssRawObj": {
            "width": "100px",
          },
        },
        "variants-type-primary": {
          "className": "variants-type-primary-129ntb2",
          "cssGenText": ".variants-type-primary-129ntb2{color:red}",
          "cssRawObj": {
            "color": "red",
          },
        },
      }
    `);
  });
  it("dynamic function with css propery name(with breakpoint)", () => {
    const styleObj: any = {
      variants: {
        size1: {
          dynamic_width: x => ({ width: x }),
        },
        size: {
          dynamic_width_at: x => ({ width: x }),
        },
      },
    };
    const res = extractFromStyledObject(styleObj, config, "prefix");
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-size-dynamicWidthAt": {
          "canAddPx": true,
          "className": "variants-size-dynamic-ximlsg",
          "cssGenText": "@media (min-width:320px){.variants-size-dynamic-ximlsg{width:var(--variants-size-at320)}}
      @media (min-width:768px){.variants-size-dynamic-ximlsg{width:var(--variants-size-at768)}}",
          "cssRawObj": {
            "width": [
              "var(--variants-size-at320)",
              "var(--variants-size-at768)",
            ],
          },
        },
        "variants-size1-dynamicWidth": {
          "canAddPx": true,
          "className": "variants-size1-dynamic-1iv7rh0",
          "cssGenText": "@media (min-width:320px){.variants-size1-dynamic-1iv7rh0{width:var(--variants-size1-at320)}}
      @media (min-width:768px){.variants-size1-dynamic-1iv7rh0{width:var(--variants-size1-at768)}}",
          "cssRawObj": {
            "width": [
              "var(--variants-size1-at320)",
              "var(--variants-size1-at768)",
            ],
          },
        },
      }
    `);
  });
  it("dynamic function with css propery name(with breakpoint)", () => {
    const styleObj: any = {
      variants: {
        size: {
          dynamic_at: x => ({ width: x }),
        },
      },
    };
    const res = extractFromStyledObject(styleObj, config, "prefix");
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-size-dynamicAt": {
          "canAddPx": true,
          "className": "variants-size-dynamic-ximlsg",
          "cssGenText": "@media (min-width:320px){.variants-size-dynamic-ximlsg{width:var(--variants-size-at320)}}
      @media (min-width:768px){.variants-size-dynamic-ximlsg{width:var(--variants-size-at768)}}",
          "cssRawObj": {
            "width": [
              "var(--variants-size-at320)",
              "var(--variants-size-at768)",
            ],
          },
        },
      }
    `);
  });

  it("default variants", () => {
    const styleObj: any = {
      variants: {
        size: {
          small: { width: "100px" },
        },
        shape: {
          circle: { borderRadius: "50%" },
        },
      },
      defaultVariants: {
        size: "small",
        shape: "circle",
      },
    };
    const res = extractFromStyledObject(styleObj, config, "prefix");
    expect(res).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-shape-circle": {
          "className": "variants-shape-circle-jhqrc0",
          "cssGenText": ".variants-shape-circle-jhqrc0{border-radius:50%}",
          "cssRawObj": {
            "borderRadius": "50%",
          },
        },
        "variants-size-small": {
          "className": "variants-size-small-13jn9t5",
          "cssGenText": ".variants-size-small-13jn9t5{width:100px}",
          "cssRawObj": {
            "width": "100px",
          },
        },
      }
    `);
  });
});
