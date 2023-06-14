import { Component } from './Component';
import { ComponentId } from './componentId';

class CustomComponent extends Component {
  constructor(public moduleId: string, public componentName: string) {
    super(new ComponentId(moduleId, componentName));
  }
}

export default CustomComponent;
