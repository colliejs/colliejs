import { BaseConfig } from "../type";
import { DynamicClassNameMap, StyledObjectResult } from "./types";
import { VariantsType } from "./variants/type";

export const getClassOfStyledObject = <T extends BaseConfig>(
  styledObjectResult: StyledObjectResult<T>
) => {
  const classNamesOfStaticVariant: VariantsType["staticClassName"][] = [];
  const classNameMapOfDynamicVariant: DynamicClassNameMap = {};
  const classNamesOfCompoundVariants: VariantsType["compoundClassName"][] = [];
  const classNamesOfDefaultVariant: string[] = [];
  for (const key of Object.keys(styledObjectResult)) {
    //===========================================================
    // 1.1.static variants
    //===========================================================
    if (key.startsWith("static-variants")) {
      classNamesOfStaticVariant.push(styledObjectResult[key].className);
    }
    //===========================================================
    // 1.2.dynamic variants
    //===========================================================
    if (key.startsWith("dynamic-variants")) {
      const item = styledObjectResult[key as VariantsType["dynamicKey"]];
      classNameMapOfDynamicVariant[item.className] = {
        canAddPx: item.canAddPx,
      };
    }
    //===========================================================
    // 2.compoundVariants
    //===========================================================
    if (key.startsWith("compoundVariants")) {
      classNamesOfCompoundVariants.push(styledObjectResult[key].className);
    }
  }

  //===========================================================
  // 3.classnameOfbaseStyle
  //===========================================================
  let classNameOfBaseStyle = "";
  if (Object.keys(styledObjectResult.baseStyle.cssRawObj).length !== 0) {
    classNameOfBaseStyle = `${styledObjectResult.baseStyle.className}`;
  }

  //===========================================================
  // 4.classNamesOfDefaultVariant
  //===========================================================
  classNamesOfDefaultVariant.push(
    ...styledObjectResult["defaultVariants"].className
      .split(" ")
      .filter(Boolean)
  );
  return {
    classNamesOfStaticVariant,
    classNameMapOfDynamicVariant,
    classNamesOfCompoundVariants,
    classNamesOfDefaultVariant,
    classNameOfBaseStyle,
  };
};
