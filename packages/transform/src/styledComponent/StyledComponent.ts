import * as t from "@babel/types";
import type { BaseConfig } from "@colliejs/core";
import { extractFromStyledObject } from "@colliejs/core";
import log from "npmlog";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";

import { NodePath } from "@babel/traverse";
import {
  StyledObjectResult,VariantKeyPrefix
} from "@colliejs/core";
import { ComponentId } from "../component/componentId";
import { Alias } from "../type";
import { ImportsByName, Stylable } from "../utils/types";
import { findLayerDeps } from "./findDeps";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
export class StyledComponent<Config extends BaseConfig>
  extends CustomComponent
  implements Stylable
{
  styledObjectResult: StyledObjectResult<Config>;
  dependent: CustomComponent | HostComponent;

  constructor(
    public path: NodePath<t.VariableDeclaration>,
    moduleId: string,
    moduleIdByName: ImportsByName,
    public config: Config,
    public alias: Alias = {},
    public root: string = process.cwd()
  ) {
    if (!isStyledComponentDecl) {
      log.error("not a styledComponentDecl", "ast", path);
      throw new Error("not a styledComponentDecl");
    }

    const { styledComponentName, dependent, styledObject } =
      parseStyledComponentDecl<Config>(path, moduleIdByName, moduleId, config);
    super(new ComponentId(moduleId, styledComponentName));

    this.styledObjectResult = extractFromStyledObject(
      styledObject,
      config
      // styledComponentName
    );
    this.dependent = dependent;
  }
  get layerDeps() {
    return findLayerDeps(this, this.alias, this.root, this.config);
  }

  get directLayerDep() {
    if (this.dependent instanceof CustomComponent) {
      return this.dependent.layerName;
    }

    return "";
  }

  getCssText() {
    let cssText = this.styledObjectResult.baseStyle.cssGenText;
    const keys = Object.keys(this.styledObjectResult);
    for (const key of keys) {
      if (key.startsWith(VariantKeyPrefix)) {
        cssText += this.styledObjectResult[key].cssGenText + "\n";
      }
    }

    const thisLayerName = this.config.layername
      ? `${this.config.layername}.${this.layerName}`
      : this.layerName;

    if (this.dependent instanceof CustomComponent) {
      return `
      @layer ${this.layerDeps
        .reverse()
        .map(e => (this.config.layername ? `${this.config.layername}.${e}` : e))
        .join(",")}, ${thisLayerName};
      @layer ${thisLayerName} {
        ${cssText}
      }\n`;
    }
    return `@layer ${thisLayerName} {${cssText}}\n`;
  }
  /**
   * @description
   * @example
   * change ```javascript
   *  const StyledButton = styled(button,{color:'red'},option)
   * ```
   *
   *  变为
   *  const StyledButton = styled(
   *    button,
   *    __classNameOfBaseStyle，
   *    __classNameOfStaticVariant:string[],
   *    __classNameOfDynamicVariant:Record<string, {canAddPx:boolean}>,
   *    __classNameOfCompoundVariants:string[]，
   *    __classNameOfDefaultVariant:string[],
   *    option
   * )
   */
  transform() {
    throw new Error("Method not implemented.");
    //   const {
    //     classNameOfBaseStyle,
    //     classNamesOfStaticVariant,
    //     classNameMapOfDynamicVariant,
    //     classNamesOfCompoundVariants,
    //     classNamesOfDefaultVariant,
    //   } = getClassNamesOfStyledObject(this.styledObjectResult);

    //   //===========================================================
    //   // 5. replace styling to classNames
    //   //===========================================================
    //   const args = (this.path.node.declarations[0].init as t.CallExpression)
    //     .arguments;
    //   args.splice(1, 1); //remove styling
    //   args.splice(1, 0, t.stringLiteral(classNameOfBaseStyle)); //add classNameOfBaseStyle
    //   args.splice(2, 0, buildArrayExpression(classNamesOfStaticVariant)); //add classNameOfStaticVariant
    //   console.log(classNameMapOfDynamicVariant);
    //   args.splice(3, 0, buildObjectExpression(classNameMapOfDynamicVariant)); //add classNameMapOfDynamicVariant
    //   args.splice(4, 0, buildArrayExpression(classNamesOfCompoundVariants)); //add classNamesOfCompoundVariants
    //   args.splice(5, 0, buildArrayExpression(classNamesOfDefaultVariant)); //add classNamesOfDefaultVariant
    // }
  }
}
