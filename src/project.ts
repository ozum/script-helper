import arrify from "arrify";
import cosmiconfig from "cosmiconfig";
import spawn from "cross-spawn";
import fs, { readJSONSync } from "fs-extra";
import { InternalDataInterface } from "internal-data";
import pickBy from "lodash.pickby";
import path from "path";
import readPkgUp from "read-pkg-up";
import ResettableFile, { DataObject, Logger, BasicLogger } from "resettable-file";
import { VError } from "verror";
import which from "which";
import managePath from "manage-path";
import glob from "glob";
import ScriptKit from "./script-kit";
import { listScripts, safeName, getModuleRoot, getProjectPackage } from "./project-util";
import { Script, Executable, ScriptResult, SpawnOptions } from "./@types";

type LogLevel = "none" | "error" | "warn" | "info" | "debug" | "silly";

/**
 * Internal object to store private data.
 * @typedef {Object} Project~Internal
 * @private
 * @property {string}         moduleName        - Name of the module which requires this module.
 * @property {string}         name              - Name of project.
 * @property {string}         configFile        - cosmiconfig file for module.
 * @property {Object}         config            - Configuration for module.
 * @property {Object}         modulePackage     - Module's package.json data (read onlu)
 */
type Internal = {
  moduleName: string;
  name: string;
  configFile?: string;
  config: { [key: string]: any };
  debug: boolean;
  filesDir: string;
  modulePackage: { [key: string]: any };
};

const internalData: InternalDataInterface<Project, Internal> = new WeakMap();

/**
 * @classDesc
 * Provides utility class and related methods to create modules which manipulate npm projects such as create/copy/remove files, directories and data files.
 * Also provides `reset()` method which reverses all modifications made by this module.
 */
export default class Project extends ResettableFile {
  /**
   * @param   {Object}          [options]                                 - Options
   * @param   {boolean}         [options.track]                           - Sets default tracking option for methods.
   * @param   {Array.<string>}  [options.sortPackageKeys=["scripts"]]     - Default keys to be sorted in package.json file.
   * @param   {LogLevel}        [options.logLevel="info"]                 - Sets log level. ("error", "warn", "info", "debug", "verbose", "silly")
   * @param   {boolean}         [options.filesDir=require.main.filename]  - Directory of `config` and `script` directories. Default value assumes file called from CLI resides same dir with `scripts` and `config`.
   * @param   {string}          [options.cwd=[project root]]              - [`For Testing`] Working directory of project root.
   * @param   {string}          [options.moduleRoot=[module root]]        - [`For Testing`] Root of the module using this library.
   * @param   {boolean}         [options.debug=false]                     - Turns on debug mode.
   * @param   {Logger}          [options.logger]                          - A looger instance such as winston. Must implement `info`, `warn`, `error`, `verbose`, `silly`.
   * @returns {Project}                                                   - Instance
   * @extends ResettableFile
   */
  constructor({
    filesDir = path.dirname(require!.main!.filename), // Default value assumes file called from CLI resides same dir with `scripts` and `config`.
    debug = false,
    track = true,
    sortPackageKeys = ["scripts"],
    logLevel = debug ? "debug" : "info",
    moduleRoot = getModuleRoot(),
    cwd,
    logger,
  }: {
    filesDir?: string;
    debug?: boolean;
    track?: boolean;
    sortPackageKeys?: string[];
    logLevel?: keyof BasicLogger;
    moduleRoot?: string;
    cwd?: string;
    logger?: Logger;
  } = {}) {
    try {
      const modulePackage = Object.freeze(fs.readJSONSync(path.join(moduleRoot, "package.json")));
      const { pkg: projectPkg, root: projectRoot } = getProjectPackage(moduleRoot, modulePackage);
      const name = projectPkg.name;
      const moduleName = modulePackage.name;
      const registryFile = path.join(projectRoot, `${safeName(name)}-registry.json`);
      const { config = {}, filePath: configFile = undefined } = cosmiconfig(safeName(moduleName), { sync: true }).load(projectRoot) || {};
      super(registryFile, { track, logLevel, logger, sourceRoot: moduleRoot });
      internalData.set(this, { name, moduleName, configFile, config, debug, filesDir, modulePackage });
      this.getDataObjectSync("package.json", { format: "json", throwNotExists: true, sortKeys: sortPackageKeys });
      const alterPath = managePath(process.env);
      alterPath.unshift(this.fromRoot("node_modules/.bin")); // Add .bin folder to path env. (bin like `tsc` can be called directly)
      if (debug) {
        this.logger.warn("Debug mode is on");
      }
    } catch (e) {
      throw new VError(e, "Cannot initialize project.");
    }
  }

