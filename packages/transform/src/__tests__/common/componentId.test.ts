import { ComponentId } from "../../component";

describe("test cases", () => {
  it("should work ", () => {
    const componentId = new ComponentId("Button.tsx", "Button");
    expect(componentId.displayName).toMatchInlineSnapshot(
      `"Button_tsx-Button-cmhSRm"`
    );
  });
});
