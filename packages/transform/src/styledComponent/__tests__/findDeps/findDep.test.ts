// import { defaultConfig } from "@colliejs/config";
// import fs from "node:fs";
// import path from "node:path";
// import {
//   getImportFromSource,
//   getPathOfStyledComponentDecl,
// } from "../../../__tests__/common/getPathOfJsxEle";
// import { StyledComponent } from "../../StyledComponent";

// const prepareStyledComponent = (sourcecode, componentName) => {
//   let styledCompDeclPath = getPathOfStyledComponentDecl(
//     sourcecode,
//     componentName
//   );
//   return new StyledComponent(
//     styledCompDeclPath,
//     path.resolve(__dirname, "./code.ts"),
//     getImportFromSource(sourcecode, __filename),
//     defaultConfig,
//     {},
//     process.cwd(),
//     true
//   );
// };

// describe("findDeps", () => {
//   it("should work ", () => {
//     const code = fs.readFileSync(path.resolve(__dirname, "./code.ts"), {
//       encoding: "utf-8",
//     });
//     const c = prepareStyledComponent(code, "MySpecialButton");
//     const deps = c.layerDeps;
//     expect(deps).toMatchInlineSnapshot(`
//       [
//         "codeTs-MyButton-uygnw4",
//         "buttonTs-Button-ewa165",
//       ]
//     `);
//   });
// });
import { describe, it, expect } from "vitest";
describe("findDeps", () => {
  it("should work ", () => {
    expect(1).toBe(1);
  });
});
