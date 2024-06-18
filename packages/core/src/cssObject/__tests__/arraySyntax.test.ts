import { arraySyntax } from "../arraySyntax";
import { describe, it ,expect} from "vitest";

describe("arraySyntax", () => {
  it("arraySyntax", () => {
    const x = arraySyntax("width", [10, 20, 30], [320, 768]);
    expect(x).toMatchInlineSnapshot(`
      {
        "@media (min-width:320px)": {
          "width": 10,
        },
        "@media (min-width:768px)": {
          "width": 20,
        },
      }
    `);
  });
  it("when not match", () => {
    const x = arraySyntax("width", [10], [768, 1366]);
    expect(x).toMatchInlineSnapshot(`
      {
        "@media (min-width:768px)": {
          "width": 10,
        },
      }
    `);
  });
  it("when not match", () => {
    const x = arraySyntax("width", [, 10], [768, 1366]);
    expect(x).toMatchInlineSnapshot(`
      {
        "@media (min-width:1366px)": {
          "width": 10,
        },
      }
    `);
  });
});
