import { FONT_REG, IMG_REG, VIDEO_REG } from "./../const";
import { getName } from "./getName";
import * as t from "@babel/types";
import path from "path";
import fs, { existsSync } from "node:fs";
import resolve from "resolve";
import log from "npmlog";
import { Alias, ImportsByName } from "./types";
import { createRequire } from "module";
import { assert } from "@c3/utils";
import { PathLike } from "fs";
//@ts-ignore
if (!global.__JEST__) {
  global.require = global.require || createRequire(import.meta.url);
}

export const getImportDeclarations = (ast: t.Program) => {
  const importDecls: t.ImportDeclaration[] = [];
  ast.body.forEach(node => {
    if (t.isImportDeclaration(node)) {
      importDecls.push(node);
    }
  });
  return importDecls;
};
const isRelative = (path: string) =>
  path.startsWith("./") || path.startsWith("../");
const isAbs = (path: string) => path.startsWith("/");
const isFile = (file: PathLike) =>
  existsSync(file) && fs.statSync(file).isFile();

const getFileFromRelativePath = (file: string, extension: string[]) => {
  if (isFile(file)) {
    return file;
  }
  for (const ex of extension) {
    assert(ex.startsWith("."), "extension must start with .");
    const file1 = file + ex;
    if (isFile(file1)) {
      return file1;
    }
  }
};
const getFileFromAbsPath = (
  moduleId: string,
  extension: string[],
  root = process.cwd()
) => {
  assert(moduleId.startsWith("/"), "absolute path must start with /");
  if (isFile(moduleId)) {
    return moduleId;
  }
  for (const ex of extension) {
    assert(ex.startsWith("."), "extension must start with .");
    // absolute path of whole filesystem
    const file1 = moduleId + ex;
    if (isFile(file1)) {
      return file1;
    }
    const file2 = path.join(root, moduleId) + ex;
    if (isFile(file2)) {
      return file2;
    }
  }
  log.error("MODULE NOT FOUND", "moduleId=%s,root=%s", moduleId, root);
  // return moduleId;
  throw new Error("MODULE NOT FOUND");
};

/**
 * NOTE：如果moduleId的后缀是没有指定的。这里有可能会出错。应该去坚持并自动补齐后缀
 * @param importDecl
 * @param modulePath
 * @returns
 */
const doImportDecl = (
  importDecl: t.ImportDeclaration,
  modulePath: string,
  alias: Alias,
  extensions: string[],
  root: string
) => {
  const ModuleIdByName: ImportsByName = {};
  const matches = Object.keys(alias);
  let moduleId = importDecl.source.value;
  matches.forEach(match => {
    if (moduleId.startsWith(match)) {
      const reg = new RegExp(`^${match}`);
      moduleId = moduleId.replace(reg, alias[match]);
    }
  });

  try {
    if (isRelative(moduleId)) {
      //there is Bug if using require.resolve
      moduleId = getFileFromRelativePath(
        path.resolve(modulePath, moduleId),
        extensions
      );
    } else if (isAbs(moduleId)) {
      moduleId = getFileFromAbsPath(moduleId, extensions, root);
    } else {
      moduleId = require.resolve(moduleId, { paths: [modulePath] });
    }
  } catch (e) {
    console.log(e.message);
    log.error(
      "resolve",
      "resolve.sync:moduleId=%s,path=%s",
      moduleId,
      modulePath
    );
  }

  importDecl.specifiers.forEach(specifier => {
    switch (specifier.type) {
      case "ImportDefaultSpecifier":
        ModuleIdByName[specifier.local.name] = {
          moduleId,
          importedName: "default",
        };
        break;
      case "ImportNamespaceSpecifier":
        ModuleIdByName[specifier.local.name] = {
          moduleId,
          importedName: "*",
        };
        break;
      case "ImportSpecifier":
        ModuleIdByName[specifier.local.name] = {
          moduleId,
          importedName: getName(specifier.imported) || specifier.local.name,
        };
        break;
    }
  });
  return ModuleIdByName;
};
const cwd = process.cwd();
export const getImports = (
  program: t.Program,
  modulePath: string,
  alias: Alias = {},
  root = cwd,
  extensions: string[] = [".tsx", ".ts", ".js", ".jsx", ".cjs", ".mjs"]
) => {
  const ModuleIdByName: ImportsByName = {};
  const importDecls = getImportDeclarations(program);
  importDecls.forEach(decl => {
    const res = doImportDecl(decl, modulePath, alias, extensions, root);
    Object.assign(ModuleIdByName, res);
  });
  return ModuleIdByName;
};

//===========================================================
// getImageImports
//===========================================================

export const getFileModuleImport = (imports: ImportsByName) => {
  const imgPair = Object.entries(imports)
    .filter(([key, value]) => {
      return (
        IMG_REG.test(value.moduleId) ||
        VIDEO_REG.test(value.moduleId) ||
        FONT_REG.test(value.moduleId)
      );
    })
    .map(([key, value]) => {
      return [key, value.moduleId];
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any);
  return imgPair;
};
