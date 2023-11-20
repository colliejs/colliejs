import CustomComponent from "../component/CustomComponent";
import fs from "node:fs";
import { parseCode } from "../parse";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import { Alias, getImports, traverse } from "../utils";
import {
  getStyledComponentName,
  getStyledDependent,
  parseStyledComponentDeclaration,
} from "./parseStyledComponent";
import { HostComponent } from "../component";

/**
 * @todo:增加缓存来减少重复parseFile
 * @param moduleId
 * @param componentName
 * @returns
 */
export const findDirectDep = (
  comp: CustomComponent,
  alias: Alias,
  root: string
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
      if (!isStyledComponentDecl(path.node)) {
        return;
      }
      const styledComponentName = getStyledComponentName(path);
      if (styledComponentName === componentName) {
        const imports = getImports(fileAst.program, moduleId, alias, root);
        dep = getStyledDependent(path, imports, moduleId);
        path.stop();
      }
    },
  });

  return dep;
};
export const findDeps = (comp: CustomComponent, alias: Alias, root: string) => {
  const deps: CustomComponent[] = [];
  const dep = findDirectDep(comp, alias, root);
  if (dep instanceof CustomComponent) {
    deps.push(dep);
    const _deps = findDeps(dep, alias, root);
    deps.push(..._deps);
  }
  return deps;
};
export const findLayerDeps = (
  comp: CustomComponent,
  alias: Alias,
  root: string
) => {
  const deps = findDeps(comp, alias, root);
  return deps.map(e => e.layerName);
};
