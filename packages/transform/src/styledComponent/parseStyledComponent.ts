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

export type StyledData = {
  styledComponentName: string;
  dependent: CustomComponent | StyledComponent | HostComponent;
  styling: Styling;
};

//TODO: multiple declarator
export const parseStyledComponentDeclaration = (
  decl: StyledComponentDecl,
  moduleIdByName: ImportsByName,
  moduleId: string,
  path: NodePath<t.VariableDeclaration>
): StyledData => {
  const result = {} as StyledData;
  const { init, id } = decl.declarations[0]; ////TODO: multiple declarator
  if (init && isStyledCallExpression(init)) {
    const { arguments: _arguments } = init;

    //===========================================================
    // 1. parse component name
    //===========================================================
    if (t.isIdentifier(id)) {
      result.styledComponentName = id.name;
    } else {
      log.error("parseStyledComponentDeclaration", "id=", id);
      throw new Error("not support");
    }

    //===========================================================
    // 2. parse component type
    //===========================================================
    let exp = _arguments[0];
    let type = exp.type;
    if (_.isObject(exp) && t.isTSAsExpression(exp)) {
      exp = (exp as t.TSAsExpression).expression;
      type = exp.type;
    }
    switch (type) {
      case "StringLiteral":
        result.dependent = new HostComponent((exp as t.StringLiteral).value);
        break;
      case "Identifier":
        //NOTE:默认认为是一个customeComponent.如果是一个styledComponent，
        //那么会在后期被替换为styledComponent
        const componentName = (exp as t.Identifier).name;
        result.dependent = new CustomComponent(
          moduleIdByName[componentName]?.moduleId || moduleId,
          componentName
        );
        break;
      default:
        log.error(
          "Unknown element type,use Identifier",
          generate(decl).code,
          "type",
          type
        );
        throw new Error("Unknown element type");
    }

    //===========================================================
    // 3.parse styledObject
    //===========================================================
    let styling = _arguments[1];
    if (t.isTSAsExpression(styling)) {
      styling = styling.expression;
    }
    if (t.isObjectExpression(styling)) {
      const stylingPath = getPathOfStyling(path);
      assert(!!stylingPath);
      result.styling = evalStyling(stylingPath,moduleIdByName);
    } else {
      log.error("error:", "not support type", styling);
      throw new Error("not support variable as styledObject.in todo list");
    }
  }
  return result;
};
