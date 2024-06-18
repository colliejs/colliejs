//for vite
export default function () {
  return {
    testFramework: {
      type: "vitest",
      configFile: "./vitest.workspace.ts",
    },
    autoDetect: true,
    trace: true,
    env: {
      type: "node",
    },
  };
}
