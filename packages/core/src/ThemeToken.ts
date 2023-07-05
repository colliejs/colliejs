//@ts-nocheck
import { toTailDashed } from "./utils/toTailDashed";

export class ThemeToken {
  constructor(
    private token: string,
    private value: string,
    private scale: string,
    private prefix: string
  ) {
    this.token = token == null ? "" : String(token);
    this.value = value == null ? "" : String(value);
    this.scale = scale == null ? "" : String(scale);
    this.prefix = prefix == null ? "" : String(prefix);
  }

  get computedValue() {
    return "var(" + this.variable + ")";
  }

  get variable() {
    return (
      "--" + toTailDashed(this.prefix) + toTailDashed(this.scale) + this.token
    );
  }

  toString() {
    return this.computedValue;
  }
}
