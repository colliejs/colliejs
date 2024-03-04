import { ComponentId } from "../../component/componentId";

describe("test cases", () => {
  it("should work ", () => {
    const componentId = new ComponentId("Button.tsx", "Button");
    expect(componentId.uniqName).toMatchInlineSnapshot(
      `"ButtonTsx-Button-d0u57m"`
    );
  });
});
