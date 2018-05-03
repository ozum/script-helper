import path from "path";
import fs from "fs-extra";
import VError from "verror";
import Project from "./project";
import { ScriptResult } from "./@types";

export default class ScriptKit {
  private scriptFile: string;
  private project: Project;

  constructor(project: Project, scriptFile: string) {
    const file = project.hasScriptSync(scriptFile);
    if (!file) {
      throw new VError(`Script "${scriptFile}" cannot be found in "${project.scriptsDir}"`);
    }
    this.scriptFile = fs.statSync(file).isDirectory() ? require.resolve(file) : file;
    this.project = project;
  }

  /**
   * Directory of the script.
   * @readonly
   * @type {string}
   */
  get dir(): string {
    return path.dirname(this.scriptFile);
  }

  /**
   * Config dir of the script. It is calculated related to current script.
   * Useful for locating config directory for transpiled scripts both for source and
   * transpiled files.
   */
  get configDir(): string {
    const dirs = path.dirname(this.scriptFile).split(path.sep);
    while (dirs.length > 0 && dirs.pop() !== "scripts") {}
    dirs.push("config");
    return dirs.join(path.sep);
  }

  /**
   * File extension of the script without . at the beginning
   * @readonly
   * @type {string}
   * @example
   * const ext = s.extension(); // js
   */
  get extension(): string {
    return path.extname(this.scriptFile).replace(/\./, "");
  }

  /**
   * Returns given path added to base path. Path may be given as a single string or in multiple parts.
   * @param   {...string}  part - Relative path to baseDir.
   * @returns {string}          - Absolute path for path.
   * @example
   * const absPath = here("a.txt"); // /some/path/mydir/a.txt
   */
  here(...part: string[]): string {
    return path.join(this.dir, ...part);
  }

  /**
   * Returns relative path from cwd for given path added to base path. Path may be given as a single string or in multiple parts.
   * @param   {...string}  part - Relative path to baseDir.
   * @returns {string}          - Relative path from cwd
   * @example
   * const relativePath = hereRelative("b.txt"); // ./b.txt
   */
  hereRelative(...part: string[]): string {
    return `.${path.sep}${path.relative(process.cwd(), path.join(this.dir, ...part))}`;
  }

  /**
   * Executes sub scripts in directory. For example a `build` directory may have `index.js`, `tsc.js`, `babel.js`. It would be called
   * `project.executeScriptFileSync("build")`. In that script file subscript can be called using this method.
   * @param   {string}          name  -
   * @param   {Array.<string>}  args  -
   * @returns {ScriptResult}          -
   * @example
   * // 'build' dir have 'index.js', 'tsc.js', 'babel.js' files.
   * // in a file
   * project.executeScriptFileSync("build"); // Executes build/index.js
   * // in build/index.js
   * scriptKit.executeSubScriptSync("tsc", args); // Executes build/tsc.js (Passes project and scriptKit parameters to script function)
   */
  executeSubScriptSync(name: string, args: Array<string>): ScriptResult | Array<ScriptResult> {
    const scriptFile = path.join(path.relative(this.project.scriptsDir, this.dir), name);
    return this.project.executeScriptFileSync(scriptFile, args);
  }
}
