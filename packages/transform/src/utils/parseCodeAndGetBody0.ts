import { parse } from '@babel/parser';

export function parseCodeAndGetBodyN(x: string, n = 0) {
  return parse(x, {
    allowReturnOutsideFunction: true,
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  }).program.body[n] as any;
}
