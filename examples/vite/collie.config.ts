import { BaseConfig } from "@colliejs/core";
import { defaultConfig } from "@colliejs/react";
export const collieConfig = {
  ...defaultConfig,
  breakpoints: [320, 768],
  theme: {
    colors: {
      white01: "rgba(255,255,255,0.1)",
      white02: "rgba(255,255,255,0.2)",
      white03: "rgba(255,255,255,0.3)",
      white04: "rgba(255,255,255,0.4)",
      white05: "rgba(255,255,255,0.5)",
      white06: "rgba(255,255,255,0.6)",
      white07: "rgba(255,255,255,0.7)",
      white08: "rgba(255,255,255,0.8)",
      white09: "rgba(255,255,255,0.9)",
      black01: "rgba(0,0,0,0.1)",
      black02: "rgba(0,0,0,0.2)",
      black03: "rgba(0,0,0,0.3)",
      black04: "rgba(0,0,0,0.4)",
      black05: "rgba(0,0,0,0.5)",
      black06: "rgba(0,0,0,0.6)",
      black07: "rgba(0,0,0,0.7)",
      black08: "rgba(0,0,0,0.8)",
      black09: "rgba(0,0,0,0.9)",
    },
    shadows: {
      "box-shadow-xs": "0 4px 6px -4px rgb(0 0 0 / 10%)",
      "box-shadow-small": "0 4px 8px rgb(0 0 0 / 20%)",
      "box-shadow-medium": "0 6px 20px rgb(0 0 0 / 20%)",
      "box-shadow-large": "0 15px 50px rgb(0 0 0 / 30%)",
    },

    fonts: {
      //===========================================================
      // font family
      //===========================================================
      "font-family":
        "Figtree,Roboto,Rubik,Noto Kufi Arabic,Noto Sans JP,sans-serif",
      "title-font-family":
        "Poppins,Roboto,Rubik,Noto Kufi Arabic,Noto Sans JP,sans-serif",

      "smoothing-webkit": "antialiased",
      "smoothing-moz": "grayscale",
      //===========================================================
      // font-weight
      //===========================================================
      "weight-very-light": 200,
      "weight-light": 300,
      "weight-normal": 400,
      "weight-bold": 500,
      //===========================================================
      // font-size
      //===========================================================
      "size-10": "14px",
      "size-20": "14px",
      "size-30": "16px",
      "size-40": "18px",
      "size-50": "24px",
      "size-60": "30px",
      "line-height-10": "18px",
      "line-height-20": "24px",
      "line-height-30": "24px",
      "line-height-40": "24px",
      "line-height-50": "32px",
      "line-height-60": "42px",
    },

    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "20px",
      5: "24px",
      6: "32px",
      7: "48px",
      8: "64px",
      9: "80px",
      xs: "4px",
      small: "8px",
      medium: "16px",
      large: "24px",
      xl: "32px",
      xxl: "48px",
      xxxl: "64px",
    },
    sizes: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "20px",
      5: "24px",
      6: "32px",
      7: "48px",
      8: "64px",
      9: "80px",
    },
    fontSizes: {
      1: "12px",
      2: "13px",
      3: "15px",
      4: "17px",
      5: "19px",
      6: "21px",
      7: "27px",
      8: "35px",
      9: "59px",
      "size-10": "14px",
      "size-20": "14px",
      "size-30": "16px",
      "size-40": "18px",
      "size-50": "24px",
      "size-60": "30px",
    },
    //radius
    radii: {
      1: "4px",
      2: "6px",
      3: "8px",
      4: "12px",
      round: "50%",
      pill: "9999px",
      //=========//
      small: "4px",
      medium: "8px",
      big: "16px",
    },
    zIndices: {
      1: "100",
      2: "200",
      3: "300",
      4: "400",
      max: "999",
    },
  },
} as const satisfies BaseConfig;