  /**
   * Project name which uses scripts module.
   * @readonly
   * @type {string}
   */
  get name() {
    return internalData.get(this).name;
  }

  /**
   * Safe project name, which "@" and "/" characters names are replaced.
   * @readonly
   * @type {string}
   * @example
   * const name = project.name(); // @microsoft/typescript
   * const safeName = project.safeName(); // microsoft-typescript
   */
  get safeName() {
    return safeName(this.name);
  }

  /**
   * Module name which provides configuration services to project using this library.
   * @readonly
   * @type {string}
   */
  get moduleName() {
    return internalData.get(this).moduleName;
  }

  /**
   * Safe module name, which "@" and "/" characters names are replaced.
   * @readonly
   * @type {string}
   * @example
   * const name = project.moduleName(); // @user/my-scripts
   * const safeName = project.safeModuleName(); // user-my-scripts
   */
  get safeModuleName() {
    return safeName(this.moduleName);
  }

  /**
   * Root directory path of module which provides configuration services to project using this library.
   * @readonly
   * @type {string}
   */
  get moduleRoot() {
    return this.sourceRoot;
  }

  /**
   * Configuration for module.
   * @readonly
   * @type {Object}
   */
  get config(): { [key: string]: any } {
    return internalData.get(this).config;
  }

  /**
   * {@link DataObject} instance for `package.json` of project. Also this is a shorthand for `project.readDataFile("package.json")`
   * @readonly
   * @type {DataObject}
   */
  get package(): DataObject {
    return this.getDataObjectSync("package.json");
  }

  /**
   * Object of script module's `package.json` data. This data is read only and it's keys/values should not be changed.
   * @readonly
   * @type {Object}
   */
  get modulePackage(): { [key: string]: any } {
    return internalData.get(this).modulePackage;
  }

  /**
   * Whether project is a compiled project via TypeScript or Babel.
   * @readonly
   * @type {boolean}
   */
  get isCompiled(): boolean {
    return this.isTypeScript || this.hasAnyDep(["babel-cli", "babel-preset-env"]);
  }

  /**
   * Whether project is a TypeScript project.
   * @readonly
   * @type {boolean}
   */
  get isTypeScript(): boolean {
    return this.package.has("types");
  }

  /**
   * Command name of the module's bin. (It is simply it's bin (string) or first key of it's bin (object) in package.json)
   * For more complex requirements, it is possible to use {@link Project.modulePackage} and do manual calculations.
   * @readonly
   * @type {string}
   * @example
   * const bin = project.moduleBin; // "my-scripts"
   */
  get moduleBin(): string | undefined {
    const bin = this.modulePackage.bin;
    /* istanbul ignore next */
    return typeof bin === "string" ? bin : Object.keys(bin || {})[0];
  }

  /**
   * Lists of available scripts in scripts folder.
   * @readonly
   * @type {Array.<string>}
   */
  get availableScripts(): Array<string> {
    // `glob.sync` returns paths with unix style path separators even on Windows.
    // So we normalize it before attempting to strip out the scripts path.
    return glob
      .sync(path.join(this.scriptsDir, "!(*.d.ts|*.map)"))
      .map(path.normalize)
      .map(script =>
        script
          .replace(this.scriptsDir, "")
          .replace(/^[/\\]/, "")
          .replace(/__tests__/, "")
          .replace(/\.(js|ts)$/, ""),
      )
      .filter(Boolean)
      .sort();
  }

  /**
   * Path of the scripts dir.
   * @readonly
   * @type {string}
   */
  get scriptsDir() {
    return path.join(internalData.get(this).filesDir, "scripts");
  }

  /**
   * Path of the config dir.
   * @readonly
   * @type {string}
   */
  get configDir() {
    return path.join(internalData.get(this).filesDir, "config");
  }

