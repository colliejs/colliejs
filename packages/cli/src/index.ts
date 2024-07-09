import { createTheme } from "@colliejs/core";
import { run } from "@colliejs/shared";
import { consola } from "consola";
import { prompt } from "enquirer";
import fg from "fast-glob";
import { existsSync, readJSONSync, writeJsonSync } from "fs-extra";
import path from "path";
import { extractWhen } from "./extract";
import { contentOfCollieConfigFile, contentOfStyledFile } from "./template";
import { addThemeToCssEntryFile, createThemeFile } from "./theme";
import { extractCss } from "./utils/extractCss";
import { getCssEntryFile, getCssRoot } from "./utils/fileurl";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";

const usingTs = existsSync("tsconfig.json");
const configureFile = usingTs ? "collie.config.ts" : "collie.config.js";

run({
  async init() {
    async function createConfigFile() {
      async function inputEntryfile() {
        const { entry } = await prompt<{ entry: string }>({
          type: "input",
          name: "entry",
          message: "specify the entry file",
          initial: "",
        });
        if (!existsSync(entry)) {
          consola.error("init", `entry file not found: ${entry}`);
          process.exit(1);
        }
        return entry;
      }
      const indexFiles = ["index", "entry", "main"]
        .map(e => ["ts", "tsx", "js", "jsx"].map(ee => `src/${e}.${ee}`))
        .flat();
      const existIndexFiles = indexFiles.filter(existsSync);
      let entry = "";
      if (existIndexFiles.length > 0) {
        const res = await prompt<{ entry: string }>({
          type: "select",
          name: "entry",
          message: "Which file is the entry file?",
          choices: existIndexFiles.concat("none of them"),
        });
        if (res.entry == "none of them") {
          entry = await inputEntryfile();
        } else {
          entry = res.entry;
        }
      } else {
        entry = await inputEntryfile();
      }
      writeFile(configureFile, contentOfCollieConfigFile(entry));
      consola.success(`${configureFile} created`);
    }
    async function addWatchToPackageJson() {
      const packageJson = path.resolve("package.json");
      if (!existsSync(packageJson)) {
        consola.error("init", "package.json not found");
        process.exit(1);
      }
      const json = await readJSONSync(packageJson);
      const { dev, prepare } = json.scripts || {};
      writeJsonSync(
        packageJson,
        {
          ...json,
          scripts: {
            ...json.scripts,
            dev: dev
              ? dev.includes("collie watch")
                ? dev
                : `${dev} & collie watch & wait`
              : "collie watch",
            prepare: prepare
              ? prepare.includes("collie cssgen")
                ? prepare
                : `${prepare} & npx collie cssgen & wait`
              : "npx collie cssgen",
          },
        },
        {
          spaces: 2,
        }
      );
      consola.success("watch added to package.json");
      consola.info(`
        ${usingTs ? "add collie.config.ts to ts configure file\n" : ""}.
        ==> run 'npm run dev' to start dev server
        `);
    }
    async function addConfigFileToTsConfigIfNeeded(tsconfigFile: string) {
      if (!usingTs) {
        return;
      }
      const tsconfig = path.resolve(tsconfigFile);
      if (!existsSync(tsconfig)) {
        consola.error("init", `${tsconfigFile} not found`);
        process.exit(1);
      }
      const { include, ...restJson } = await readJSONSync(tsconfig);
      writeJsonSync(
        tsconfig,
        {
          ...restJson,
          include: include
            ? include.includes(configureFile)
              ? include
              : [...include, configureFile]
            : [configureFile],
        },
        {
          spaces: 2,
        }
      );
      consola.success("collie.config.ts added to tsconfig.json");
    }

    if (!existsSync(configureFile)) {
      await createConfigFile();
    }
    const {
      build: { entry },
    } = await getConfig(path.resolve(configureFile));
    const cssEntryFile = getCssEntryFile(entry);
    writeFile(cssEntryFile, "");

    const cssRoot = path.dirname(entry);
    const styleFile = path.resolve(cssRoot, "styled.ts");

    writeFile(styleFile, contentOfStyledFile);
    writeFile(".gitignore", `${cssRoot}/.collie/\n`);
    await addWatchToPackageJson();
    if (usingTs) {
      existsSync("tsconfig.json") &&
        (await addConfigFileToTsConfigIfNeeded("tsconfig.json"));
    }
    consola.success("collie init done");
  },
  async createTheme({ config = configureFile }) {
    const {
      css: { prefix = "", theme = {} },
    } = await getConfig(path.resolve(config));
    return createTheme(prefix, theme);
  },

  async cssgen({ config = configureFile }) {
    const {
      build: { entry, include, exclude, alias, root },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    const themeFile = createThemeFile(
      getCssRoot(entry),
      cssConfig.prefix,
      cssConfig.theme
    );
    await addThemeToCssEntryFile(cssEntryFile, themeFile);

    const ignore =
      typeof exclude === "string"
        ? [exclude, "node_modules"]
        : [...exclude, "node_modules"];
    fg.globSync(include, {
      ignore: ignore,
    }).forEach(async url => {
      await extractCss(url, cssConfig, alias, root, cssEntryFile);
    });
  },
  async watch({ config = configureFile }) {
    await this.cssgen({ config });
    await extractWhen("change", { config }, url => {
      consola.info(`file changed:${url} `);
    });
  },
});
