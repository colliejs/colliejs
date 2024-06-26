import path from "node:path";
export const CSS_ENTRY_FILE = "collie.css";

export function getCssEntryFile(entry: string) {
  return path.join(path.dirname(entry), CSS_ENTRY_FILE);
}

export const getCssFileName = (url: string) => {
  return (cssRoot: string) => {
    const prefix = path.resolve(cssRoot, ".collie").replace(/\\/g, "/");
    let newUrl = `${prefix}/${path.relative(cssRoot, url)}.css`;
    return { absUrl: newUrl, relativeUrl: path.relative(cssRoot, newUrl) };
  };
};
