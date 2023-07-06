import { evalExpDirectly } from "./evalExpDirectly";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@c3/utils";
import { getFileModuleImport } from "../importer";
import { ImportsByName } from "../types";
import { load } from "./require";
import { evalExpText } from "./evalText";
import { getCtxOf } from "./getCtx";
import log from "npmlog";

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
    log.error("===>error", "c", {
      function: "evalIdentifer",
      path,
      imports,
    });
    throw e;
  }
};
const _evalIdentifer = (
  path: NodePath<t.Identifier>,
  imports: ImportsByName
) => {
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
      throw new Error("should deal before....");
    case "const":
    case "let":
    case "var":
    default: {
      const init = binding.path.get("init");
      assert(!Array.isArray(init), "init should not be array");
      const initParent = init.parentPath;
      const ctx = getCtxOf(initParent, imports);
      return evalExpDirectly(init.node, ctx);
    }
  }
};
