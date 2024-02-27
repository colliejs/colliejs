import { defaultConfig } from "@colliejs/config";
import { canAddPx } from "../canAddPx";

describe("canRemovePx", () => {
  it("lineHeight ", () => {
    const obj = {
      lineHeight: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(false);
  });
  it("flexGrow ", () => {
    const obj = {
      flexGrow: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(false);
  });
  it("width ", () => {
    const obj = {
      width: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(true);
  });
  it("w ", () => {
    const obj = {
      w: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(true);
  });
  it("_after ", () => {
    const obj = {
      _after: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(false);
  });
  it("borderRadius ", () => {
    const obj = {
      borderRadius: ["var(--variants-)"],
    } as any;
    expect(canAddPx(obj, defaultConfig)).toBe(true);
  });
});
