import { defaultConfig } from '../config';
import { convertCssObjToMediaQuery } from '../css';
import { CSSPropertiesComplex } from '../type';

describe('convertCssObjToMediaQuery', () => {
  it('should work ', () => {
    const cssObj: any = {
      width: [10, 20],
      height: 20,
    };
    const res = convertCssObjToMediaQuery(cssObj, defaultConfig.breakpoints!);
    expect(res).toMatchInlineSnapshot(`
      {
        "@media (max-width:767.9999px)": {
          "width": 10,
        },
        "@media (min-width:768px)": {
          "width": 20,
        },
        "height": 20,
      }
    `);
  });
  it('should work ', () => {
    const cssObj = {
      width: [10, 20],
      '& > span': {
        width: [10, 20],
        '@media (support:xxx)': { width: [10, 20] },
      },
    } as unknown as CSSPropertiesComplex;
    const res = convertCssObjToMediaQuery(cssObj, defaultConfig.breakpoints!);
    expect(res).toMatchInlineSnapshot(`
      {
        "& > span": {
          "@media (max-width:767.9999px)": {
            "width": 10,
          },
          "@media (min-width:768px)": {
            "width": 20,
          },
          "@media (support:xxx)": {
            "@media (max-width:767.9999px)": {
              "width": 10,
            },
            "@media (min-width:768px)": {
              "width": 20,
            },
          },
        },
        "@media (max-width:767.9999px)": {
          "width": 10,
        },
        "@media (min-width:768px)": {
          "width": 20,
        },
      }
    `);
  });
});
