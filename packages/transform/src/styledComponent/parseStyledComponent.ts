import * as t from "@babel/types";
import { ImportsByName, StyledComponentDecl } from "../utils/types";
import { evalStyling } from "../styling/evalStyling";
import {
  generate,
  getFileModuleImport,
  isStyledCallExpression,
} from "../utils/index";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { StyledComponent } from "./StyledComponent";
import log from "npmlog";
import { type Styling } from "../styling/types";
import _ from "lodash";
import { NodePath } from "@babel/traverse";
import { getNodePathOfStyling } from "./getNodePathOfStyling";

export type StyledData = {
  styledComponentName: string;
  dependent: CustomComponent | StyledComponent | HostComponent;
  styling: Styling;
};

//TODO:好像有问题，应该判断t.isAssignmentExpression(node, opts)
export const parseStyledComponentDeclaration = (
  decl: StyledComponentDecl,
  moduleIdByName: ImportsByName,
  moduleId: string,
  path: NodePath
): StyledData => {
  const result = {} as StyledData;
  const { init, id } = decl.declarations[0];
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
      const stylingPath = getNodePathOfStyling(path);
      result.styling = evalStyling(styling, moduleIdByName, stylingPath);
    } else {
      log.error("error:", "not support type", styling);
      throw new Error("not support variable as styledObject.in todo list");
    }
  }
  return result;
};
