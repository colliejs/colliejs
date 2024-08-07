import { FONT_REG, IMG_REG, VIDEO_REG } from "../const";
import { getName } from "./getName";
import * as t from "@babel/types";
import path from "path";
import fs, { existsSync } from "node:fs";
import log, { consola } from "consola";
import { ImportsByName } from "./types";
import { assert } from "@colliejs/shared";
import { PathLike } from "fs";
import { Alias } from "../type";
import { createRequire } from "module";

const nodeRequire = createRequire(import.meta.url);

export function getImportDeclarations(ast: t.Program) {
  const importDecls: t.ImportDeclaration[] = [];
  ast.body.forEach(node => {
    if (t.isImportDeclaration(node)) {
      importDecls.push(node);
    }
  });
  return importDecls;
}

function isRelative(path: string) {
  return path.startsWith(".") || path.startsWith("..");
}
function isAbs(path: string) {
  return path.startsWith("/");
}
function isAlias(path: string, alias: Alias) {
  return Object.keys(alias).some(key => path.startsWith(key));
}

function isFile(file: PathLike) {
  return existsSync(file) && fs.statSync(file).isFile();
}
function isDir(file: PathLike) {
  return existsSync(file) && fs.statSync(file).isDirectory();
}

function getIndex(path: PathLike, ext: string) {
  // assert(isDir(path), "path must be a dir");
  if (!isDir(path)) {
    return;
  }
  const file = `${path}/index${ext}`;
  if (isFile(file)) {
    return file;
  }
}

const getFileFromRelativePath = (
  curDir: string,
  relpath: string,
  exts: string[]
) => {
  const absPath = path.resolve(curDir, relpath);
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
  projectDir: string
) => {
  assert(pathLike.startsWith("/"), "absolute path must start with /");

  if (isFile(pathLike)) {
    return pathLike;
  }
  //TODO: public is a hard code
  const relativePublicPathLike = path.join(projectDir, "public", pathLike);
  if (isFile(relativePublicPathLike)) {
    return relativePublicPathLike;
  }
  const reltaiveProjectDirPath = path.join(projectDir, pathLike);

  for (const ex of extension) {
    assert(ex.startsWith("."), "extension must start with .");
    // absolute path of whole filesystem
    const file1 = `${pathLike}${ex}`;
    if (isFile(file1)) {
      return file1;
    }

    // relative to the projectDir
    const file2 = `${reltaiveProjectDirPath}${ex}`;
    if (isFile(file2)) {
      return file2;
    }

    //?
    const file3 = getIndex(reltaiveProjectDirPath, ex);
    if (isDir(reltaiveProjectDirPath) && file3) {
      return file3;
    }

    // relative to the public dir
    const file4 = `${relativePublicPathLike}${ex}`;
    if (isFile(file4)) {
      return file4;
    }
  }
  log.error(
    "MODULE NOT FOUND",
    "moduleId=%s,projectDir=%s",
    pathLike,
    projectDir
  );
  throw new Error("MODULE NOT FOUND");
};
function getSourceType(source: string, alias: Alias) {
  if (isRelative(source)) {
    return "relative";
  } else if (isAbs(source)) {
    return "abs";
  } else if (isAlias(source, alias)) {
    return "alias";
  } else {
    return "node_modules";
  }
}

function getModuleId(
  importDecl: t.ImportDeclaration,
  curFile: string,
  alias: Alias,
  extensions: string[],
  projectDir: string
) {
  const curDir = path.dirname(curFile);
  const source = importDecl.source.value;
  try {
    const type = getSourceType(source, alias);
    switch (type) {
      case "relative":
        return getFileFromRelativePath(curDir, source, extensions);
      case "abs":
        return getFileFromAbsPath(source, extensions, projectDir);
      case "alias":
        let newSource = "";
        for (const from of Object.keys(alias)) {
          if (source.startsWith(from)) {
            newSource = source.replace(new RegExp(`^${from}`), alias[from]);
          }
        }
        return getFileFromAbsPath(newSource, extensions, projectDir);

      case "node_modules":
        return nodeRequire.resolve(source, { paths: [curFile] });
    }
  } catch (e) {
    consola.debug(
      e.message,
      `resolve.sync:moduleId=${source},curFile=${curFile}`
    );
    return "";
  }
}

/**
 * NOTE：如果moduleId的后缀是没有指定的。这里有可能会出错。应该去坚持并自动补齐后缀
 *
 * @description:
 * 图片文件必须处理，因为css中引用图片的url
 * @param importDecl
 * @param curFile
 * @returns
 */
function doImportDecl(
  importDecl: t.ImportDeclaration,
  curFile: string,
  alias: Alias,
  extensions: string[],
  projectDir: string
) {
  let moduleId = getModuleId(
    importDecl,
    curFile,
    alias,
    extensions,
    projectDir
  );
  moduleId = isFileModule(moduleId)
    ? `/${path.relative(projectDir, moduleId)}`
    : moduleId;

  const importsByName: ImportsByName = {};
  importDecl.specifiers.forEach(specifier => {
    switch (specifier.type) {
      case "ImportDefaultSpecifier":
        importsByName[specifier.local.name] = {
          moduleId,
          importedName: "default",
        };
        break;
      case "ImportNamespaceSpecifier":
        importsByName[specifier.local.name] = {
          moduleId,
          importedName: "*",
        };
        break;
      case "ImportSpecifier":
        importsByName[specifier.local.name] = {
          moduleId,
          importedName: getName(specifier.imported) || specifier.local.name,
        };
        break;
    }
  });
  return importsByName;
}
const cwd = process.cwd();
export function getImports(
  program: t.Program,
  curFile: string,
  alias: Alias = {},
  projectDir = cwd,
  extensions: string[] = [".tsx", ".ts", ".js", ".jsx", ".cjs", ".mjs"]
) {
  return getImportDeclarations(program).reduce((a, decl) => {
    return {
      ...a,
      ...doImportDecl(decl, curFile, alias, extensions, projectDir),
    };
  }, {});
}

export function isFileModule(modelId: string) {
  return [IMG_REG, VIDEO_REG, FONT_REG].some(reg => reg.test(modelId));
}

//===========================================================
// getImageImports
//===========================================================
export function getFileModuleImport(imports: ImportsByName) {
  return Object.entries(imports)
    .filter(([, value]) => {
      return isFileModule(value.moduleId);
    })
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value.moduleId,
      };
    }, {});
}
