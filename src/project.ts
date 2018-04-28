import cosmiconfig from "cosmiconfig";
import * as fs from "fs-extra";
import { InternalDataInterface } from "internal-data";
import pickBy from "lodash.pickby";
import * as path from "path";
import readPkgUp from "read-pkg-up";
import ResettableFile, { DataObject, Logger } from "resettable-file";
import { VError } from "verror";
import which from "which";
import { findModuleRoot, getPackageAndDir } from "./project-util";

/**
 * Internal object to store private data.
 * @typedef {Object} Project~Internal
 * @private
 * @property {string}         moduleName        - Name of the module which requires this module.
 * @property {string}         name              - Name of project.
 * @property {string}         configFile        - cosmiconfig file for module.
 * @property {Object}         config            - Configuration for module.
 */
type Internal = {
  moduleName: string;
  name: string;
  configFile?: string;
  config: { [key: string]: any };
};

const internalData: InternalDataInterface<Project, Internal> = new WeakMap();

/**
 * @classDesc
 * Provides utility class and related methods to create modules which manipulate npm projects such as create/copy/remove files, directories and data files.
 * Also provides `reset()` method which reverses all modifications made by this module.
 */
export default class Project extends ResettableFile {
  /**
   * @param   {Object}          [options]                               - Options
   * @param   {boolean}         [options.track]                         - Sets default tracking option for methods.
   * @param   {Array.<string>}  [options.sortPackageKeys=["scripts"]]   - Default keys to be sorted in package.json file.
   * @param   {string}          [options.logLevel="info"]               - Sets log level. ("error", "warn", "info", "debug", "verbose", "silly")
   * @param   {string}          [options.cwd=[project root]]            - [`Special`] Working directory of project root. (Only for special purposes, normally not necessary.)
   * @param   {string}          [options.moduleRoot=[module root]]      - [`Special`] Root of the module using this library. (Only for special purposes, normally not necessary.)
   * @returns {Project}                                                 - Instance
   * @extends ResettableFile
   */
  constructor({
    track = true,
    sortPackageKeys = ["scripts"],
    logLevel = "info",
    moduleRoot = findModuleRoot(),
    cwd,
  }: { track?: boolean; sortPackageKeys?: string[]; logLevel?: keyof Logger; cwd?: string; moduleRoot?: string } = {}) {
    try {
      const [packageObject, root] = getPackageAndDir({ cwd });
      const name = packageObject.name;
      const moduleName = fs.readJsonSync(path.join(moduleRoot, "package.json")).name;
      const registryFile = path.join(root, `${name}-registry.json`);
      const { config = {}, filePath: configFile = undefined } = cosmiconfig(moduleName, { sync: true }).load(root) || {};
      super(registryFile, { track, logLevel, sourceRoot: moduleRoot });
      internalData.set(this, { name, moduleName, configFile, config });
      this.getDataObjectSync("package.json", { format: "json", throwNotExists: true, sortKeys: sortPackageKeys });
    } catch (e) {
      /* istanbul ignore next */
      throw new VError(e, "Cannot initialize project.");
    }
  }

  /**
   * Module name which provides configuration services to project using this library.
   * @readonly
   * @type {string}
   */
  get name() {
    return internalData.get(this).name;
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
   * Whether project is a compiled project via TypeScript or Babel.
   * @readonly
   * @type {boolean}
   */
  get isCompiled() {
    return this.isTypeScript || this.hasAnyDep(["babel-cli", "babel-preset-env"]);
  }

  /**
   * Whether project is a TypeScript project.
   * @readonly
   * @type {boolean}
   */
  get isTypeScript() {
    return this.package.has("types");
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
   * Finds and returns path to module's binary. (Module which requires this library)
   * @param   {Object}  [options]                   - Options.
   * @param   {string}  [cwd=process.cwd()]         - Current working directory
   * @returns {string|undefined} - Path to parent module's binary.
   * @example
   * project.resolveScriptsBin(); // my-scripts (executable of this libraray)
   */
  resolveScriptsBin({ cwd = process.cwd() } = {}): string | undefined {
    if (this.package.get("name") === this.moduleName) {
      const module = require.resolve("./");
      /* istanbul ignore next */
      return module ? module.replace(cwd + path.sep, "." + path.sep) : undefined;
    }
    return this.resolveBin(this.moduleName, { cwd });
  }

  /**
   * Finds and returns path of given command.
   * @param   {string}  modName                     - Module name to find executable from.
   * @param   {Object}  [options]                   - Options.
   * @param   {string}  [executable=param.modName]  - Executable name. (Defaults to module name)
   * @param   {string}  [cwd=process.cwd()]         - Current working directory
   * @returns {string}                              - Path to binary.
   * @throws  {Error}                               - Throws error no binary cannot be found.
   */
  resolveBin(modName: string, { executable = modName, cwd = process.cwd() } = {}): string {
    let pathFromWhich;
    try {
      const whichExecutable = which.sync(executable);
      pathFromWhich = fs.realpathSync(whichExecutable);
    } catch (_error) {
      // ignore _error
    }
    try {
      const modPkgPath = require.resolve(`${modName}/package.json`);
      const modPkgDir = path.dirname(modPkgPath!);
      const { bin } = require(modPkgPath!);
      /* istanbul ignore next */
      const binPath = typeof bin === "string" ? bin : bin[executable];
      const fullPathToBin = path.join(modPkgDir, binPath);
      if (fullPathToBin === pathFromWhich) {
        return executable;
      }
      return fullPathToBin.replace(cwd + path.sep, "." + path.sep);
    } catch (error) {
      /* istanbul ignore next */
      if (pathFromWhich) {
        return executable;
      }
      /* istanbul ignore next */
      throw error;
    }
  }

  /**
   * Joins parts to form a path using `path.join`. Returns path in module by adding module root at the beginning of path.
   * @param   {Array<string>} part  - Path parts to get path relative to module root.
   * @returns {string}              - Full path to module file.
   */
  fromModuleRoot(...part: string[]): string {
    return this.fromSourceRoot(...part);
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
   * Given an object containing keys as script names, values as commands, returns parameters to feed to concurrently.
   * @param   {Object<string, string>}  scripts           - Object with script names as keys, commands as values.
   * @param   {Object}                  [options]         - Options
   * @param   {boolean}                 [killOthers=true] - Whether -kill-others-on-fail should added.
   * @returns {Array<string>}                             - Arguments to use with concurrently.
   */
  getConcurrentlyArgs(scripts: { [key: string]: string }, { killOthers = true } = {}): string[] {
    const colors = ["bgBlue", "bgGreen", "bgMagenta", "bgCyan", "bgWhite", "bgRed", "bgBlack", "bgYellow"];

    const fullScripts = pickBy(scripts); // Clear empty keys
    const prefixColors = Object.keys(fullScripts)
      .reduce((pColors, _s, i) => pColors.concat([`${colors[i % colors.length]}.bold.reset`]), [] as Array<string>)
      .join(",");

    // prettier-ignore
    return [
      killOthers ? "--kill-others-on-fail" : "",
      "--prefix", "[{name}]",
      "--names", Object.keys(fullScripts).join(","),
      "--prefix-colors", prefixColors,
      ...Object.values(fullScripts).map(s => JSON.stringify(s)), // stringify escapes quotes ✨
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
