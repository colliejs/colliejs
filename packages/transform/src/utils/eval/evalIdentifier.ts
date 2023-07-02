import * as t from "@babel/types";
import { ImportsByName } from "../types";
import { load } from "./require";
import { evalExp } from "./eval";
import { getFileModuleImport } from "../importer";
import { NodePath } from "@babel/traverse";
import { assert } from "@c3/utils";

const getExternalIdentifierValue = (
  variable: t.Identifier,
  imports: ImportsByName
) => {
  const name = variable.name;
  //   const res = {};
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
  const binding = path.scope.getBinding(path.node.name);
  assert(!!binding, "binding is null");

  if (binding.kind === "module") {
    return getExternalIdentifierValue(path.node, imports);
  }
  return evalExp(binding.path.node, {}); //TODO:ctx
};
