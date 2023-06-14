import { ComponentId } from "../componentId";

describe("test cases", () => {
  it("should work ", () => {
    expect(0).toBe(0);
    const componentId = new ComponentId("/User/colliejs.org/a.tsx", "Button");
    expect(componentId.displayName).toMatchInlineSnapshot(
      `"a_tsx-Button-boOUzt"`
    );
  });
});
