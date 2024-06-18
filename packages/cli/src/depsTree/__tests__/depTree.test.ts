import { it, expect, describe } from "vitest";
// const Tree = require("@nindaff/ascii-tree").default;
// import _ from "lodash";
// import {
//   DepNode,
//   getDepPaths,
//   getLayerTextFromPath,
//   makeDepsTree,
// } from "../depsTree";

// export const printAsciiTree = (root: any) => {
//   const t = new Tree({ root });
//   return t.render();
// };
describe("test cases", () => {
  it("xx", () => {});
});
// describe("test cases", () => {
//   it("makeDepTree", () => {
//     const depObj = {
//       Button: "button",
//       AButton: "Button",
//       Title: "Text",
//       Text: "p",
//     };

//     const res = makeDepsTree(depObj);
//     console.table(res.roots);
//     expect(res.roots.length).toBe(2);
//     expect(printAsciiTree(res.roots[0])).toMatchInlineSnapshot(`
//       " Button
//          _|
//          |
//       AButton  "
//     `);
//     expect(printAsciiTree(res.roots[1])).toMatchInlineSnapshot(`
//       " Text
//         _|
//         |
//       Title  "
//     `);
//   });
//   it("getDepPath", () => {
//     const depObj = {
//       Button: "button",
//       AButton: "Button",
//       Title: "Text",
//       Text: "p",
//     };
//     const res = getDepPaths(depObj);
//     expect(res.length).toBe(2);
//     expect(res.map(p => p.map(e => _.pick(e, ["name", "parentName"]))))
//       .toMatchInlineSnapshot(`
//       [
//         [
//           {
//             "name": "AButton",
//             "parentName": "Button",
//           },
//           {
//             "name": "Button",
//             "parentName": "button",
//           },
//         ],
//         [
//           {
//             "name": "Title",
//             "parentName": "Text",
//           },
//           {
//             "name": "Text",
//             "parentName": "p",
//           },
//         ],
//       ]
//     `);
//   });
//   it("getLayerTextFromPath", () => {
//     const path: any[] = [
//       {
//         name: "AButton",
//         parentName: "Button",
//       },
//       {
//         name: "Button",
//         parentName: "button",
//       },
//     ];
//     const allStyledComponentCssMap = {
//       AButton: ".abutton {color:red}",
//       Button: ".button {color:blue}",
//     };
//     const res = getLayerTextFromPath(path, allStyledComponentCssMap);
//     expect(res).toMatchInlineSnapshot(`
//       "@layer AButton {
//           .abutton {color:red}
//           @layer Button {
//             .button {color:blue}
//           }
//         }"
//     `);
//   });
// });
export {};
