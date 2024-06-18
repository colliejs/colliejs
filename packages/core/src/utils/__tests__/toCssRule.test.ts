import { toCssRules } from "../toCssRules";
import { config as defaultConfig } from "../../cssObject/__tests__/stub/config";
import { describe, it, expect } from "vitest";

describe("test cases", () => {
  it(" property with util ", () => {
    const cssObj = { w: 10 };
    toCssRules(cssObj, [".ab"], [], defaultConfig, x => {
      expect(x).toMatchInlineSnapshot(`".ab{width:10px}"`);
    });
  });
  it(" property with polyfill ", () => {
    const cssObj = { appearance: 10 };
    toCssRules(cssObj, [".ab"], [], defaultConfig, x => {
      expect(x).toMatchInlineSnapshot(
        `".ab{-webkit-appearance:10;appearance:10}"`
      );
    });
  });
  it("isRuleLike", () => {
    const isValueRuleLike = (
      key: string,
      value: any,
      config: any,
      selectors: string[]
    ) =>
      typeof value === "object" &&
      value &&
      value.toString === Object.prototype.toString &&
      (!config.utils[key] || !selectors.length);
    //属性不是util名，满足条件之一
    expect(isValueRuleLike("width", { height: 10 }, defaultConfig, [])).toBe(
      true
    );
    expect(isValueRuleLike("_after", { height: 10 }, defaultConfig, [])).toBe(
      true
    );
    expect(isValueRuleLike("width", { height: 10 }, defaultConfig, ["e"])).toBe(
      true
    );
    expect(isValueRuleLike("width", 100, defaultConfig, ["e"])).not.toBe(true);

    //如果属性是util名，则不能指定selector
    expect(isValueRuleLike("_after", { width: 10 }, defaultConfig, [])).toBe(
      true
    );
    expect(
      isValueRuleLike("_after", { width: 10 }, defaultConfig, ["selector"])
    ).not.toBe(true);
  });

  it("selector rule ", () => {
    const cssObj = {
      "& > span": {
        "@media (max-width:968px)": { w: 10 }, //@media自动提到外面
        _after: { color: "red" },
      },
    };
    let text = "";
    let callCount = 0;
    const res = toCssRules(cssObj, [".button"], [], defaultConfig, x => {
      text += x + "\n";
      callCount++;
    });
    // expect(callCount).toBe(3);
    expect(text).toMatchInlineSnapshot(`
      "@media (max-width:968px){.button > span{width:10px}}
      .button > span::after{content:"";position:absolute;color:red}
      .button > span{position:relative}
      "
    `);
  });
  it("selector nested ", () => {
    const cssObj = {
      w: 10,
      "& > div": {
        color: "red",
        "&:hover": { color: "orange" }, // &指向嵌套的上一个选择器
        ":hover": { color: "yellow" }, // &指向嵌套的上一个选择器
      },
    };
    let text = "";
    let callCount = 0;
    const res = toCssRules(cssObj, [".button"], [], defaultConfig, x => {
      text += x + "\n";
      callCount++;
    });
    expect(callCount).toBe(4);
    expect(text).toMatchInlineSnapshot(`
      ".button{width:10px}
      .button > div{color:red}
      .button > div:hover{color:orange}
      .button > div :hover{color:yellow}
      "
    `);
  });
  it("condition rule ", () => {
    const cssObj = {
      "@supports (display:flex)": {
        w: 10,
        "@media (max-width:100px)": {
          "& > div": {
            color: "red",
            "@media (min-width:200px)": {
              color: "white",
              "& > span": {
                color: "green",
              },
            },
          },
        },
      },
    };
    let text = "";
    let callCount = 0;
    const res = toCssRules(cssObj, [".button"], [], defaultConfig, x => {
      text += x + "\n";
      callCount++;
    });
    expect(callCount).toBe(4);
    expect(text).toMatchInlineSnapshot(`
      "@supports (display:flex){.button{width:10px}}
      @supports (display:flex){@media (max-width:100px){.button > div{color:red}}}
      @supports (display:flex){@media (max-width:100px){@media (min-width:200px){.button > div{color:white}}}}
      @supports (display:flex){@media (max-width:100px){@media (min-width:200px){.button > div > span{color:green}}}}
      "
    `);
  });
  it("TODO:should throw error for this syntax", () => {
    const cssObj = {
      width: {
        "@media (max-width:968px)": 10,
        "@media (min-width:969px)": 20,
      },
    } as any;
    let text = "";
    let callCount = 0;
    const res = toCssRules(cssObj, [".button"], [], defaultConfig, x => {
      text += x + "\n";
      callCount++;
    });
    expect(text).toMatchInlineSnapshot(`
      ".button width{@media (max-width:968px) 10;@media (min-width:969px) 20}
      "
    `);
  });
  it("rule Like value ", () => {});
});
