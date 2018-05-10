import path, { dirname } from "path";
import fs from "fs-extra";
import { VError } from "verror";
import { BasicLogger } from "resettable-file";
import { Project, ScriptKit, ScriptResult } from "../index";

const SOURCE = path.join(__dirname, "source");
export const TARGETBASE = path.join(__dirname, "../..");

async function clearModule(name: string, target: string) {
  return fs.remove(path.join(TARGETBASE, target, name));
}

export async function createProject(name: string, target: string) {
  if (!name || !target) {
    throw new Error("Name and target are mandatory.");
  }
  const { projectRoot, moduleRoot } = getPaths(name, target);
  await fs.emptyDir(path.join(TARGETBASE, target, name));

  await Promise.all([
    fs.copy(path.join(SOURCE, name), projectRoot),
    fs.copy(path.join(SOURCE, "node_modules"), path.join(projectRoot, "node_modules")),
    // Create symbolic link for concurrently. (Behaves like concurrently module is installed)
    fs.ensureSymlink(
      path.join(__dirname, "../../node_modules/.bin/concurrently"),
      path.join(projectRoot, "node_modules/.bin/concurrently"),
    ),
  ]);

  return new Project({ moduleRoot, filesDir: path.join(moduleRoot, "lib") });
}

export function getPaths(name: string, target: string) {
  return {
    projectRoot: path.join(TARGETBASE, target, name),
    moduleRoot: path.join(TARGETBASE, target, name, "node_modules/scripts-module"),
    helperPath: path.join(TARGETBASE, target, name, "node_modules/script-helper"),
  };
}

export async function clear(target: string) {
  if (!target) {
    throw new Error("Target is mandatory");
  }
  return fs.remove(path.join(TARGETBASE, target));
}

export const stubLogger: BasicLogger = {
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
  verbose: () => {},
  silly: () => {},
};