  /**
   * Returns root path of given module.
   * @param   {string} name - Name of the module to get root path of.
   * @returns {string}      - Root path of given module.
   * @example
   * project.resolveModule("fs-extra"); // /path/to/project-module/node_modules/fs-extra
   */
  resolveModule(name: string): string {
    const moduleMainFile = require.resolve(name);
    const { path: pkgPath } = readPkgUp.sync({ cwd: moduleMainFile });
    return path.dirname(pkgPath);
  }

  /**
   * Returns relative path to given executable located in project's `node_modules/.bin`.
   * @param   {string} executable - Name of the executable
   * @returns {string}            - Path of the executable in `node_modules/.bim`
   */
  bin(executable: string): string {
    const relative = path.relative(process.cwd(), this.fromRoot(`node_modules/.bin/${executable}`));
    return `.${path.sep}${relative}`;
  }

  /**
   * Finds and returns path to module's binary. (Module which requires this library)
   * @param   {Object}  [options]                   - Options.
   * @param   {string}  [executable]                - Executable name.
   * @param   {string}  [cwd=process.cwd()]         - Current working directory
   * @returns {string|undefined} - Path to parent module's binary.
   * @example
   * project.resolveScriptsBin(); // my-scripts (executable of this libraray)
   */
  resolveScriptsBin({ executable = "", cwd = process.cwd() } = {}): string | undefined {
    if (this.package.get("name") === this.moduleName) {
      return require.resolve("./").replace(cwd + path.sep, "." + path.sep);
    }
    return this.resolveBin(this.moduleName, { executable, cwd });
  }

  /* istanbul ignore next */
  /**
   * Finds and returns path of given command, trying to following steps:
   * 1. If it is a command defined in path, returns it's path.
   * 2. Searches if given node module is installed.
   * 2.a. If executable is given, looks `bin[executable]` in module's package.json.
   * 2.b. If no executable is given, looks `bin[module name]` in module's package.json.
   * 2.c. If found returns it's path.
   * 3. Throws error.
   * module name is used by default.
   * @param   {string}  modName                     - Module name to find executable from.
   * @param   {Object}  [options]                   - Options.
   * @param   {string}  [executable=param.modName]  - Executable name. (Defaults to module name)
   * @param   {string}  [cwd=process.cwd()]         - Current working directory
   * @returns {string}                              - Path to binary.
   * @throws  {VError}                               - Throws error no binary cannot be found.
   * @example
   * project.resolveBin("typescript", { executable: "tsc" }); // Searches typescript module, looks `bin.tsc` in package.json and returns it's path.
   * project.resolveBin("tsc"); // If `tsc` is defined in PATH, returns `tsc`s path, otherwise searches "tsc" module, which returns no result and throws error.
   * project.resolveBin("some-cmd"); // Searches "some-cmd" module and
   */
  resolveBin(modName: string, { executable = "", cwd = process.cwd() } = {}): string {
    let pathFromWhich;
    let binPath;
    try {
      const whichExecutable = which.sync(executable || modName);
      pathFromWhich = fs.realpathSync(whichExecutable);
    } catch (_error) {
      // ignore _error
    }
    try {
      const modPkgPath = require.resolve(`${modName}/package.json`);
      const modPkgDir = path.dirname(modPkgPath!);
      const { bin } = require(modPkgPath!);

      if (typeof bin === "string" && (!executable || bin === executable)) {
        binPath = bin;
      } else if (typeof bin === "object" && executable && bin[executable]) {
        binPath = bin[executable];
      } else if (typeof bin === "object" && !executable) {
        binPath = Object.keys(bin).length === 1 ? Object.values(bin)[0] : bin[modName];
      }

      if (!binPath) {
        throw new VError(`There is no "bin.${executable || modName}" or default (string or single entry object) "bin" in package.json.`);
      }
      const fullPathToBin = path.join(modPkgDir, binPath);

      if (fullPathToBin === pathFromWhich) {
        return executable || modName;
      }
      return fullPathToBin.replace(cwd + path.sep, "." + path.sep);
    } catch (e) {
      if (pathFromWhich) {
        return executable || modName;
      }

      throw new VError(e, `Cannot resolve bin: "${executable || modName}" in "${modName}" module.`);
    }
  }

