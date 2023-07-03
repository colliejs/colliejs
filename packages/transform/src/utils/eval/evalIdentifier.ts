import { evalExpDirectly } from "./evalExpDirectly";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@c3/utils";
import { getFileModuleImport } from "../importer";
import { ImportsByName } from "../types";
import { load } from "./require";
import { evalText } from "./evalText";

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
  //TODO:更通用的处理方式
  // if (name === "console") {
  // return "console";
  // }
  const binding = path.scope.getBinding(name);
  assert(!!binding, "binding is null" + path.node.type + name);

  switch (binding.kind) {
    case "module":
      return getExternalIdentifierValue(path.node, imports);
    case "param":
      throw new Error("should deal before....");
    case "const":
    case "let":
    case "var":
    default: {
      //TODO: 无法处理,复杂的多次引用。因为getCtx()现在没计算
      //===========================================================
      // 1.解决方案。对getCtx，存储依赖关系，然后倒回来计算，最终得到getCtx的结果就OK
      //===========================================================
      const v = path.evaluate().value;
      if (!v) {
        return evalExpDirectly(binding.path.node, {});
      }
      return v;
      // const res = binding.path.evaluate();
      // if (res.confident) {
      // return res.value;
      // }
      // console.error(res, path);
      // throw new Error("eval enconquer error");
    }
  }
};
