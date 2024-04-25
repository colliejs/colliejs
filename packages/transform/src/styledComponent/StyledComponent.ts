import * as t from "@babel/types";
import type { BaseConfig, DynamicClassNameMap, VariantsType } from "@colliejs/core";
import log from "npmlog";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { extractFromStyledObject } from "@colliejs/core";

import { NodePath } from "@babel/traverse";
import { ComponentId } from "../component/componentId";
import { Alias } from "../type";
import { ImportsByName, Stylable } from "../utils/types";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
import { StyledObjectResult } from "@colliejs/core";
import {
  CompoundVariantKeyPrefix,
  DynamicVariantKeyPrefix,
  StaticVariantKeyPrefix,
} from "@colliejs/core";
import { findLayerDeps } from "./findDeps";
import { buildArrayExpression, buildObjectExpression } from "../utils";
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
    public root: string = process.cwd(),
    getDeps = false
  ) {
    if (!isStyledComponentDecl) {
      log.error("not a styledComponentDecl", "ast", path);
      throw new Error("not a styledComponentDecl");
    }

    const { styledComponentName, dependent, styledObject } =
      parseStyledComponentDecl<Config>(path, moduleIdByName, moduleId, config);
    super(new ComponentId(moduleId, styledComponentName));

    this.styledObjectResult = extractFromStyledObject(styledObject, config);
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
  // get layerName() {
  //   return this.config.layername
  //     ? `${this.config.layername}.${super.layerName}`
  //     : super.layerName;
  // }

  getCssText() {
    let cssText = this.styledObjectResult.baseStyle.cssGenText;
    //NOTE: should make sure the order
    const keys = Object.keys(this.styledObjectResult);
    for (const key of keys) {
      if (
        key.startsWith(StaticVariantKeyPrefix) ||
        key.startsWith(DynamicVariantKeyPrefix)
      ) {
        cssText += this.styledObjectResult[key].cssGenText + "\n";
      }
    }
    for (const key of keys) {
      if (key.startsWith(CompoundVariantKeyPrefix)) {
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
    const classNamesOfStaticVariant: VariantsType["staticClassName"][] = [];
    const classNameMapOfDynamicVariant: DynamicClassNameMap = {};
    const classNamesOfCompoundVariants: VariantsType["compoundClassName"][] =
      [];
    const classNamesOfDefaultVariant: string[] = [];
    for (const key of Object.keys(this.styledObjectResult)) {
      //===========================================================
      // 1.1.static variants
      //===========================================================
      if (key.startsWith("static-variants")) {
        classNamesOfStaticVariant.push(this.styledObjectResult[key].className);
      }
      //===========================================================
      // 1.2.dynamic variants
      //===========================================================
      if (key.startsWith("dynamic-variants")) {
        const item = this.styledObjectResult[key as VariantsType["dynamicKey"]];
        classNameMapOfDynamicVariant[item.className] = {
          canAddPx: item.canAddPx,
        };
      }
      //===========================================================
      // 2.compoundVariants
      //===========================================================
      if (key.startsWith("compoundVariants")) {
        classNamesOfCompoundVariants.push(
          this.styledObjectResult[key].className
        );
      }
    }

    //===========================================================
    // 3.classnameOfbaseStyle
    //===========================================================
    let classNameOfBaseStyle = "";
    if (Object.keys(this.styledObjectResult.baseStyle.cssRawObj).length !== 0) {
      classNameOfBaseStyle = `${this.styledObjectResult.baseStyle.className}`;
    }

    //===========================================================
    // 4.classNamesOfDefaultVariant
    //===========================================================
    classNamesOfDefaultVariant.push(
      ...this.styledObjectResult["defaultVariants"].className
        .split(" ")
        .filter(Boolean)
    );

    //===========================================================
    // 5. replace styling to classNames
    //===========================================================
    const args = (this.path.node.declarations[0].init as t.CallExpression)
      .arguments;
    args.splice(1, 1); //remove styling
    args.splice(1, 0, t.stringLiteral(classNameOfBaseStyle)); //add classNameOfBaseStyle
    args.splice(2, 0, buildArrayExpression(classNamesOfStaticVariant)); //add classNameOfStaticVariant
    console.log(classNameMapOfDynamicVariant);
    args.splice(3, 0, buildObjectExpression(classNameMapOfDynamicVariant)); //add classNameMapOfDynamicVariant
    args.splice(4, 0, buildArrayExpression(classNamesOfCompoundVariants)); //add classNamesOfCompoundVariants
    args.splice(5, 0, buildArrayExpression(classNamesOfDefaultVariant)); //add classNamesOfDefaultVariant

    //5. return
    return { cssText: this.getCssText(), path: this.path };
  }
}
