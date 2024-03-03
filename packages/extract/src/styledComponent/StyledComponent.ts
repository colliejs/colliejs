import * as t from "@babel/types";
import type { BaseConfig } from "@colliejs/core";
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
export class StyledComponent<Config extends BaseConfig>
  extends CustomComponent
  implements Stylable
{
  StyledObjectResult: StyledObjectResult<Config>;
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

    this.StyledObjectResult = extractFromStyledObject(styledObject, config);
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
    let cssText = this.StyledObjectResult.baseStyle.cssGenText;
    //NOTE: should make sure the order
    const keys = Object.keys(this.StyledObjectResult);
    for (const key of keys) {
      if (
        key.startsWith(StaticVariantKeyPrefix) ||
        key.startsWith(DynamicVariantKeyPrefix)
      ) {
        cssText += this.StyledObjectResult[key].cssGenText + "\n";
      }
    }
    for (const key of keys) {
      if (key.startsWith(CompoundVariantKeyPrefix)) {
        cssText += this.StyledObjectResult[key].cssGenText + "\n";
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
}
