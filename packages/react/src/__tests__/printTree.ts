import Tree from '@nindaff/ascii-tree';

export const printAsciiTree = (root: any) => {
  const t = new Tree({ root });
  return t.render();
};
