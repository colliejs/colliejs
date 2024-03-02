import { Component } from "./Component";
import { ComponentId } from "./componentId";

/**
 * 第三方组件的css的优先级通过@import xxx @layer(a.b.c)来降低其优先级，从而不会冲突
 *  custom component can be a styled component
 */
class CustomComponent extends Component {
  constructor(public componentId: ComponentId) {
    super(componentId);
  }
  get layerName() {
    return this.id.uniqName;
  }
}

export default CustomComponent;
