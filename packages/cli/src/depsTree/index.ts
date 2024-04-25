import { getDepPaths, getLayerTextFromPath } from "./depsTree";

export type LayerName = string;

export const getLayerDepsCssText = (
  allCssLayerDepsMap: Record<LayerName, LayerName>,
) => {
  const depPaths = getDepPaths(allCssLayerDepsMap);
  const layerText = depPaths
    .map(path => {
      return getLayerTextFromPath(path, allCssLayerDepsMap);
    })
    .join("\n");

  return layerText;
};
