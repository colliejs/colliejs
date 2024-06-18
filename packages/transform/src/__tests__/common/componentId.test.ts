import { ComponentId } from "../../component/componentId";
import { describe, it, expect } from "vitest";

describe("test cases", () => {
  it("componentId should work ", () => {
    const componentId = new ComponentId("Button.tsx", "Button");
    expect(componentId.uniqName).toMatchInlineSnapshot(
      `"ButtonTsx-Button-d0u57m"`
    );
  });
});
