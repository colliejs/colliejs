import { REG_HOST_COMPONENT } from "./HostComponent";
import { toHash } from "@border-collie-js/core";
import path from "node:path";

declare const __DEV__: boolean;
export class ComponentId {
  constructor(
    public moduleId: string | undefined,
    public componentName: string
  ) {}
  toString() {
    if (this.moduleId) {
      return `${this.moduleId}-${this.componentName}`;
    }
    return this.componentName;
  }
  toHash() {
    return toHash({ path: this.toString() });
  }

  get displayName() {
    if (REG_HOST_COMPONENT.test(this.componentName)) {
      return `${this.componentName}`;
    }
    return `${path.basename(this.moduleId || "").replace(/\./g, "_")}-${
      this.componentName
    }-${this.toHash()}`;
  }
  isEqual(componentId: ComponentId) {
    return this.toString() === componentId.toString();
  }
}
