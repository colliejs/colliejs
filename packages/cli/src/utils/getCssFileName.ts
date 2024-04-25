import path, { dirname } from "node:path";

export const getCssFileName = (url: string) => {
  return (root: string) => {
    const prefix = path.resolve(root, ".collie").replace(/\\/g, "/");;
    let newUrl = `${prefix}/${path.relative(root, url)}.css`;
    return { absUrl: newUrl, relativeUrl: path.relative(root, newUrl) };
  };
};
