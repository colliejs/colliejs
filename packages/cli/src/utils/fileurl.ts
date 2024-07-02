import path from "node:path";
import { CSS_CACHE_DIR, CSS_ENTRY_FILE, CSS_THEME_FILE } from "../const";
export function getCssEntryFile(entry: string) {
  return path.join(path.dirname(entry), CSS_ENTRY_FILE);
}
export function getCssCacheRoot(cssRoot: string) {
  return path.resolve(cssRoot, CSS_CACHE_DIR).replace(/\\/g, "/");
}

export function getCssFileNameFromJs(absJsUrl: string, cssRoot: string) {
  let newUrl = `${getCssCacheRoot(cssRoot)}/${path.relative(cssRoot, absJsUrl)}.css`;
  return { absUrl: newUrl, relativeUrl: path.relative(cssRoot, newUrl) };
}

export function getCssThemeFile(cssRoot: string) {
  return path.join(getCssCacheRoot(cssRoot), CSS_THEME_FILE);
}

export function getCssRoot(cssEntry: string) {
  return path.resolve(path.dirname(cssEntry));
}
