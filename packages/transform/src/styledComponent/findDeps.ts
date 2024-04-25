import CustomComponent from "../component/CustomComponent";
import fs from "node:fs";
import { parseCode } from "../utils/parse";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import {  getImports, traverse } from "../utils";
import {
  getStyledComponentName,
  getStyledDependent,
  parseStyledComponentDeclaration,
} from "./parseStyledComponent";
import { HostComponent } from "../component";
import type { BaseConfig } from "@colliejs/core";
import { Alias } from "../type";

/**
 * @todo:增加缓存来减少重复parseFile
 * @param moduleId
 * @param componentName
 * @returns
 */
export const findDirectDep = <Config extends BaseConfig>(
  comp: CustomComponent,
  alias: Alias,
  root: string,
  config: Config
): HostComponent | CustomComponent | undefined => {
  const { moduleId, componentName } = comp.id;
  if (moduleId.includes("node_modules")) {
    return;
  }
  const source = fs.readFileSync(moduleId, { encoding: "utf-8" });
  const fileAst = parseCode(source);
  let dep;
  traverse(fileAst, {
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node, config)) {
        return;
      }
      const styledComponentName = getStyledComponentName(path);
      if (styledComponentName === componentName) {
        const imports = getImports(fileAst.program, moduleId, alias, root);
        dep = getStyledDependent(path, imports, moduleId, config);
        path.stop();
      }
    },
  });

  return dep;
};
export const findDeps = <Config extends BaseConfig>(
  comp: CustomComponent,
  alias: Alias,
  root: string,
  config: Config
) => {
  const deps: CustomComponent[] = [];
  const dep = findDirectDep(comp, alias, root, config);
  if (dep instanceof CustomComponent) {
    deps.push(dep);
    const _deps = findDeps(dep, alias, root, config);
    deps.push(..._deps);
  }
  return deps;
};
export const findLayerDeps = <Config extends BaseConfig>(
  comp: CustomComponent,
  alias: Alias,
  root: string,
  config: Config
) => {
  const deps = findDeps(comp, alias, root, config);
  return deps.map(e => e.layerName);
};
