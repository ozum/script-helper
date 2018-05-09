import Project from "../project";
import ScriptKit from "../script-kit";

/**
 * @typedef {Object} Options to provide spawn method.
 * @property {Array}  stdio     - stdio parameter to feed spawn
 * @property {string} encoding  - encoding to provide to feed spawn
 */
export type SpawnOptions = { stdio?: string | Array<any>; encoding?: string };

/**
 * Type for holding executable. It may be string to store executable name without arguments. For executable
 * with arguments or options it is a tuple `[bin-name, [arg1, arg2, arg3], spawn-options]`
 * @typedef {string|Array.<string|string[]|SpawnOptions>} Executable
 * @example
 * const bin = "tsc";
 * const binWithArgs = ["tsc", ["--strict", "--target", "ESNext"]];
 * const binWithOptions = ["tsc", ["--strict", "--target", "ESNext"], { encoding: "utf-8" }];
 */
export type Executable = string | [string, Array<string>] | [string, Array<string>, SpawnOptions];

/**
 * Type for returned value from CLI command.
 * @typedef {Object} ScriptResult
 * @property {number}                 status              - Exit status code of cli command (0: success, other value: error)
 * @property {Error}                  [error]             - Error object if execution of cli command fails.
 * @property {Array.<ScriptResult>}   [previousResults]   - If more than one command is executed serially, results of prevoulsy executed commands.
 * @property {boolean}                [exit]              - Whether script should exit after finishes its job. (Default behaviour is exit/true)
 */
export type ScriptResult = { status: number; error?: Error; previousResults?: Array<ScriptResult>; exit?: boolean };

/**
 * Type for script function.
 * @typedef {Function} Script
 * @param {Project}         project     - Project instance.
 * @param {Array.<string>}  args        - Argument.
 * @param {ScriptKit}       scriptKit   - {@link ScriptKit} instance, which have utility methods fro currently executed script file.
 */
export type Script = (project: Project, args: Array<string>, scriptKit: ScriptKit) => ScriptResult | Array<ScriptResult>; // SpawnSyncReturns<Buffer>; import { SpawnSyncReturns } from "child_process";

const jsdoc = 1;
