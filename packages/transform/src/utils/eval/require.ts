import { require } from "tsx/cjs/api";
import { ImportsByName } from "../types";

export const load = (imports: ImportsByName, name: string) => {
  const _import = imports[name];
  try {
    return require(_import.moduleId, import.meta.url)[_import.importedName];
  } catch (e) {
    throw e;
  }
};
