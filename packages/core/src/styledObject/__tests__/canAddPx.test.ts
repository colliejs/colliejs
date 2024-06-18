import { config } from "../../cssObject/__tests__/stub/config";
import { canAddPx } from "../canAddPx";
import { describe, it ,expect} from "vitest";

describe("canRemovePx", () => {
  it("lineHeight ", () => {
    const obj = {
      lineHeight: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(false);
  });
  it("flexGrow ", () => {
    const obj = {
      flexGrow: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(false);
  });
  it("width ", () => {
    const obj = {
      width: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(true);
  });
  it("w ", () => {
    const obj = {
      w: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(true);
  });
  it("_after ", () => {
    const obj = {
      _after: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(false);
  });
  it("borderRadius ", () => {
    const obj = {
      borderRadius: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, config)).toBe(true);
  });
});
