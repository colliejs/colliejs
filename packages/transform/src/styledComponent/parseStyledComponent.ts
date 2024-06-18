import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import _ from "lodash";
import log from "npmlog";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { generate, getArgPathOfFnCall } from "../utils/index";
import { ImportsByName, StyledComponentDecl } from "../utils/types";
import { StyledComponent } from "./StyledComponent";
import { assert } from "@colliejs/shared";
import { ComponentId } from "../component/componentId";
import type { BaseConfig, StyledObject } from "@colliejs/core";
import { isStyledCallExpression } from "./isStyledCompDelc";
import { evalObjectExp } from "../utils/eval/evalObjectExp";
import { STYLE_FN_NAME } from "../const";

export type StyledDataType<Config extends BaseConfig> = {
  styledComponentName: string;
  dependent: CustomComponent | StyledComponent<Config> | HostComponent;
  styledObject: StyledObject<Config>;
};

export const getStyledComponentName = (
  path: NodePath<t.VariableDeclaration>
) => {
  //TODO: support multiple declarator
  return (path.node.declarations[0].id as t.Identifier)?.name;
};
//===========================================================
//
//===========================================================
export const getStyledDependent = <Config extends BaseConfig>(
  path: NodePath<t.VariableDeclaration>,
  moduleIdByName: ImportsByName,
  moduleId: string,
  config: Config
) => {
  let dependent;
  const { init, id } = path.node.declarations[0]; ////TODO: multiple declarator
  if (!init || !isStyledCallExpression(init)) {
    throw new Error("not a styledComponentDecl");
  }
  const { arguments: _arguments } = init;
  let exp = _arguments[0];
  let type = exp.type;
  if (_.isObject(exp) && t.isTSAsExpression(exp)) {
    exp = (exp as t.TSAsExpression).expression;
    type = exp.type;
  }
  switch (type) {
    case "StringLiteral":
      assert(t.isStringLiteral(exp), "exp should be StringLiteral");
      dependent = new HostComponent(ComponentId.make(moduleId, exp.value));
      break;
    case "Identifier":
      assert(t.isIdentifier(exp), "exp should be StringLiteral");
      //styledComponent 也被视为Custom component. 因为layername是一样的，
      const componentName = exp.name;
      dependent = new CustomComponent(
        ComponentId.make(
          moduleIdByName[componentName]?.moduleId || moduleId,
          componentName
        )
      );
      break;
    default:
      log.error(
        "Unknown element type,use Identifier",
        generate(path.node).code,
        "type",
        type
      );
      throw new Error("Unknown element type");
  }
  return dependent;
};

//TODO: support multiple declarator
export const parseStyledComponentDeclaration = <Config extends BaseConfig>(
  path: NodePath<t.VariableDeclaration>,
  moduleIdByName: ImportsByName,
  moduleId: string,
  config: Config
): StyledDataType<Config> => {
  const { init, id } = path.node.declarations[0]; ////TODO: multiple declarator
  if (!init || !isStyledCallExpression(init)) {
    throw new Error("not a styledComponentDecl");
  }

  const result = {} as StyledDataType<Config>;
  const { arguments: _arguments } = init;
  //===========================================================
  // 1. get styledComponentName
  //===========================================================
  if (t.isIdentifier(id)) {
    result.styledComponentName = id.name;
  } else {
    log.error("parseStyledComponentDeclaration", "id=", id);
    throw new Error("not support");
  }

  //===========================================================
  // 2. get result.dependent
  //===========================================================
  result.dependent = getStyledDependent(path, moduleIdByName, moduleId, config);

  //===========================================================
  // 3.parse styledObject to
  //===========================================================
  let styledObjectExp = _arguments[1];
  if (t.isTSAsExpression(styledObjectExp)) {
    styledObjectExp = styledObjectExp.expression;
  }
  if (t.isObjectExpression(styledObjectExp)) {
    const styledObjectPath = getArgPathOfFnCall(path, STYLE_FN_NAME, 1);
    assert(!!styledObjectPath, "stylingPath should not be null", {
      styledObjectExp,
      path,
    });
    result.styledObject = evalObjectExp(styledObjectPath, moduleIdByName);
  } else {
    log.error("error:", "not support type", styledObjectExp);
    throw new Error("not support variable as styledObject.in todo list");
  }
  return result;
};
