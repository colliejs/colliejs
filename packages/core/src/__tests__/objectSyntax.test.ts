import { objectSyntax } from "../objectSyntax";
describe("objectSyntax", () => {
  it("arraySyntax", () => {
    const x = objectSyntax("width", { "@phone": 10, "@pad": 20 });
    expect(x).toMatchInlineSnapshot(`
      {
        "@pad": {
          "width": 20,
        },
        "@phone": {
          "width": 10,
        },
      }
    `);
  });
  it("arraySyntax", () => {
    const x = {
      w: { "@phone": 10, "@pad": 20 },
      h: { "@phone": 20, "@pad": 30 },
    };
    const x = objectSyntax("width", { "@phone": 10, "@pad": 20 });
    expect(x).toMatchInlineSnapshot(`
      {
        "@pad": {
          "width": 20,
        },
        "@phone": {
          "width": 10,
        },
      }
    `);
  });
});
