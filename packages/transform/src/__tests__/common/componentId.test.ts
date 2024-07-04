import { ComponentId } from "../../component/componentId";
import { describe, it, expect } from "vitest";
import path from "node:path";
import { toCamelCase } from "@colliejs/shared";
describe("test cases", () => {
  it("componentId should work ", () => {
    const componentId = new ComponentId("Button.tsx", "Button");
    expect(componentId.uniqName).toMatchInlineSnapshot(
      `"ButtonTsx-Button-d0u57m"`
    );
  });
  it("componentId with special character in path ", () => {
    const componentId = new ComponentId("[id].tsx", "Button");
    expect(componentId.moduleId).toMatchInlineSnapshot(`"[id].tsx"`);
    expect(componentId.uniqName).toMatchInlineSnapshot(`"idTsx-Button-3wrtf1"`);
  });
  it("toCamelCase", () => {
    expect(path.basename("Button.ab.tsx")).toEqual("Button.ab.tsx");
    expect(path.basename("Button.ab.tsx").replace(/\./g, "-")).toBe(
      "Button-ab-tsx"
    );
    expect(
      toCamelCase(path.basename("Button.ab.tsx").replace(/\./g, "-"))
    ).toBe("ButtonAbTsx");
  });
});
