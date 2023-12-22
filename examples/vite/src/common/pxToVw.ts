export const pxToVw = (px: number, refWidth: number) =>
  `${(px / refWidth) * 100}vw`;
