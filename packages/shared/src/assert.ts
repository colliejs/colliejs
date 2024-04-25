export const assert: (condition: boolean, message?: string, extra?: any) => asserts condition = (
    condition: boolean,
    message = "Something went wrong",
    extra?: any
  ): asserts condition => {
    if (!condition) {
      extra && console.warn("extra info=>", extra);
      throw new Error(`${message}`);
    }
  };
  