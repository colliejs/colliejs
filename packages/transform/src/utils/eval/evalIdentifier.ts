import { evalExpDirectly } from "./evalExpDirectly";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@c3/utils";
import { getFileModuleImport } from "../importer";
import { ImportsByName } from "../types";
import { load } from "./require";
import { evalText } from "./evalText";
import { getCtxOf } from "./getCtx";

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
      const parentPathOfInit = binding.path.get("init").parentPath;
      const ctx = getCtxOf(parentPathOfInit, imports);
      return evalExpDirectly(parentPathOfInit.node as t.Expression, ctx);
    }
  }
};
