import { ComponentId } from "./componentId";

export abstract class Component {
  constructor(public id: ComponentId) {}
  unqiName() {
    return this.id.uniqName;
  }
}
