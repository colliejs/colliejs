import * as t from "@babel/types";
import type { BaseConfig } from "@colliejs/core";
import log from "npmlog";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { convertStyledObject } from "@colliejs/core";

import { NodePath } from "@babel/traverse";
import { ComponentId } from "../component/componentId";
import { Alias } from "../type";
import { ImportsByName, Stylable } from "../utils/types";
import { findLayerDeps } from "./findDeps";
import { isStyledComponentDecl } from "./isStyledCompDelc";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
import { StyledObjectResult } from "@colliejs/core";
import {
  CompoundVariantKeyPrefix,
  DynamicVariantKeyPrefix,
  StaticVariantKeyPrefix,
} from "@colliejs/core";

export class StyledComponent<Config extends BaseConfig>
  extends CustomComponent
  implements Stylable
{
  StyledObjectResult: StyledObjectResult<Config>;
  dependent: CustomComponent | HostComponent;
  layerDeps: string[];

  constructor(
    public path: NodePath<t.VariableDeclaration>,
    moduleId: string,
    moduleIdByName: ImportsByName,
    public config: Config,
    alias: Alias = {},
    root: string = process.cwd(),
    getDeps = false
  ) {
    if (!isStyledComponentDecl) {
      log.error("not a styledComponentDecl", "ast", path);
      throw new Error("not a styledComponentDecl");
    }

    const {
      styledComponentName,
      dependent,
      styledObject: styling,
    } = parseStyledComponentDecl<Config>(
      path,
      moduleIdByName,
      moduleId,
      config
    );
    super(new ComponentId(moduleId, styledComponentName));

    this.StyledObjectResult = convertStyledObject(
      styling,
      config,
      styledComponentName
    );
    this.dependent = dependent;
    if (getDeps) {
      this.layerDeps = findLayerDeps(this, alias, root, config);
    }
  }

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
