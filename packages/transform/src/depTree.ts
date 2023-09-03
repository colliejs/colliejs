import _ from "lodash";

export class DepNode {
  constructor(
    public parent: DepNode | undefined,
    public children: DepNode[],
    public name: string,
    public parentName: string | undefined
  ) {}
  addChild(node: DepNode) {
    if (this.children.includes(node)) {
      return;
    }
    this.children.push(node);
  }
  get value() {
    return this.name;
  }
}

export const isParentOf = (parent: DepNode, child: DepNode) => {
  return parent.name === child.parentName;
};

export const findRoot = (node: DepNode): DepNode => {
  if (node.parent) {
    return findRoot(node.parent);
  } else {
    return node;
  }
};

/**
 * 根据依赖生产csslayer的依赖
 * {
 *  a:b,
 *  d:c,
 *
 * }
 */
export const makeDepTree = (depObj: Record<string, string>) => {
  //1.获得所欲呕的styledComponent
  const styledNodes = new Set<DepNode>();
  for (const [name, depName] of Object.entries(depObj)) {
    styledNodes.add(new DepNode(undefined, [], name, depName));
  }
  console.table(
    Array.from(styledNodes).map(e =>
      JSON.stringify(_.pick(e, ["name", "parentName", "parent"]))
    )
  );

  for (const oneNode of styledNodes) {
    for (const anotherNode of styledNodes) {
      if (isParentOf(oneNode, anotherNode)) {
        oneNode.addChild(anotherNode);
        anotherNode.parent = oneNode;
      } else if (isParentOf(anotherNode, oneNode)) {
        anotherNode.addChild(oneNode);
        oneNode.parent = anotherNode;
      }
    }
  }
  //get roots
  const roots = new Set<DepNode>();
  for (const node of styledNodes) {
    const _root = findRoot(node);

    roots.add(_root);
  }

  //get leaves
  const leaves = new Set<DepNode>();
  for (const node of styledNodes) {
    if (node.children.length === 0) {
      leaves.add(node);
    }
  }

  return { roots: Array.from(roots), leaves: Array.from(leaves), styledNodes };
};
/**
 * the last one have high priority
 * @param depObj
 * @returns
 */
export const getDepPaths = (depObj: Record<string, string>) => {
  const { leaves } = makeDepTree(depObj);
  const paths = new Set<DepNode[]>();
  for (const leaf of leaves) {
    const path = [leaf];
    let parent = leaf.parent;
    while (parent) {
      path.push(parent);
      parent = parent.parent;
    }
    paths.add(path);
  }
  return Array.from(paths);
};

export const getLayerTextFromPath = (
  path: DepNode[],
  allStyledComponentCssMap: Record<string, string>
) => {
  if (path.length === 1) {
    const layerName = path[0].name;
    return `@layer ${layerName} {
      ${allStyledComponentCssMap[layerName]}    
    }`;
  }
  const left = getLayerTextFromPath(path.slice(1), allStyledComponentCssMap);
  const curLayerName = path[0].name;
  return `@layer ${curLayerName} {
    ${allStyledComponentCssMap[curLayerName]}
    ${left}
  }`;
};
export type LayerName = string;
export const getCssText = (
  allCssLayerDeps: Record<LayerName, LayerName>,
  allStyledComponentCssMap: Record<LayerName, string>
) => {
  const depPaths = getDepPaths(allCssLayerDeps);
  const layerText = depPaths
    .map(path => {
      return getLayerTextFromPath(path, allStyledComponentCssMap);
    })
    .join("\n");

  return layerText;
};
