import { FONT_REG, IMG_REG, VIDEO_REG } from "../const";
import { getName } from "./getName";
import * as t from "@babel/types";
import path from "path";
import fs, { existsSync } from "node:fs";
import resolve from "resolve";
import log from "npmlog";
import { ImportsByName } from "./types";
import { createRequire } from "module";
import { assert } from "@colliejs/shared";
import { PathLike } from "fs";
import { Alias } from "../type";
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
  path.startsWith(".") || path.startsWith("..");
const isAbs = (path: string) => path.startsWith("/");
const isFile = (file: PathLike) =>
  existsSync(file) && fs.statSync(file).isFile();
const isDir = (file: PathLike) =>
  existsSync(file) && fs.statSync(file).isDirectory();

const getIndex = (path: PathLike, ext: string) => {
  // assert(isDir(path), "path must be a dir");
  if (!isDir(path)) {
    return;
  }
  const file = `${path}/index${ext}`;
  if (isFile(file)) {
    return file;
  }
};

const getFileFromRelativePath = (absPath: string, exts: string[]) => {
  if (isFile(absPath)) {
    return absPath;
  }

  for (const ex of exts) {
    assert(ex.startsWith("."), "extension must start with .");
    const file1 = absPath + ex;
    if (isFile(file1)) {
      return file1;
    }

    const file2 = getIndex(absPath, ex);
    if (isDir(absPath) && file2) {
      return file2;
    }
  }
  log.error("MODULE NOT FOUND", "moduleId=%s", absPath, exts);
  throw new Error("MODULE NOT FOUND");
};
const getFileFromAbsPath = (
  pathLike: string,
  extension: string[],
  root = process.cwd()
) => {
  assert(pathLike.startsWith("/"), "absolute path must start with /");
  if (isFile(pathLike)) {
    return pathLike;
  }

  for (const ex of extension) {
    assert(ex.startsWith("."), "extension must start with .");
    // absolute path of whole filesystem
    const file1 = pathLike + ex;
    if (isFile(file1)) {
      return file1;
    }

    const prefix = path.join(root, pathLike);
    const file2 = prefix + ex;
    if (isFile(file2)) {
      return file2;
    }

    const file3 = getIndex(prefix, ex);
    if (isDir(prefix) && file3) {
      return file3;
    }
  }
  log.error("MODULE NOT FOUND", "moduleId=%s,root=%s", pathLike, root);
  // return moduleId;
  throw new Error("MODULE NOT FOUND");
};

/**
 * NOTE：如果moduleId的后缀是没有指定的。这里有可能会出错。应该去坚持并自动补齐后缀
 *
 * @description:
 * 图片文件必须处理，因为css中引用图片的url
 * @param importDecl
 * @param curFile
 * @returns
 */
const doImportDecl = (
  importDecl: t.ImportDeclaration,
  curFile: string,
  alias: Alias,
  extensions: string[],
  root: string
) => {
  const curDir = path.dirname(curFile);
  const ModuleIdByName: ImportsByName = {};
  const matches = Object.keys(alias);
  let moduleId = importDecl.source.value;
  // if (/\.(png|jpg|svg|jpeg|mp4|gif)$/.test(moduleId)) {
  //   return ModuleIdByName;
  // }
  matches.forEach(match => {
    if (moduleId.startsWith(match)) {
      const reg = new RegExp(`^${match}`);
      moduleId = moduleId.replace(reg, alias[match]);
    }
  });

  try {
    if (isRelative(moduleId)) {
      moduleId = getFileFromRelativePath(
        path.resolve(curDir, moduleId),
        extensions
      );
    } else if (isAbs(moduleId)) {
      moduleId = getFileFromAbsPath(moduleId, extensions, root);
    } else {
      // moduleId = resolve.sync(moduleId, { basedir: curDir, extensions });
      moduleId = require.resolve(moduleId, { paths: [curDir] });
    }
  } catch (e) {
    log.error(
      e.message,
      "resolve.sync:moduleId=%s,curFile=%s",
      moduleId,
      curFile
    );
    console.log(JSON.stringify(importDecl, null, 2));
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
  curFile: string,
  alias: Alias = {},
  root = cwd,
  extensions: string[] = [".tsx", ".ts", ".js", ".jsx", ".cjs", ".mjs"]
) => {
  const ModuleIdByName: ImportsByName = {};
  const importDecls = getImportDeclarations(program);
  importDecls.forEach(decl => {
    const res = doImportDecl(decl, curFile, alias, extensions, root);
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
