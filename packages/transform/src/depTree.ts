import _ from 'lodash';

class Node {
  constructor(
    public parent: Node | undefined,
    public children: Node[],
    public name: string,
    public isStyledNode: boolean,
    public parentName: string | undefined
  ) {}
  addChild(node: Node) {
    if (this.children.includes(node)) {
      return;
    }
    this.children.push(node);
  }
  get value() {
    return this.name;
  }
}
export const isParentOf = (parent: Node, child: Node) => {
  return parent.name === child.parentName;
};
export const findRoot = (node: Node): Node => {
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
  const styledNodes = new Set<Node>();
  for (const [name, depName] of Object.entries(depObj)) {
    styledNodes.add(new Node(undefined, [], name, true, depName));
  }
  console.table(
    Array.from(styledNodes).map(e =>
      JSON.stringify(_.pick(e, ['name', 'parentName', 'parent']))
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
  const roots = new Set<Node>();
  for (const node of styledNodes) {
    const _root = findRoot(node);

    roots.add(_root);
  }

  //get leaves
  const leaves = new Set<Node>();
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
  const paths = new Set<Node[]>();
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
