import { evalExpDirectly } from "./evalExpDirectly";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@colliejs/shared";
import { getFileModuleImport } from "../importer";
import { ImportsByName } from "../types";
import { load } from "./require";
import { getCtxOf } from "./getCtx";
import log from "consola";

const getExternalIdentifierValue = (
  variable: t.Identifier,
  imports: ImportsByName
) => {
  const name = variable.name;
  const fileMap = getFileModuleImport(imports);
  if (name in fileMap) {
    return fileMap[name];
  } else {
    return load(imports, name);
  }
};

export const evalIdentifer = (
  path: NodePath<t.Identifier>,
  imports: ImportsByName
) => {
  try {
    return _evalIdentifer(path, imports);
  } catch (e) {
    console.error({ function: "evalIdentifer", path, imports });
    // log.error("===>error", "c", {
    //   function: "evalIdentifer",
    //   path,
    //   imports,
    // });
    throw e;
  }
};
const _evalIdentifer = (
  path: NodePath<t.Identifier>,
  imports: ImportsByName
) => {
  assert(path.isIdentifier(), "path should be Identifier", { path, imports });
  const name = path.node.name;
  const binding = path.scope.getBinding(name);
  assert(
    !!binding,
    `binding is null-${path.node.type}-${name}-${JSON.stringify(path.node.loc)}`
  );

  switch (binding.kind) {
    case "module":
      return getExternalIdentifierValue(path.node, imports);
    case "param":
      throw new Error("param is dertemined at runtime");
    case "const":
    case "let":
    case "var":
    default: {
      let ctx;
      const init = binding.path.get("init");
      assert(!Array.isArray(init), "init should not be array");
      if (init.isIdentifier()) {
        return evalIdentifer(init, imports);
      } else {
        ctx = getCtxOf(init, imports);
        return evalExpDirectly(init.node, ctx);
      }
    }
  }
};
