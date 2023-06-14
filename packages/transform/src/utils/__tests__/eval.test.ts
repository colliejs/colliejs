import * as t from '@babel/types';
import { evalAst } from '../eval';
import {
  buildObjectExpression
} from '../buildObjectExpression';

describe('test cases', () => {
  it('object ', () => {
    const exp = buildObjectExpression({ a: 2 });
    const x = evalAst(exp);
    expect(x).toEqual({ a: 2 });
  });
  it('number ', () => {
    const exp = t.numericLiteral(2);
    const x = evalAst(exp);
    expect(x).toEqual(2);
  });
  it('string ', () => {
    const exp = t.stringLiteral('a')
    const x = evalAst(exp);
    expect(x).toEqual('a');
  });
});
