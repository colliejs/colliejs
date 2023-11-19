import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import _ from "lodash";
import log from "npmlog";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { evalStyling } from "../styling/evalStyling";
import { type Styling } from "../styling/types";
import { generate, isStyledCallExpression } from "../utils/index";
import { ImportsByName, StyledComponentDecl } from "../utils/types";
import { StyledComponent } from "./StyledComponent";
import { getPathOfStyling } from "./getNodePathOfStyling";
import { assert } from "@c3/utils";
import { ComponentId } from "../component/componentId";

export type StyledDataType = {
  styledComponentName: string;
  dependent: CustomComponent | StyledComponent | HostComponent;
  styling: Styling;
};

export const getStyledComponentName = (
  path: NodePath<t.VariableDeclaration>
) => {
  //TODO: support multiple declarator
  return (path.node.declarations[0].id as t.Identifier)?.name;
};
export const getStyledDependent = (
  path: NodePath<t.VariableDeclaration>,
  moduleIdByName: ImportsByName,
  moduleId: string
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
      //NOTE:默认认为是一个customeComponent.如果是一个styledComponent，
      //那么会在后期被替换为styledComponent
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
export const parseStyledComponentDeclaration = (
  path: NodePath<t.VariableDeclaration>,
  moduleIdByName: ImportsByName,
  moduleId: string
): StyledDataType => {
  const { init, id } = path.node.declarations[0]; ////TODO: multiple declarator
  if (!init || !isStyledCallExpression(init)) {
    throw new Error("not a styledComponentDecl");
  }

  const result = {} as StyledDataType;
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
  result.dependent = getStyledDependent(path, moduleIdByName, moduleId);

  //===========================================================
  // 3.parse styledObject to get styling
  //===========================================================
  let styling = _arguments[1];
  if (t.isTSAsExpression(styling)) {
    styling = styling.expression;
  }
  if (t.isObjectExpression(styling)) {
    const stylingPath = getPathOfStyling(path);
    assert(!!stylingPath, "stylingPath should not be null", { styling, path });
    result.styling = evalStyling(stylingPath, moduleIdByName);
  } else {
    log.error("error:", "not support type", styling);
    throw new Error("not support variable as styledObject.in todo list");
  }
  return result;
};
