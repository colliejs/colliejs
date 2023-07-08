import { ComponentId } from "../../component/componentId";

describe("test cases", () => {
  it("should work ", () => {
    const componentId = new ComponentId("Button.tsx", "Button");
    expect(componentId.uniqName).toMatchInlineSnapshot(
      `"Button_tsx-Button-cmhSRm"`
    );
  });
});
