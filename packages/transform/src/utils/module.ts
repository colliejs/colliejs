import _generate from '@babel/generator';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';

const traverse: typeof _traverse =
  //@ts-ignore
  _traverse.default?.default || _traverse.default || _traverse;

const generate: typeof _generate =
  //@ts-ignore
  _generate.default?.default || _generate.default || _generate;

export { traverse, generate };