  /**
   * Joins parts to form a path using `path.join`. Returns path in module by adding module root at the beginning of path.
   * @param   {...string} part  - Path parts to get path relative to module root.
   * @returns {string}          - Full path to module file.
   */
  fromModuleRoot(...part: string[]): string {
    return this.fromSourceRoot(...part);
  }

  /**
   * Returns given path added to path of config directory. Path may be given as a single string or in multiple parts.
   * @param   {...string} part  - Path relative to config dir.
   * @returns {string}          - Path in config directory.
   */
  fromConfigDir(...part: string[]) {
    return path.join(this.configDir, ...part);
  }

  /**
   * Returns given path added to path of scripts directory. Path may be given as a single string or in multiple parts.
   * @param   {...string} part  - Path relative to scripts dir.
   * @returns {string}          - Path in config directory.
   */
  fromScriptsDir(...part: string[]) {
    return path.join(this.scriptsDir, ...part);
  }

  /**
   * Returns one of the given values based on whether project has any of the given dependencies in `dependencies`, `devDependencies`, `peerDependencies`.
   * @param   {string|Array<string>}  deps      - Dependency or dependencies to check.
   * @param   {*}                     [t=true]  - Value to return if any of dependencies exists.
   * @param   {*}                     [f=false] - Value to return if none of dependencies exists.
   * @returns {*}                               - `t` or `f` value based on existence of dependency in package.json.
   */
  hasAnyDep<T = true, F = false>(deps: string[] | string, t: T = (true as any) as T, f: F = (false as any) as F): T | F {
    const has =
      this.package.hasSubProp("dependencies", deps) ||
      this.package.hasSubProp("devDependencies", deps) ||
      this.package.hasSubProp("peerDependencies", deps);
    return has ? t : f;
  }

  /**
   * Returns whether given environment variable is set and not empty.
   * @param   {string} name - Name of the environment variable to look for.
   * @returns {boolean}     - Whether given environment variable is set and not empty.
   */
  envIsSet(name: string): boolean {
    return process.env.hasOwnProperty(name) && process.env[name] !== "" && process.env[name] !== "undefined";
  }

  /**
   * Returns environment variable if it exists and is not empty. Returns given default value otherwise.
   * @param   {string}  name          - Name of the environment variable
   * @param   {*}       defaultValue  - Default value to return if no environment variable is set or is empty.
   * @returns {*}                     - Environment variable or default value.
   */
  parseEnv<T>(name: string, defaultValue?: T): string | number | Object | T | undefined {
    if (this.envIsSet(name)) {
      const result = process.env[name] as string;
      try {
        return JSON.parse(result);
      } catch (err) {
        return result;
      }
    }
    return defaultValue;
  }

  /**
   * Executes script based on script name from CLI (process.argv). If `exit` is true and there is no `exit: false` in script result objects,
   * also exist from process with success (0) or failure code (1).
   * @param   {boolean}           exit  - Whether to exit from process.
   * @returns {ScriptResult|void}       - Result of script
   * @throws  {VError}                  - Throws error if script throws error.
   * @example
   *
   * // in my-scripts/lib/index.js
   * project.executeFromCLI();
   *
   * // in package.json
   * { "scripts": { "test": "my-scripts test" } }
   *
   * // on CLI
   * > npm run test
   * > node_modules/.bin/my-scripts test
   */
  executeFromCLISync({ exit = true } = {}): never | ScriptResult | Array<ScriptResult> | undefined {
    const [executor, ignoredBin, script, ...args] = process.argv;
    const commandMessage = `"${path.basename(ignoredBin)} ${`${script} ${args.join(" ")}`.trim()}"`;
    let shouldExit = exit;

    if (!script || !this.hasScriptSync(script)) {
      script ? this.logger.error(`Script cannot be found: ${script}`) : "";
      listScripts(this.availableScripts);
      return shouldExit ? process.exit(1) : undefined;
    }

    try {
      let emitGeneralMessage = false;
      let success = true;
      const results = this.executeScriptFileSync(script, args);
      const consoleErrorMessages: Error[] = [];

      arrify(results).forEach((result: ScriptResult) => {
        success = result.status === 0 && success;
        shouldExit = shouldExit && (result.exit === undefined ? true : result.exit);
        // Log as necessary
        if (result.error instanceof Error) {
          this.logger.error(result.error.message); // JS Error in result
          consoleErrorMessages.push(result.error);
        } else if (result.error) {
          this.logger.error(result.error); // Other error in result
        } else if (result.status !== 0) {
          emitGeneralMessage = true;
        }
      });

      if (emitGeneralMessage) {
        this.logger.error(`${script} finished with error in command: ${commandMessage}`); // Fail without error message
      }

      this.saveSync();
      consoleErrorMessages.forEach(console.error);
      return shouldExit ? process.exit(success ? 0 : 1) : results;
    } catch (e) {
      this.saveSync();
      const error = new VError(e, `Cannot finish of execution of ${commandMessage}`);
      this.logger.error(error.message);
      throw error;
    }
  }

