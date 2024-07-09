import { require } from "tsx/cjs/api";
import { ImportsByName } from "../types";
import consola from "consola";

export function load(imports: ImportsByName, name: string) {
  const _import = imports[name];
  try {
    return require(_import.moduleId, import.meta.url)[_import.importedName];
  } catch (e) {
    consola.debug({ function: "load", name, imports });
    throw e;
  }
}
