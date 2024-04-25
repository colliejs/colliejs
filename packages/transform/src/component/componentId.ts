import path from "node:path";
import { toCamelCase, toHash } from "@colliejs/shared";;
//===========================================================
// ComponentId通过moduleId 和 componentName来定位一个StyledComponent和CustomComponent.
// HostComponent不需要定位
//===========================================================

export class ComponentId {
  constructor(public moduleId: string, public componentName: string) {}
  static make(moduleId: string, componentName: string) {
    return new ComponentId(moduleId, componentName);
  }
  toString() {
    if (this.moduleId) {
      return `${this.moduleId}-${this.componentName}`;
    }
    return this.componentName;
  }
  toHash() {
    return toHash(this.toString());
  }

  //===========================================================
  // Button.tsx-Button-xxxx
  //===========================================================
  get uniqName() {
    const baseName = toCamelCase(
      path.basename(this.moduleId || "").replace(/\./g, "-")
    );
    return `${baseName}-${this.componentName}-${this.toHash()}`;
  }

  isEqual(componentId: ComponentId) {
    return this.toString() === componentId.toString();
  }
}
