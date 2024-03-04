import log from "npmlog";

export const evalExpText = (code: string, context: object = {}) => {
  const body = `return ${code};`;
  try {
    return new Function(...Object.keys(context), body)(
      ...Object.values(context)
    );
  } catch (e) {
    log.error("eval", "source code=", code);
    log.error("eval", "context=", context);
    throw e;
  }
};
