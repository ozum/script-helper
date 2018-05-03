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
