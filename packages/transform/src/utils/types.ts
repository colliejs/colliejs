import * as t from "@babel/types";

export type StyledComponentDecl = t.VariableDeclaration;
export interface Stylable {
  getCssText(): string;
  transform(): { ast: any; cssFileName?: string; cssText?: string };
}

export type ImportsByName = Record<
  string,
  { moduleId: string; importedName: string }
>;
