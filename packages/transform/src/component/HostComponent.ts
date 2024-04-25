import { Component } from "./Component";
import { ComponentId } from "./componentId";
import log from "npmlog";
export const REG_HOST_COMPONENT = /^[a-z]/;

/**
 * host component has no layer name
 */
export class HostComponent extends Component {
  constructor(componentId: ComponentId) {
    if (!REG_HOST_COMPONENT.test(componentId.componentName)) {
      log.error(
        "HostComponent",
        componentId.componentName,
        "is not host component"
      );
      throw new Error("is NOT host component");
    }
    super(componentId);
  }
}
