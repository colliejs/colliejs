import { buildObjectExpression } from "../buildObjectExpression";

const generate = require("@babel/generator").default;

describe("build object expression", () => {
  it("object ", () => {
    const obj = {
      color: "red",
      size: {
        width: 1,
        background: "blue",
        embed: {
          color: "green",
        },
      },
    };
    const res = buildObjectExpression(obj);
    const code = generate(res).code;
    expect(code).toMatchInlineSnapshot(`
      "{
        "color": "red",
        "size": {
          "width": 1,
          "background": "blue",
          "embed": {
            "color": "green"
          }
        }
      }"
    `);
  });
  it("array ", () => {
    const obj = [
      {
        color: "red",
      },
      { color: "blue" },
      { number: 2 },
    ];
    const res = buildObjectExpression(obj);
    const code = generate(res).code;
    expect(code).toMatchInlineSnapshot(`
      "[{
        "color": "red"
      }, {
        "color": "blue"
      }, {
        "number": 2
      }]"
    `);
  });
});
