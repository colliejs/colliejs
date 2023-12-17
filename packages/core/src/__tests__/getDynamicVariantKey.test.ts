import { getDynamicVariantKey } from "../../../transform/src/variants";

describe("toHash", () => {
//   it("dynamic", () => {
//     const x = getDynamicVariantKey("shape", "dynamic");
//     expect(x).toBe("variants-dynamic-shape");
//   });
//   it("dynamic_at ", () => {
//     const x = getDynamicVariantKey("shape", "dynamic_at");
//     expect(x).toBe("variants-dynamic-shape-at");
//   });

  
  it("dynamic_width ", () => {
    const x = getDynamicVariantKey("shape", "dynamic_width");
    expect(x).toBe("variants-dynamic-shape-width");
  });
  
  it("dynamic_width_at ", () => {
    const x = getDynamicVariantKey("shape", "dynamic_width_at");
    expect(x).toBe("variants-dynamic-shape-width-at");
  });
 
});
