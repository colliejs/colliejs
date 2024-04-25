export const pxToVw = (px: number, refWidth: number=375) =>
  `${(px / refWidth) * 100}vw`;
