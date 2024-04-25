import { toTokenizedValue } from "../toTokenizedValue";

describe("toHash", () => {
  it("should work ", () => {
    expect(toTokenizedValue("white005", "prefix", "color")).toBe("white005");
  });
  it("variable $", () => {
    expect(toTokenizedValue("$white005", "prefix", "color")).toBe("var(--prefix-color-white005)");
  });
});