  /**
   * Executes given script file's exported `script` function. Script file should be given relative to scripts directory.
   * @param   {string}                              scriptFile  - Script file to execute in scripts directory.
   * @param   {Array.<string>}                      [args=[]]   - Arguments to pass script function.
   * @returns {ScriptResult|Array.<ScriptResult>}               - Result of script function. (If more than one command executed, array of results)
   * @throws  {VError}                                          - Throws if given file does not export a function in script property.
   * @example
   * const result = executeScriptFileSync("build"); // Executes my-scripts/lib/scripts/build
   */
  executeScriptFileSync(scriptFile: string, args: Array<string> = []): ScriptResult | Array<ScriptResult> {
    const file = this.fromScriptsDir(scriptFile);
    const { script: scriptFunction } = require(file);
    if (typeof scriptFunction !== "function") {
      throw new VError("Script file does not export script function. Check script file. (module.exports = { script: () => {} })");
    }

    return scriptFunction(this, args, new ScriptKit(this, scriptFile));
  }

  /**
   * Checks whether given script exists in scripts directory. Script search method is as below:
   * 1. If given path found (dir or file), returns it.
   * 2. If file name has no extension, looks a file name with extension in order of `ts`, `js`.
   * 3. If file name with an extension is found, returns full path of filename including extension.
   * @param   {string}            scriptFile  - Module file to check existence.
   * @returns {string|undefined}              - Full path (with extension if it has one). Undefined if not found.
   */
  hasScriptSync(scriptFile: string): string | undefined {
    const scriptPath = this.fromScriptsDir(scriptFile);

    if (fs.existsSync(scriptPath)) {
      return scriptPath;
    }
    if (path.extname(scriptFile) === "") {
      for (const extension of ["ts", "js"]) {
        if (fs.existsSync(`${scriptPath}.${extension}`)) {
          return `${scriptPath}.${extension}`;
        }
      }
    }
  }

  /**
   * Executes given binary using `spawn.sync` with given arguments and return results.
   * For single {@link Executable}, it executes and returns result. For multiple {@link Executable Executables}, it executes them
   * serially. Execution stops and function returns result, if one of the commands fails (also adds previous results in `result.previousResults`).
   * If an object is provided with names as keys and {@link Executable Executables} as values, it executes them using `concurrently`
   * and returns result of `concurrently`.
   * @param   {...Executable} executables - Executable or executables.
   * @returns {ScriptResult}              - Result of the executable.
   * @example
   * // Execute some commands serially and concurrently. Commands in object is executed concurrently.
   * // In example below, `serial-command-1` is executed first, then `serial-command-2` is executed, then based on condition `serial-command-3` is executed or not,
   * // `build-doc-command`, `some-other-command` and `tsc` is executed using `concurrently` module (Keys are names used in log).
   * // Lastly `other-serial-command` is executed. If some command in serial tasks fails, no further command is executed and function would return.
   * const result = project.executeSync(
   *   ["serial-command-1", ["arg"]],
   *   "serial-command-2",
   *   someCondition ? "serial-command-3" : null,
   *   {
   *     my-parallel-job: ["build-doc-command", ["arg"],
   *     my-parallel-task: "some-other-command"
   *     builder: ["tsc", ["arg"],
   *   },
   *   ["other-serial-command", ["arg"]],
   * );
   */
  executeSync(...executables: Array<Executable | { [key: string]: Executable | null | undefined } | null | undefined>): ScriptResult {
    const internal = internalData.get(this);
    if (executables.length > 1) {
      const results: ScriptResult[] = [];
      for (const executable of executables.filter(Boolean)) {
        const result = this.executeSync(executable);
        if (result.status !== 0) {
          result.previousResults = results;
          return result;
        }
        results.push(result);
      }
      return { status: 0, previousResults: results };
    }

    if (executables.length === 0) {
      return { status: 0 };
    }

    const executable = executables[0]!;

    let exe = typeof executable === "string" ? executable : "";
    let args;
    let options: SpawnOptions = { stdio: "inherit" };

    if (Array.isArray(executable)) {
      [exe, args] = executable;
      options = (executable[2] as SpawnOptions) || options;
    } else if (typeof executable === "object") {
      exe = this.bin("concurrently");
      args = this.getConcurrentlyArgs(executable);
    }

    /* istanbul ignore next */
    if (internal.debug) {
      this.logger.debug(new Error().stack!.replace(/^Error/, `Stack Trace for ${exe}`));
    }

    return spawn.sync(exe, args, options);
  }

