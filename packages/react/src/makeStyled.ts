import type { CSSObject, StyledObject } from "@colliejs/core";
import {
  extractFromStyledObject,
  getVariantResultByProp,
  getVariantKeyTypeByProp,
  type BaseConfig,
} from "@colliejs/core";
import _ from "lodash";
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { Styled } from "./types";
import {
  getCSSValue,
  getCSSVariable,
  isPlainObject,
  isString,
  toArray,
} from "./utils";

export type BaseStyledComponentProps<Config extends BaseConfig> = {
  className?: string; //static variants
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties & { [x: string]: any }; //dynamic variants
  ref?: any;
  css?: CSSObject<Config>;
};

export const makeStyled = <Config extends BaseConfig>(config: Config) => {
  return function styled<P1 extends BaseStyledComponentProps<Config>, T = any>(
    component: ElementType<P1>,
    styledObject: StyledObject<Config>,
    propsOfBaseComponent: React.ComponentProps<any> = {}
  ) {
    const result = extractFromStyledObject(styledObject, config);
    const render: ForwardRefRenderFunction<T, P1> = (props, ref) => {
      const { className, style = {}, as, ...restProps } = props;
      let outputClassNames: string[] = [
        result.baseStyle.className,
        className || "",
      ];

      const unknownProps = {} as Record<string, any>;
      const staticProps = {} as Record<string, any>;
      const dynamicProps = {} as Record<string, any>;
      //===========================================================
      // 1.static and dynamic variants
      //===========================================================
      let kvs = Object.entries(restProps);
      for (const [prop, valOfProp] of kvs) {
        const varientKeyType = getVariantKeyTypeByProp(prop, valOfProp, result);
        const variantResult = getVariantResultByProp(prop, valOfProp, result);
        function appendMixinIfNeeded() {
          const mixins = variantResult?.cssRawObj?.mixins || [];
          const hasMixin = mixins.length > 0;
          if (!hasMixin) {
            return;
          }
          mixins.forEach((e: string) => {
            const [k, v] = e.split(".");
            const collisionIdx = kvs.findIndex(([k1]) => k1 === k);
            if (collisionIdx >= 0) {
              console.error("Object.entities(props)", JSON.stringify(kvs));
              console.error("mixins", mixins);
              //TODO: 
              throw new Error(
                `[error]:style collision for mixin ${e} and props ${kvs[
                  collisionIdx
                ].join("=")}`
              );
            }
            kvs.push([k, v]);
          });
        }

        switch (varientKeyType) {
          case "unknown":
            unknownProps[prop] = valOfProp;
            continue;
          case "static":
            outputClassNames.push(variantResult.className);
            staticProps[prop] = valOfProp;
            appendMixinIfNeeded();
            if (isPlainObject(valOfProp)) {
              throw new Error(
                `invalid value ${valOfProp} for static variant ${prop} `
              );
            }
            break;
          case "dynamic":
            outputClassNames.push(variantResult.className);
            appendMixinIfNeeded();
            dynamicProps[prop] = valOfProp;
            const canAddPx = !!variantResult.canAddPx;
            if ((config.breakpoints?.length || 0) > 0) {
              const newValueOfProp = toArray(valOfProp);
              config.breakpoints?.forEach((e, idx) => {
                style[getCSSVariable(prop, e)] = getCSSValue(
                  newValueOfProp[idx] ??
                    newValueOfProp[newValueOfProp.length - 1],
                  canAddPx
                );
              });
            } else {
              if (Array.isArray(valOfProp)) {
                throw new Error(
                  "can not use array as dynamic variant value when breakpoints is empty"
                );
              }
              style[getCSSVariable(prop)] = getCSSValue(valOfProp, canAddPx);
            }
            break;
          default:
            throw new Error("impossible");
        }
      }
      //===========================================================
      // 2.default variants
      //===========================================================
      outputClassNames.push(
        result.defaultVariants
          .getClassName(Object.keys({ ...staticProps, ...dynamicProps }))
          .join(" ")
      );

      //===========================================================
      // finally got forwardProps
      //===========================================================
      const forwardProps = {
        className: _.uniq(outputClassNames).join(" "),
        ref,
        style: Object.keys(style).length === 0 ? undefined : style,
        ...propsOfBaseComponent,
        ...unknownProps,
      };

      //===========================================================
      //  创建一个带classname的组件
      //===========================================================
      const nAs = as || propsOfBaseComponent.as;
      //@ts-ignore
      const isStyledComponent = !!component.__isStyledComponent;
      const isHostComponent = isString(component) && !component.includes("-");
      const isWebComponent = isString(component) && component.includes("-");
      const is3rdComponent = !isHostComponent && !isStyledComponent;
      const isAsWebComponent = isString(nAs) && nAs.includes("-");

      if (isStyledComponent || is3rdComponent) {
        return React.createElement(component, {
          ...forwardProps,
          as: as || propsOfBaseComponent.as,
        });
      }
      if (isWebComponent || (isHostComponent && isAsWebComponent)) {
        return React.createElement(nAs || component, {
          ..._.omit(forwardProps, ["className", "as"]),
          class: forwardProps.className,
        });
      }
      if (isHostComponent) {
        if (isAsWebComponent) {
          throw new Error(`impossible react type: ${component} as ${nAs}`);
        }
        return React.createElement(
          nAs || component,
          _.omit(forwardProps, "as")
        );
      }

      throw new Error("impossible react type");
    };
    const StyledComponent = React.forwardRef(render);
    StyledComponent.displayName =
      typeof component === "string"
        ? component
        : component.displayName || "StyledComponent";

    //@ts-ignore
    StyledComponent.__isStyledComponent = true;
    return React.memo(StyledComponent);
  } as unknown as Styled<Config>;
};
