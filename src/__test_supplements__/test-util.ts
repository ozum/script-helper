import * as childProcess from "child_process";
import { promisify } from "util";
import * as path from "path";
import { rename, rmdir, existsSync, copy, emptyDir } from "fs-extra";
import * as os from "os";
import VError from "verror";
import { Project } from "../index";

const [exec, setTimeoutPromise] = [promisify(childProcess.exec), promisify(setTimeout)];

// const BASEPATH = path.normalize(`${__dirname}/../../../script-helper-test`);
const BASEPATH = path.normalize(`${__dirname}/../../test-temp`);

export type ProjectPaths = { source: string; install: string; scripts: string; helper: string };
export type Paths = {
  base: string;
  source: string;
  scriptsSource: string;
  projects: { ts: ProjectPaths; babel: ProjectPaths };
};
export type ProjectName = keyof typeof paths.projects;

const paths: Paths = {
  base: BASEPATH,
  source: path.join(__dirname, "../.."),
  scriptsSource: path.join(__dirname, "npm/scripts-module"),
  projects: {
    ts: {
      source: path.join(__dirname, "npm/project-module-ts"),
      install: path.normalize(`${BASEPATH}/project-module-ts`),
      scripts: path.normalize(`${BASEPATH}/project-module-ts/node_modules/scripts-module`),
      helper: path.normalize(`${BASEPATH}/project-module-ts/node_modules/script-helper`),
    },
    babel: {
      source: path.join(__dirname, "npm/project-module-babel"),
      install: path.normalize(`${BASEPATH}/project-module-babel`),
      scripts: path.normalize(`${BASEPATH}/project-module-babel/node_modules/scripts-module`),
      helper: path.normalize(`${BASEPATH}/project-module-babel/node_modules/script-helper`),
    },
  },
};

async function packModule(src: string, target: string) {
  const { stdout, stderr } = await exec(`npm pack ${src}`, { cwd: target });
  const packName = stdout.replace("\n", "");
  const packNameWithouVersion = packName.replace(/-[\d.]+?\.tgz$/, ".tgz");
  return rename(path.join(target, packName), path.join(target, packNameWithouVersion));
}

// Installs this module, test module, project module
async function install(name: ProjectName) {
  const projectPath = paths.projects[name];
  try {
    await exec(`rm -rf ${projectPath.install} && mkdir -p ${projectPath.install}`);
    await packModule(projectPath.source, paths.base);
    await exec(`tar -C ${projectPath.install} --strip-components=1 -xzf ${projectPath.install}.tgz package`);
    const out = await exec(`npm install`, { cwd: projectPath.install });
    console.log(out.stdout);
    if (out.stderr) {
      console.log(out.stderr);
    }
  } catch (e) {
    throw e;
  }
}

// If it is already installed only copies new files.
// For fast debugging erros while testing. However changes related to npm install cannot be tested with this.
async function updateProject(name: ProjectName): Promise<any> {
  const projectPaths = paths.projects[name];
  return Promise.all([
    copyLibrary(projectPaths.source, projectPaths.install),
    copyLibrary(paths.source, projectPaths.helper),
    copyLibrary(paths.scriptsSource, projectPaths.scripts),
  ]);
}

async function copyLibrary(source: string, target: string) {
  const exclude = "--exclude=node_modules/ --exclude=src/ --exclude=.* --exclude=post-install.json";
  exec(`rsync -aP ${exclude} ${path.join(source, "/")} ${path.join(target, "/")}`);
}

export function getFileName(name: ProjectName, extension = ""): [string, string] {
  const randomInt = Math.floor(Math.random() * Math.floor(999999));
  const dot = extension ? "." : "";
  const file = `auto-test-qx-${randomInt}${dot}${extension}`;
  return [file, path.join(paths.projects[name].install, file)];
}

export function getProject(name: ProjectName, projectOptions?: object): Project {
  const projectPath = paths.projects[name];
  return new Project(
    Object.assign(
      { cwd: projectPath.install, moduleRoot: projectPath.scripts, filesDir: path.join(projectPath.scripts, "lib") },
      projectOptions || {},
    ),
  );
}

export function getInstalledProject(name: ProjectName): Project {
  const projectPath = paths.projects[name];
  return require(path.join(paths.projects[name].scripts, "/lib/index"));
}

export async function installProjects({ justUpdate = false, build = true }): Promise<any> {
  // Cache error. Jest, if beforeAll() method throws, calls again beforeAll() method until it succeeds for every test case. However result of this expensive function does not change.

  if (!justUpdate || build) {
    try {
      await exec(`npm run build`);
    } catch (e) {
      throw new Error("Cannot build.");
    }
  }

  return justUpdate
    ? Promise.all([updateProject("ts"), updateProject("babel")])
    : emptyDir(paths.base)
        .then(() => Promise.all([paths.scriptsSource, paths.source].map(src => packModule(src, paths.base))))
        .then(() => Promise.all([install("ts"), install("babel")]));
}

export async function clear() {
  return exec(`rm -rf ${paths.base}`);
}

export { paths };
