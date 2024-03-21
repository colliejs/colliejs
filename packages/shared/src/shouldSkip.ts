export const jsFileReg = /\.[cm]?[tj]sx?$/;

export const shouldSkip = (url: string, filter: Function) => {
  return (
    ["node_modules", "dist"].some(e => url.includes(e)) ||
    !filter(url) ||
    !jsFileReg.test(url)
  );
};
