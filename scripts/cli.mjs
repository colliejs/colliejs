#!/usr/bin/env tsx

import { run } from "@scriptbot/cli";
import { $ } from "zx";

run({
  async release(option) {
    const { semver = "patch" } = option;
    
    await $`git.ts login --user colliejs`;
    await $`pnpm test`;
    await $`git add .`;
    await $`git commit -m "chore: release"`;

    await $`lerna version ${semver} --conventional-commits --no-commit-hooks -y`;

    //exec pnpm -r build firstly
    await $`pnpm -r publish ----report-summary`;
  },
});
