import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { parseCode } from "../../../utils/parse";
import { getImports } from "../../importer";
import { evalIdentifer } from "../evalIdentifier";

const evalObjectString = (code: string) => {
  const fileAst = parseCode(code);
  const imports = getImports(fileAst.program, __filename);
};

describe("test cases", () => {
  it("should work ", () => {
    const code = `
        const a = 2;
   
        function foo(){
            const a = 0;
            return a
        }
    `;
    const file: t.File = parseCode(code);
    traverse(file, {
      Identifier(path) {
        if (!path.isReferenced()) {
          return;
        }
        const x = evalIdentifer(path, {});
        if (x.name === "a") {
          expect(x).toBe(0);
        }
      },
    });
  });
  it("should work ", () => {
    const code = `
    const d=3;
    const k={
            a:1,
            b:2,
            c:d            
     }
    function foo(){
       const a = k;
       return a
    }
    `;
    const file: t.File = parseCode(code);
    traverse(file, {
      Identifier(path) {
        if (!path.isReferenced()) {
          return;
        }
        if (path.node.name === "a") {
          const x = evalIdentifer(path, {});
          expect(x).toEqual({ a: 1, b: 2, c: 3 });
        }
      },
    });
  });
});
