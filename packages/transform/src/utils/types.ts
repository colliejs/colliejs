import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export type StyledComponentDecl = t.VariableDeclaration;
export interface Stylable {
  getCssText(): string;
  // transform(): { cssText: string; path: NodePath<t.Node> };
}

export type ImportsByName = Record<
  string,
  { moduleId: string; importedName: string;  }
>;
