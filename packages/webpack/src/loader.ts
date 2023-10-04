import { transform } from "@colliejs/transform";
import { urlToRequest } from "loader-utils";

const schema = {
  type: "object",
  properties: {
    test: {
      type: "string",
    },
  },
};
/**
 * 
 * @param code   styledConfig?: Config;
  alias?: Alias;
  root?: string;

 * @returns 
 */

export function collieWebpackLoader(code: string) {
  const options = this.getOptions();
  const { styledConfig, alias, root } = options;

  const url = urlToRequest(this.resourcePath);
  console.log("===>url", url);
  let { code: transformedCode } = transform(
    code,
    url,
    styledConfig,
    alias,
    root
  );

  return transformedCode;
}

