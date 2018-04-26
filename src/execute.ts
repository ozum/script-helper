import fs from "fs-extra";
import path from "path";
import spawn from "cross-spawn";
import glob from "glob";
import VError from "verror";

import Project from "./project";

/* istanbul ignore next */
function getScriptsPath() {
  return path.join(path.dirname(require!.main!.filename), "/scripts");
}

/* istanbul ignore next */
/**
 * Executes script based on script name from CLI arguments (process.argv).
 * @param   {Project}         [project]                         - {@link Project} object to be pass executed functions.
 * @param   {Object}          [projectOptions]                               - If no project is provided, options to be used while creating a new {@link Project} object
 * @param   {boolean}         [projectOptions.track]                         - Sets default tracking option for methods.
 * @param   {Array.<string>}  [projectOptions.sortPackageKeys]   - Default keys to be sorted in package.json file.
 * @param   {string}          [projectOptions.logLevel]               - Sets log level. ("error", "warn", "info", "debug", "verbose", "silly")
 * @param   {string}          [projectOptions.cwd]            - [`Special`] Working directory of project root. (Only for special purposes, normally not necessary.)
 * @param   {string}          [projectOptions.moduleRoot]      - [`Special`] Root of the module using this library. (Only for special purposes, normally not necessary.)
 * @returns {void}
 * @example
 * > node_modules/.bin/my-scripts test
 *
 * Or in package.json
 * { "scripts": { "test": "my-scripts test" } }
 *
 * > npm run test
 */
export function execute({ projectOptions, project = new Project(projectOptions) }: { projectOptions?: object; project?: Project } = {}) {
  const [executor, ignoredBin, script, ...args] = process.argv;
  const scriptPath = path.join(getScriptsPath(), `${script}`);
  const exists = fs.existsSync(`${scriptPath}.js`) || fs.existsSync(scriptPath);

  if (!script || !exists) {
    if (script) {
      console.log(`${script} script cannot be found.`);
    }
    listScripts();
    return;
  }

  try {
    const { script: func } = require(scriptPath);

    if (typeof func !== "function") {
      throw new VError(
        "Script file does not export script function. Please check your script file. (module.exports = { script: () => {} })",
      );
    }

    const result: { status: number } = func(project, args);
    project.saveSync();
  } catch (e) {
    project.saveSync();
    throw new VError(e, `Cannot finish of execution of "${path.basename(ignoredBin)} ${(script + " " + args.join(" ")).trim()}"`);
  }
}

/* istanbul ignore next */
function listScripts() {
  const scriptsPath = getScriptsPath();
  const scriptsAvailable = glob.sync(path.join(scriptsPath, "*"));
  const [executor, ignoredBin, script, ...args] = process.argv;
  // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map((script: any) =>
      script
        .replace(scriptsPath, "")
        .replace(/^[/\\]/, "")
        .replace(/__tests__/, "")
        .replace(/\.js$/, ""),
    )
    .filter(Boolean)
    .join("\n  ")
    .trim();
  const fullMessage = `
Usage: ${path.basename(ignoredBin)} [script] [--flags]

Available Scripts:
  ${scriptsAvailableMessage}

Options:
  All options depend on the script and args you pass will be forwarded to the respective tool that's being run under the hood.
  `.trim();
  console.log(`\n${fullMessage}\n`);
}
