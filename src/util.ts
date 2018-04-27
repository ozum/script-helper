import arrify from "arrify";
import path from "path";

/**
 * Returns a new array, after replacing output destination argument name with a new name. Does not mutate original array.
 * @param   {Array}             args    - Arguments array.
 * @param   {string | string[]} names   - Parameter names to look for in arguments.
 * @param   {string}            newName - Parameter names to look for in arguments.
 * @returns {Array}                     - Index number of parameter whose name found in arguments.ü
 * @example
 * const arguments = ["--a", "--b"];
 * replaceArgumentName(arguments, ["--a"], "--c"); // -> ["--c", "--b"]
 */
export function replaceArgumentName(args: Array<any>, names: string | string[], newName: string): Array<any> {
  const newArgs = [...args];
  for (const name of arrify(names)) {
    const index = newArgs.indexOf(name);
    if (index > -1) {
      newArgs.splice(index, 1, newName);
      return newArgs;
    }
  }
  return newArgs;
}

/**
 * Result type of getFromHereFunction.
 * @typedef   {Object} getFromHereFunction~Result
 * @property  {getFromHereFunction~Result.here} here                  - Function which returns given path added to base path.
 * @property  {getFromHereFunction~Result.hereRelative} hereRelative  - Function which returns relative path from cwd for given path added to base path.
 */
const jsdoc = 1;

/**
 * Higher order function which returns functions which calculates paths related to base path given.
 * @param   {string} baseDir                - Base dir to be used in generated functions.
 * @returns { getFromHereFunction~Result }  - Functions which calculates paths.
 * @example
 * const { here, hereRelative } = getFromHereFunction(__dirname);
 * const absPath = here("a.txt"); // /some/path/mydir/a.txt
 * const relativePath = hereRelative("b.txt"); // ./b.txt
 */
export function getFromHereFunctions(baseDir: string) {
  return {
    /**
     * Returns given path added to base path.
     * @param   {string}  p - Relative path to baseDir.
     * @returns {string}    - Absolute path for path.
     * @memberof getFromHereFunction~Result
     */
    here: (p: string) => path.join(baseDir, p),
    /**
     * Returns relative path from cwd for given path added to base path.
     * @param   {string}  p - Relative path to baseDir.
     * @returns {string}    - Relative path from cwd
     * @memberof getFromHereFunction~Result
     */
    hereRelative: (p: string) => `.${path.sep}${path.relative(process.cwd(), path.join(baseDir, p))}`,
  };
}
