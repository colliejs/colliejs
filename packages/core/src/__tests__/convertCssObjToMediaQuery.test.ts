import { convertCssObjToMediaQuery } from "../arraySyntax";
import { defaultConfig } from "../config";
import { CSSPropertiesComplex } from "../type";

describe("convertCssObjToMediaQuery", () => {
  it("should work ", () => {
    const cssObj: any = {
      width: [10, 20],
      height: [20, 40],
      color: "white",
    };
    const res = convertCssObjToMediaQuery(cssObj, [320, 768]);
    expect(res).toMatchInlineSnapshot(`
      {
        "@media (min-width:320px)": {
          "height": 20,
          "width": 10,
        },
        "@media (min-width:768px)": {
          "height": 40,
          "width": 20,
        },
        "color": "white",
      }
    `);
  });
  it("should work ", () => {
    const cssObj = {
      width: [10, 20],
      "& > span": {
        width: [10, 20],
        "@media (support:xxx)": { width: [10, 20] },
      },
    } as unknown as CSSPropertiesComplex;
    const res = convertCssObjToMediaQuery(cssObj, [320, 768]);
    expect(res).toMatchInlineSnapshot(`
      {
        "& > span": {
          "@media (min-width:320px)": {
            "width": 10,
          },
          "@media (min-width:768px)": {
            "width": 20,
          },
          "@media (support:xxx)": {
            "@media (min-width:320px)": {
              "width": 10,
            },
            "@media (min-width:768px)": {
              "width": 20,
            },
          },
        },
        "@media (min-width:320px)": {
          "width": 10,
        },
        "@media (min-width:768px)": {
          "width": 20,
        },
      }
    `);
  });
});
