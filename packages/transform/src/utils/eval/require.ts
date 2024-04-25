import log from "npmlog";
import { transformTs } from "../transformTs";
import { ImportsByName } from "../types";
import { writeFileSync } from "fs";

export const load = (imports: ImportsByName, key: string) => {
  const module = imports[key];
  try {
    //TODO:如果不是TS文件
    const code = transformTs(module.moduleId);
    const resFile = `${module.moduleId}.cjs`;
    writeFileSync(resFile, code, { encoding: "utf-8" });
    return require(resFile)[module.importedName];
  } catch (e) {
    throw e;
  }
};
