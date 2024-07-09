import log from "consola";

export function evalExpText(code: string, context: object = {}) {
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
}
