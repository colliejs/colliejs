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
});
