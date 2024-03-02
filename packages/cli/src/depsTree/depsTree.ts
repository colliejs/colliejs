import _ from "lodash";

export class DepNode {
  children: DepNode[] = [];
  parent: DepNode | undefined;
  constructor(public name: string) {}
  addChild(node: DepNode) {
    if (this.children.includes(node)) {
      return;
    }
    this.children.push(node);
  }
  setParent(node: DepNode) {
    this.parent = node;
  }
  get value() {
    return this.name;
  }
  get parentName() {
    return this.parent?.name;
  }
  isEqual(node: DepNode) {
    return this.name === node.name;
  }
}

//?why name ?
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
 * @param depObj
 * {
 *  a:b,
 *  d:c,
 * }
 * 其中a依赖b,d依赖c
 */
export const makeDepsTree = (depObj: Record<string, string>) => {
  const allStyledNodes = new Array<DepNode>();
  for (const [name, depName] of Object.entries(depObj)) {
    let curNode = allStyledNodes.find(e => e.name === name);
    if (!curNode) {
      curNode = new DepNode(name);
      allStyledNodes.push(curNode);
    }
    let parentNode = allStyledNodes.find(e => e.name === depName);
    if(!parentNode){
      parentNode = new DepNode(depName);
      allStyledNodes.push(parentNode);
    }

    curNode.setParent(parentNode);
    parentNode.addChild(curNode);
  }
  console.table(
    Array.from(allStyledNodes).map(e =>
      JSON.stringify(_.pick(e, ["name", "parentName", "parent"]))
    )
  );

  // for (const oneNode of allStyledNodes) {
  //   for (const anotherNode of allStyledNodes) {
  //     if (isParentOf(oneNode, anotherNode)) {
  //       oneNode.addChild(anotherNode);
  //       anotherNode.parent = oneNode;
  //     } else if (isParentOf(anotherNode, oneNode)) {
  //       anotherNode.addChild(oneNode);
  //       oneNode.parent = anotherNode;
  //     }
  //   }
  // }
  //get roots
  const roots = new Set<DepNode>();
  for (const node of allStyledNodes) {
    const _root = findRoot(node);

    roots.add(_root);
  }

  //get leaves
  const leaves = new Set<DepNode>();
  for (const node of allStyledNodes) {
    if (node.children.length === 0) {
      leaves.add(node);
    }
  }

  return {
    roots: Array.from(roots),
    leaves: Array.from(leaves),
    styledNodes: allStyledNodes,
  };
};
/**
 * the last one have high priority
 * @param depObj
 * @returns
 */
export const getDepPaths = (depObj: Record<string, string>): DepNode[][] => {
  const { leaves } = makeDepsTree(depObj);
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
  allDepsMap: Record<string, string>
) => {
  if (path.length === 1) {
    const layerName = path[0].name;
    return `@layer ${layerName} {
      ${allDepsMap[layerName]}
    }`;
  }
  const left = getLayerTextFromPath(path.slice(1), allDepsMap);
  const curLayerName = path[0].name;
  return `@layer ${curLayerName} {
    ${allDepsMap[curLayerName]}
    ${left}
  }`;
};
