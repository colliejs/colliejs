import { BaseConfig, CSSObject, } from "../type";
import { convertCssObjToMediaQuery } from "../convert";

describe("convertCssObjToMediaQuery", () => {
  it("work for array syntax ", () => {
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
    } as unknown as CSSObject<BaseConfig>;
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
  it.skip("should work for object syntax[deprecated]", () => {
    const cssObj: any = {
      width: { "@phone": 10, "@pad": 20 },
      height: { "@phone": 20, "@pad": 40 },
      p: [10, 20],
      color: "white",
    };
    const res = convertCssObjToMediaQuery(cssObj, [320, 768]);
    expect(res).toMatchInlineSnapshot(`
      {
        "@media (min-width:320px)": {
          "p": 10,
        },
        "@media (min-width:768px)": {
          "p": 20,
        },
        "@pad": {
          "height": 40,
          "width": 20,
        },
        "@phone": {
          "height": 20,
          "width": 10,
        },
        "color": "white",
      }
    `);
  });
});
