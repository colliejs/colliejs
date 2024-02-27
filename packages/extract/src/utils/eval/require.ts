import log from "npmlog";
import { transformTs } from "../transformTs";
import { ImportsByName } from "../types";

export const load = (imports: ImportsByName, key: string) => {
  const module = imports[key];
  try {
    //TODO:如果不是TS文件
    const resFile = transformTs(module.moduleId);
    return require(resFile)[module.importedName];
  } catch (e) {
    log.warn("load", "key=", key);
    log.warn("load", "imports=", imports);
    throw e;
  }
};
