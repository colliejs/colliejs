import path from "node:path";
import { CSS_CACHE_DIR, CSS_ENTRY_FILE, CSS_THEME_FILE } from "../const";
export function getCssEntryFile(entry: string) {
  return path.join(path.dirname(entry), CSS_ENTRY_FILE);
}
export function getCssRoot(srcRoot: string) {
  return path.resolve(srcRoot, CSS_CACHE_DIR).replace(/\\/g, "/");
}

export function getCssFileNameFromJs(absJsUrl: string, srcRoot: string) {
  let newUrl = `${getCssRoot(srcRoot)}/${path.relative(srcRoot, absJsUrl)}.css`;
  return { absUrl: newUrl, relativeUrl: path.relative(srcRoot, newUrl) };
}

export function getCssThemeFile(srcRoot: string) {
  return path.join(getCssRoot(srcRoot), CSS_THEME_FILE);
}
