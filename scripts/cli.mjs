#!/usr/bin/env tsx

import { run } from "./run.mjs";
import { $ } from "zx";

run({
  async release(option) {
    const { version } = option;
    await $`git.ts login --user colliejs`;
    // await $`pnpm -r build`;
    await $`pnpm test`;
    if (version.startsWith("pre")) {
      await $`lerna version ${version}  --preid beta --conventional-commits --no-commit-hooks -y`;
      await $`pnpm -r publish --tag beta ----report-summary --no-git-checks`;
    } else {
      await $`lerna version ${version} --conventional-commits --no-commit-hooks -y`;
      await $`pnpm -r publish ----report-summary --no-git-checks`;
    }
  },
});
