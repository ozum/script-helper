import fs from "fs-extra";
import path from "path";
import { VError } from "verror";
import readPkgUp from "read-pkg-up";
import { Format, Data, Path } from "resettable-file";
import Project from "./project";

const npmLifecycleEventUp: { [key: string]: number } = {
  preinstall: 2,
  postinstall: 1,
};

// function findParentModuleOut(
//   filePath,
//   func = () => true,
//   maxDepth = 20
// ) {
//   console.log(require("util").inspect(require.main, { depth: 12 }));
//   const targetRoot = path.dirname(readPkgUp.sync({ cwd: filePath }).path);
//   const predicate = (candidate) => !path.dirname(candidate.filename).startsWith(targetRoot) && func(candidate);

//   return findParentModule(filePath, predicate, maxDepth);
// }

// function findParentModule(
//   filePath,
//   func,
//   maxDepth = 20,
//   current = require.main,
//   depth = 0
// ) {
//   if (current.filename === filePath) {
//     return { module: current };
//   }

//   for (let i = 0; i < current.children.length && depth < maxDepth; i++) {
//     const found = findParentModule(filePath, func, maxDepth, current.children[i], depth + 1) || {};

//     if (!( found.target || found.module )) {
//       continue;
//     }

//     const result = found.target ? found : (func(found.module) ? { target: found.module } : { module: current.parent });
//     return current.parent ? result : result.target.filename;
//   }
// }

/**
 * Returns modules root directory. It is possible to use `stacktrace` or `process.cwd` to find module path.
 * Stacktrace is slow but works independently where it is called. cwd works faster but does not work outside of
 * project cwd such as test scripts.
 * @param   {Object}  [options]                 - Options
 * @param   {boolean} [options.useStack=true]   - Whether to use stacktrace to find module root (slow).
 * @returns {string}                            - Module root directory.
 * @private
 */
export function findModuleRoot({ useStack = true } = {}): string {
  // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // İlk denemede şunu kullandım: readPkgUp.sync({ cwd: require!.main!.filename }); Proje dışında bir cwd'den çağrılırsa yanlış oluyor.
  if (useStack) {
    const myRoot = path.dirname(readPkgUp.sync({ cwd: __dirname }).path);
    const origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = (new Error().stack as any) as Array<any>;
    Error.prepareStackTrace = origPrepareStackTrace;
    const targetStack = stack.find(
      e => e.getFileName() && !e.getFileName().startsWith("internal") && !path.dirname(e.getFileName()).startsWith(myRoot),
    );

    /* istanbul ignore else */
    if (!targetStack) {
      throw new VError("Cannot find module root");
    }
    /* istanbul ignore next */
    return path.dirname(readPkgUp.sync({ cwd: targetStack.getFileName() }).path);
  }

  return readPkgUp.sync({ cwd: require!.main!.filename }).path;
}

/**
 * Starting given level up from `cwd` and looking up further, returns first package.json data object and path of directory which contains that packagage.json.
 * @param   {boolean}               [useStack=0]  - Whether to use stack trace to find package. (Stack is slow)
 * @param   {number}                [level=0]     - Up level to start from `cwd`.
 * @returns {{0: Object, 1:string}}               - Array of package.json as first element, path or project root as second element.
 * @throws  {VError}                              - Throws if no package.json file found.
 * @private
 */
export function getPackageAndDir({ useStack = true, level = 0, cwd }: { useStack?: boolean; level?: number; cwd?: string } = {}): [
  Data,
  string
] {
  // cwd according to npm lifecycle, because cwd has different values according to lifecycle event.
  // preinstall cwd: project/node_modules/moe-scripts (Module which requires this)
  // postinstall cwd: project (Project)
  try {
    const up = "..".repeat(npmLifecycleEventUp[process.env.npm_lifecycle_event!] || level);
    const startCwd = cwd ? fs.realpathSync(path.join(cwd, up)) : path.join(findModuleRoot({ useStack }), "..");
    const { pkg, path: pkgPath }: { pkg: object; path: string } = readPkgUp.sync({ cwd: startCwd });

    if (!pkgPath) {
      throw new VError(`Project directory cannot be found in cwd: ${startCwd}`);
    }

    return [pkg, path.dirname(pkgPath)];
  } catch (e) {
    throw new VError(e, "Cannot find package.json and project directory.");
  }
}

/* istanbul ignore next */
export function listScripts(scriptNames: Array<string>) {
  const [executor, ignoredBin, script, ...args] = process.argv;
  // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.
  const scriptList = scriptNames.join("\n  ");
  let message = `Usage: ${path.basename(ignoredBin)} [script] [--flags]\n\n`;
  message += `Available Scripts:\n  ${scriptList}\n\n`;
  message += `Options:\n`;
  message += `  All options depend on the script and args you pass will be forwarded to the respective tool that's being run under the hood.`;
  console.log(`\n${message.trim()}\n`);
}
