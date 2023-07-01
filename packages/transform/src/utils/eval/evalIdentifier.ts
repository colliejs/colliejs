import * as t from "@babel/types";
import { ImportsByName } from "../types";
import { load } from "./require";
import { buildObjectExpression } from "../buildObjectExpression";
import log from "npmlog";
import { getVariableValueInFile } from "../variableDecl";

const getExternalIdentifierValue = (
  variable: t.Identifier,
  imports: ImportsByName
) => {
  const name = variable.name;
  if (name in imports) {
    const res = load(imports, name);
    // const res = load(imports[name], name);
    switch (typeof res) {
      case "string":
        return t.stringLiteral(res);
      case "number":
        return t.numericLiteral(res);
      case "object":
        return buildObjectExpression(res);
      default:
        log.error("not support type res=", res);
        throw new Error("not support type");
    }
  }
  log.error("not support type name=", name);
  throw new Error("not support type");
};

export const getInternalIndentifierValue = (
  variable: t.Identifier,
  fileAst: t.File
) => {
  if (!fileAst) {
    throw new Error("fileAst is must provided");
  }
  return getVariableValueInFile(fileAst, variable.name);
};

export const evalIdentifer = (
  variable: t.Identifier,
  imports: ImportsByName,
  fileAst: t.File
) => {
  if (variable.name in imports) {
    return getExternalIdentifierValue(variable, imports);
  } else {
    return getInternalIndentifierValue(variable, fileAst);
  }
};
