import path from "path";
import { load } from "../eval/require";

describe("test cases", () => {
  it("should work ", async () => {
    const code = `import {abs} from './fixtures/abs'`;
    const moduleId = path.resolve(__dirname, "./fixtures/abs.ts");
    const imports = {
      abs: {
        importedName: "abs",
        moduleId,
      },
    };
    const fn = load(imports, "abs");
    const result = fn("x");    
    expect(result).toEqual({ position: "x" });
  });
});
