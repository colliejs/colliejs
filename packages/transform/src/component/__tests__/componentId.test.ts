import { ComponentId } from "../componentId";
import { describe, it, expect } from "vitest";
describe("test cases", () => {
  it("should work ", () => {
    const componentId = new ComponentId("/User/colliejs.org/a.tsx", "Button");
    expect(componentId.uniqName).toMatchInlineSnapshot(`"aTsx-Button-p1tgg6"`);
  });
});
