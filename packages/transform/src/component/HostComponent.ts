import { Component } from "./Component";
import { ComponentId } from "./componentId";
import log from "npmlog";
export const REG_HOST_COMPONENT = /^[a-z]/;

export class HostComponent extends Component {
  constructor(public name: string) {
    if (!REG_HOST_COMPONENT.test(name)) {
      log.error("HostComponent",name, "is not host component", );
      throw new Error("is NOT host component");
    }
    super(new ComponentId(undefined, name));
  }
}
