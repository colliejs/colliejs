import path from "path";
import { load } from "../eval/require";
import { describe, it, expect } from "vitest";
describe("load function dynamic", () => {
  it("should work ", async () => {
    const moduleId = path.resolve(__dirname, "./fixtures/abs.ts");
    const imports = {
      abs: {
        importedName: "abs",
        moduleId,
      },
    };
    const absPosFn = load(imports, "abs");
    const result = absPosFn("x");
    expect(result).toEqual({ position: "x" });
  });
  it("default should work ", async () => {
    /**
     * import abs from './fixtures/hello';
     */
    const moduleId = path.resolve(__dirname, "./fixtures/hello.ts");
    const imports = {
      abs: {
        importedName: "default",
        moduleId,
      },
    };
    const loaded = load(imports, "abs");
    expect(loaded).toEqual("hello,world");
  });
});
