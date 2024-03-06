import path, { dirname } from "path/win32";
import { toHash } from "@c3/utils";

export const getCssFileName = (url: string, enableTimeStampe = false) => {
  const lastSeg = path.dirname(url).split("/").pop();
  return (baseDir: string) => {
    const prefix = path.resolve(baseDir, ".collie").replace(/\\/g, "/");
    let newUrl = "";
    if (dirname(url) !== ".") {
      newUrl = `${prefix}/${lastSeg}/${path.basename(url)}-${toHash(url)}.css`;
    } else {
      newUrl = `${prefix}/${url}`;
    }
    if (!enableTimeStampe) {
      return newUrl;
    }
    return `${newUrl}?stamp=${Date.now()}`;
  };
};