  /**
   * Same as `Project.executeSync()`, but adds `exit: false` to the result.
   * @param   {...Executable} executables - Executable or executables.
   * @returns {ScriptResult}              - Result of the executable.
   * @see Project.executeSync()
   */
  executeWithoutExitSync(
    ...executables: Array<Executable | { [key: string]: Executable | null | undefined } | null | undefined>
  ): ScriptResult {
    return Object.assign(this.executeSync(...executables), { exit: false });
  }

  /**
   * Given an object containing keys as script names, values as commands, returns parameters to feed to concurrently.
   * @param   {Object<string, string>}  scripts           - Object with script names as keys, commands as values.
   * @param   {Object}                  [options]         - Options
   * @param   {boolean}                 [killOthers=true] - Whether -kill-others-on-fail should added.
   * @returns {Array<string>}                             - Arguments to use with concurrently.
   */
  getConcurrentlyArgs(scripts: { [key: string]: Executable | null | undefined }, { killOthers = true } = {}): string[] {
    const colors = ["bgBlue", "bgGreen", "bgMagenta", "bgCyan", "bgWhite", "bgRed", "bgBlack", "bgYellow"];

    const fullScripts = pickBy(scripts) as { [key: string]: Executable }; // Clear empty keys
    const prefixColors = Object.keys(fullScripts)
      .reduce((pColors, _s, i) => pColors.concat([`${colors[i % colors.length]}.bold.reset`]), [] as Array<string>)
      .join(",");

    // prettier-ignore
    return [
      killOthers ? "--kill-others-on-fail" : "",
      "--prefix", "[{name}]",
      "--names", Object.keys(fullScripts).join(","),
      "--prefix-colors", prefixColors,
      ...Object.values(fullScripts).map(s => JSON.stringify(typeof s === "string" ? s : `${s[0]} ${s[1].join(" ")}`)),
    ].filter(Boolean);
  }

  /**
   * Returns whether given parameter is opted out by looking configuration.
   * @param   {string}  key         - Paremeter to look for.
   * @param   {*}       [t=true]    - Value to return if it is opted out.
   * @param   {*}       [f= false]  - Value to return if it is not opted out.
   * @returns {*}                   - `t` or `f` value based on existence of sub property.
   */
  isOptedOut<T = true, F = false>(key: string, t: T = (true as any) as T, f: F = (false as any) as F): T | F {
    const internal = internalData.get(this);
    return internal.config.optOut && internal.config.optOut.includes(key) ? t : f;
  }

  /**
   * Returns whether given parameter is opted in by looking configuration.
   * @param   {string}  key         - Paremeter to look for.
   * @param   {*}       [t=true]    - Value to return if it is opted in.
   * @param   {*}       [f= false]  - Value to return if it is not opted in.
   * @returns {*}                   - `t` or `f` value based on existence of sub property.
   */
  isOptedIn<T = true, F = false>(key: string, t: T = (true as any) as T, f: F = (false as any) as F): T | F {
    const internal = internalData.get(this);
    return internal.config.optIn && internal.config.optIn.includes(key) ? t : f;
  }
}
