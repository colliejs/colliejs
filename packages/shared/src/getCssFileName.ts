import path from "node:path";
import { toHash } from "./toHash";
export const getCssFileName = (url: string, enableTimeStampe = false) => {
  const lastSeg = path.dirname(url).split("/").pop();
  return (baseDir: string) => {
    const prefix = path.resolve(baseDir, ".collie");
    const newUrl = `${prefix}/${lastSeg}-${path.basename(url)}-${toHash(
      url
    )}.css`;
    if (!enableTimeStampe) {
      return newUrl;
    }
    return `${newUrl}?stamp=${Date.now()}`;
  };
};
