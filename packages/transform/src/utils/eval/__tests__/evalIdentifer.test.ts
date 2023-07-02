import { code } from "@scriptbot/cli";
import { parseCode } from "../../../parse";
import { getImports } from "../../importer";
import { parseCodeAndGetBodyN } from "../../parseCodeAndGetBody0";
import { evalIdentifer } from "../evalIdentifier";
import { FunctionDeclaration } from "@babel/types";
import traverse, { NodePath, Scope } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const evalObjectString = (code: string) => {
  const fileAst = parseCode(code);
  const imports = getImports(fileAst.program, __dirname);
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
    const fn = parseCodeAndGetBodyN(code, 1);
    // const fn = stmt.body.body[1];
    // console.log(fn.scope)
    NodePath;
    // let path;
    traverse(
      file,
      {
        Identifier(path) {
          if (!path.isReferenced()) {
            return;
          }
          console.log(path.node.name);
          const x = evalIdentifer(path, {});
          console.log(x);
          expect(x).toBe(0);
        },
        //   noScope: true,
      }
      //   new Scope(new NodePath())
      //   fn.path
    );
  });
});
