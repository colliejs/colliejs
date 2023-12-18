import type {VariantsType} from './styledObject/variants/type';
export type DynamicClassNameMap = {
  [key: VariantsType["dynamicClassName"]]: { canAddPx: boolean; };
};
