import { require } from "tsx/cjs/api";
import { ImportsByName } from "../types";

export const load = (imports: ImportsByName, key: string) => {
  const _import = imports[key];
  try {
    return require(_import.moduleId, import.meta.url)[_import.importedName];
  } catch (e) {
    throw e;
  }
};
