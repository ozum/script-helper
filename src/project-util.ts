import fs from "fs-extra";
import path from "path";
import { VError } from "verror";
import readPkgUp from "read-pkg-up";
import { Format, Data, Path } from "resettable-file";
import Project from "./project";
import { replaceArgumentName } from ".";

const npmLifecycleEventUp: { [key: string]: number } = {
  preinstall: 2,
  postinstall: 1,
};

/**
 * Returns callsites from the V8 stack trace API
 * @return {*}    - Callsites
 * @private
 */
function getStackTrace(): Array<any> {
  const old = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = (new Error().stack as any) as Array<any>;
  Error.prepareStackTrace = old;
  /* istanbul ignore next */
  if (!stack) {
    throw new VError("No stack trace available. Probably this is top most module.");
  }
  return stack.slice(1);
}

/**
 * Returns script module's package.json path and data.
 * @returns {{ path: string, pkg: Object }} - Module's package.json path and data.
 * @private
 */
export function getModuleRoot(): string {
  const root = path.dirname(readPkgUp.sync({ cwd: __dirname }).path);
  const targetStack = getStackTrace().find(
    e => e.getFileName() && !e.getFileName().startsWith("internal") && !path.dirname(e.getFileName()).startsWith(root),
  );

  /* istanbul ignore else */
  if (!targetStack) {
    throw new VError("Cannot get module root.");
  } else {
    return path.dirname(readPkgUp.sync({ cwd: targetStack.getFileName() }).path);
  }
}

/**
 * Returns root path and package.json data of project module. If module and project are same, returns module's path and data.
 * @param   {string} moduleRoot             - Module root's path.
 * @param   {Object} modulePkg              - Module roots package.json data.
 * @returns {{ path: string, pkg: Object }} - Parent module's package.json path and data.
 * @private
 */
export function getProjectPackage(moduleRoot: string, modulePkg: { [key: string]: any }): { root: string; pkg: { [key: string]: any } } {
  const { pkg, path: pkgPath } = readPkgUp.sync({ cwd: path.join(moduleRoot, "..") });
  if (!pkgPath) {
    const { pkg: currentPkg, path: currentPath } = readPkgUp.sync({ cwd: path.join(moduleRoot) });
    /* istanbul ignore else */
    if (!currentPkg || currentPkg.name !== modulePkg.name) {
      throw new VError("Cannot find project root.");
    }
  }
  /* istanbul ignore next */
  return { pkg: pkg || modulePkg, root: pkgPath ? path.dirname(pkgPath) : moduleRoot };
}

/* istanbul ignore next */
/**
 * Prints given script names to console.
 * @param   {Array.<string>}  scriptNames  - List of script names.
 * @returns {void}
 * @private
 */
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

/**
 * Replcaes "@" and "/" characters from given string. Useful for npm packages whose names contain user name such as @microsoft/typescript
 * @param   {string} name - Name to be make safe.
 * @returns {string}      - Safe name
 * @private
 */
export function safeName(name: string): string {
  return name.replace("@", "").replace("/", "-");
}
