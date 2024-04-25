import { CSS, CSSProperties } from "../types";

/**
 * @description
 * Object syntax for defining a value of css property.
 * @param propertyName: "width"
 * @param value: { "@phone": 10, "@pad": 20 }
 * @returns :{'@phone':{width:10},'@pad':{width:20}}
 */
export const objectSyntax = (
  propertyName: string,
  value: { [key: `@${string}`]: any }
) => {
  const res = {} as { [key: `@${string}`]: any };
  const conditions = Object.keys(value);
  conditions.forEach(condition => {
    res[condition] = { [propertyName]: value[condition] };
  });
  return res;
};

export const isObjectSyntax = (value: any) => {
  return (
    typeof value === "object" &&
    value &&
    Object.keys(value).every(key => key.startsWith("@"))
  );
};
