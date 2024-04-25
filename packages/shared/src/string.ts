export const toCamelCase = (s: string) => s.replace(/[-_](.)/g, (_, m) => m.toUpperCase());
export const s = <T>(s: T) => `${s}`.trim();
