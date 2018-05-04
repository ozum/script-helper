import path from "path";
import fs from "fs-extra";
import {
  paths,
  getProject,
  getFileName,
  ProjectName,
  getInstalledProject,
  installProjects,
  clear,
  stubLogger,
} from "./__test_supplements__/test-util";
import { Project, ScriptKit } from "./index";
import { VError } from "verror";
import { ScriptResult } from "./@types";

let projects: { [key in ProjectName]?: Project };
let installedProjects: { [key in ProjectName]?: Project };

beforeAll(async () => {
  try {
    await installProjects({ justUpdate: false, build: true });
    projects = {
      ts: getProject("ts"),
      babel: getProject("babel", { logLevel: "info" }),
    };
    installedProjects = {
      ts: getInstalledProject("ts"),
      babel: getInstalledProject("babel"),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}, 35000); // Set timeout. Instead of stubs, preferred module installation, which takes very long time. Be patient!

afterAll(async () => {
  try {
    await clear();
  } catch (e) {
    console.log(e);
  }
});

describe("project", () => {
  it("should throw for wrong project", () => {
    expect(() => new Project()).toThrow("Cannot find module root");
  });

  it("should have name attribute", () => {
    expect(projects.ts.name).toBe("project-module-ts");
    expect(installedProjects.ts.name).toBe("project-module-ts");
  });

  it("should have inherited root attribute", () => {
    expect(projects.ts.root).toBe(paths.projects.ts.install);
    expect(installedProjects.ts.root).toBe(paths.projects.ts.install);
  });

  it("should have moduleName attribute", () => {
    expect(projects.ts.moduleName).toBe("scripts-module");
    expect(installedProjects.ts.moduleName).toBe("scripts-module");
  });

  it("should have moduleRoot attribute", () => {
    expect(projects.ts.moduleRoot).toBe(paths.projects.ts.scripts);
    expect(installedProjects.ts.moduleRoot).toBe(paths.projects.ts.scripts);
  });

  it("should have config attribute", () => {
    expect(projects.ts.config.testOption).toBe("OK");
    expect(installedProjects.ts.config.testOption).toBe("OK");
  });

  it("should have package attribute", () => {
    expect(projects.ts.package.get("name")).toBe("project-module-ts");
    expect(installedProjects.ts.package.get("name")).toBe("project-module-ts");
  });

  it("should have isTypeScript attribute", () => {
    expect(projects.ts.isTypeScript).toBe(true);
    expect(installedProjects.ts.isTypeScript).toBe(true);
  });

  it("should have isCompiled attribute for Babel", () => {
    expect(projects.babel.isCompiled).toBe(true);
    expect(installedProjects.babel.isCompiled).toBe(true);
  });

  it("should have isCompiled attribute for TypeScript", () => {
    expect(projects.ts.isCompiled).toBe(true);
    expect(installedProjects.ts.isCompiled).toBe(true);
  });

  it("should have availableScripts attribute", () => {
    const scripts = ["create-file", "error-script", "multiple-result", "non-exporting", "post-install", "super-script", "throw-script"];
    expect(projects.ts.availableScripts).toEqual(scripts);
    expect(installedProjects.ts.availableScripts).toEqual(scripts);
  });

  it("should have scriptsDir attribute", () => {
    expect(projects.ts.scriptsDir).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/scripts"));
    expect(installedProjects.ts.scriptsDir).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/scripts"));
  });

  it("should have configDir attribute", () => {
    expect(projects.ts.configDir).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/config"));
    expect(installedProjects.ts.configDir).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/config"));
  });

  it("should call fromScriptsDir() method", () => {
    expect(projects.ts.fromScriptsDir("a")).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/scripts/a"));
    expect(installedProjects.ts.fromScriptsDir("a")).toBe(
      path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/scripts/a"),
    );
  });

  it("should call fromConfigDir() method", () => {
    expect(projects.ts.fromConfigDir("a")).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/config/a"));
    expect(installedProjects.ts.fromConfigDir("a")).toBe(path.join(paths.projects.ts.install, "node_modules/scripts-module/lib/config/a"));
  });

  it("should have executed post-install script", () => {
    expect(installedProjects.ts.readFileSync("post-install.json", { parse: true })).toEqual({
      name: "project-module-ts",
      moduleName: "scripts-module",
      args: "--post_ok",
    });
  });

  it("should resolveModule", () => {
    expect(projects.ts.resolveModule("fs-extra")).toBe(path.join(paths.source, "node_modules/fs-extra")); // For coverage
    expect(installedProjects.ts.resolveModule("lodash.debounce")).toBe(
      path.join(paths.projects.ts.install, "node_modules/lodash.debounce"),
    ); // For real
  });

  describe("resolveScriptsBin", () => {
    it("should resolve scripts binary", () => {
      expect(projects.ts.resolveScriptsBin()).toBe("./src/__test_supplements__/npm/scripts-module/lib/index.js"); // For coverage
      expect(installedProjects.ts.resolveScriptsBin()).toBe("./test-temp/project-module-ts/node_modules/scripts-module/lib/index.js"); // For real
    });

    it("should resolve scripts binary if script module itself is also project", () => {
      const selfProject = new Project({ cwd: paths.scriptsSource, moduleRoot: paths.scriptsSource, debug: true, logger: stubLogger });
      expect(selfProject.resolveScriptsBin()).toBe("./src/index.ts"); // For coverage
    });
  });

  it("should return bin", () => {
    expect(projects.ts.bin("js-beautify")).toBe("./test-temp/project-module-ts/node_modules/.bin/js-beautify");
    expect(installedProjects.ts.bin("js-beautify")).toBe("./test-temp/project-module-ts/node_modules/.bin/js-beautify");
  });

  describe("resolveBin", () => {
    it("should return path of binary", () => {
      const installedBin = installedProjects.ts.resolveBin("js-beautify", { cwd: paths.projects.ts.install });
      // Real installation
      expect(installedBin).toBe("./node_modules/js-beautify/js/bin/js-beautify.js");
      // For Istanbul coverage
      expect(projects.ts.resolveBin("js-beautify")).toBe("./node_modules/js-beautify/js/bin/js-beautify.js");
      expect(projects.ts.resolveBin("js-beautify", { cwd: paths.source })).toBe("./node_modules/js-beautify/js/bin/js-beautify.js");
    });

    it("should return path of binary with differnt executable name", () => {
      const installedBin = installedProjects.ts.resolveBin("esprima", { executable: "esparse", cwd: paths.projects.ts.install });
      // Real installation
      expect(installedBin).toBe("./node_modules/esprima/bin/esparse.js");
      // For Istanbul coverage
      expect(projects.ts.resolveBin("esprima", { executable: "esparse" })).toBe("./node_modules/esprima/bin/esparse.js");
    });
  });

  it("should call fromModuleRoot()", () => {
    expect(projects.ts.fromModuleRoot("some/file.js")).toBe(path.join(paths.projects.ts.scripts, "some/file.js"));
    expect(installedProjects.ts.fromModuleRoot("some/file.js")).toBe(path.join(paths.projects.ts.scripts, "some/file.js"));
  });

  describe("hasAnyDep() method", () => {
    it("should return true from hasAnyDep() for existing dependency", () => {
      expect(projects.ts.hasAnyDep("dotenv")).toBe(true);
      expect(installedProjects.ts.hasAnyDep("dotenv")).toBe(true);
    });

    it("should return false from hasAnyDep() for non-existing dependency", () => {
      expect(projects.ts.hasAnyDep("some-module")).toBe(false);
      expect(installedProjects.ts.hasAnyDep("some-module")).toBe(false);
    });

    it("should return 1 from hasAnyDep() for existing dependency", () => {
      expect(projects.ts.hasAnyDep("dotenv", 1, 0)).toBe(1);
      expect(installedProjects.ts.hasAnyDep("dotenv", 1, 0)).toBe(1);
    });

    it("should return 0 from hasAnyDep() for non-existing dependency", () => {
      expect(projects.ts.hasAnyDep("some-module", 1, 0)).toBe(0);
      expect(installedProjects.ts.hasAnyDep("some-module", 1, 0)).toBe(0);
    });
  });

  it("should return true from envIsSet() for existing environment variables", () => {
    process.env.SOME_VAR = "value";
    expect(projects.ts.envIsSet("SOME_VAR")).toBe(true);
    expect(installedProjects.ts.envIsSet("SOME_VAR")).toBe(true);
  });

  it("should return false from envIsSet() for non-existing environment variables", () => {
    expect(projects.ts.envIsSet("SOME_NON_EXISTING_VAR")).toBe(false);
    expect(installedProjects.ts.envIsSet("SOME_NON_EXISTING_VAR")).toBe(false);
  });

  it("should return environment variable from parseEnv()", () => {
    process.env.SOME_VAR = "value";
    expect(projects.ts.parseEnv("SOME_VAR")).toBe("value");
    expect(installedProjects.ts.parseEnv("SOME_VAR")).toBe("value");
  });

  it("should parse data returned from environment variable from parseEnv()", () => {
    process.env.SOME_VAR = '{"key": "value"}';
    expect(projects.ts.parseEnv("SOME_VAR")).toEqual({ key: "value" });
    expect(installedProjects.ts.parseEnv("SOME_VAR")).toEqual({ key: "value" });
  });

  it("should return default environment variable from parseEnv() for non-existing variable", () => {
    expect(projects.ts.parseEnv("SOME_NON_EXISTING_VAR", "DEFAULT")).toBe("DEFAULT");
    expect(installedProjects.ts.parseEnv("SOME_NON_EXISTING_VAR", "DEFAULT")).toBe("DEFAULT");
  });

  it("should getConcurrentlyArgs()", () => {
    expect(projects.ts.getConcurrentlyArgs({ build: "echo building now && npx -p codecov" })).toEqual([
      "--kill-others-on-fail",
      "--prefix",
      "[{name}]",
      "--names",
      "build",
      "--prefix-colors",
      "bgBlue.bold.reset",
      '"echo building now && npx -p codecov"',
    ]);
  });

  it("should getConcurrentlyArgs() - 2", () => {
    expect(projects.ts.getConcurrentlyArgs({ build: "echo building now && npx -p codecov" }, { killOthers: false })).toEqual([
      "--prefix",
      "[{name}]",
      "--names",
      "build",
      "--prefix-colors",
      "bgBlue.bold.reset",
      '"echo building now && npx -p codecov"',
    ]);
  });

  describe("isOptedIn() method", () => {
    it("should return true for opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("a")).toBe(true);
      expect(installedProjects.ts.isOptedIn("a")).toBe(true);
    });

    it("should return false for not opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("not-exists")).toBe(false);
      expect(installedProjects.ts.isOptedIn("not-exists")).toBe(false);
    });

    it("should return 1 for opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("a", 1, 0)).toBe(1);
      expect(installedProjects.ts.isOptedIn("a", 1, 0)).toBe(1);
    });

    it("should return 0 for not opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("not-exists", 1, 0)).toBe(0);
      expect(installedProjects.ts.isOptedIn("not-exists", 1, 0)).toBe(0);
    });
  });

  describe("isOptedOut() method", () => {
    it("should return true for opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("z")).toBe(true);
      expect(installedProjects.ts.isOptedOut("z")).toBe(true);
    });

    it("should return false for not opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("not-exists")).toBe(false);
      expect(installedProjects.ts.isOptedOut("not-exists")).toBe(false);
    });

    it("should return 1 for opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("z", 1, 0)).toBe(1);
      expect(installedProjects.ts.isOptedOut("z", 1, 0)).toBe(1);
    });

    it("should return 0 for not opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("not-exists", 1, 0)).toBe(0);
      expect(installedProjects.ts.isOptedOut("not-exists", 1, 0)).toBe(0);
    });
  });

  describe("executeFromCLISync() method", () => {
    let old;

    beforeAll(() => {
      old = {
        logLevel: projects.ts.logLevel,
        log: console.log,
        error: console.error,
        exit: process.exit,
      };

      projects.ts.logLevel = "none";
      console.log = () => {};
      console.error = () => {};
      process.exit = ((code?: number) => ({ exitCode: code })) as any;
    });

    afterAll(() => {
      projects.ts.logLevel = old.logLevel;
      console.log = old.log;
      console.error = old.error;
      process.exit = old.exit;
    });

    it("should exit with error code for non-existing script", () => {
      process.argv = ["node", "src", "non-existing-script"];
      const exit = projects.ts.executeFromCLISync();
      expect(exit).toEqual({ exitCode: 1 });
    });

    it("should return undefined for non-existing script (exit = false)", () => {
      process.argv = ["node", "src", "non-existing-script"];
      const result = projects.ts.executeFromCLISync({ exit: false });
      expect(result).toBe(undefined);
    });

    it("should return undefined if no script given (exit = false)", () => {
      process.argv = ["node", "src"];
      const result = projects.ts.executeFromCLISync({ exit: false });
      expect(result).toBe(undefined);
    });

    it("should return exit code from script with single result", () => {
      process.argv = ["node", "src", "create-file"];
      const exit = projects.ts.executeFromCLISync() as ScriptResult;
      const content = projects.ts.readFileSync("created-by-script.txt");
      expect(content).toBe("cli");
      expect(exit).toEqual({ exitCode: 0 });
    });

    it("should return status from script with single result (exit = false)", () => {
      process.argv = ["node", "src", "create-file"];
      const result = projects.ts.executeFromCLISync({ exit: false }) as ScriptResult;
      const content = projects.ts.readFileSync("created-by-script.txt");
      expect(content).toBe("cli");
      expect(result.status).toBe(0);
    });

    it("should return status from script with multiple result (exit = false)", () => {
      process.argv = ["node", "src", "multiple-result"];
      const result = projects.ts.executeFromCLISync({ exit: false }) as ScriptResult[];
      expect(result).toEqual([{ status: 0 }, { status: 0 }]);
    });

    it("should return exit code for scripts having errors", () => {
      process.argv = ["node", "src", "error-script"];
      const exit = projects.ts.executeFromCLISync() as ScriptResult[];
      expect(exit).toEqual({ exitCode: 1 });
    });

    it("should return result for scripts having errors (exit = false)", () => {
      process.argv = ["node", "src", "error-script"];
      const result = projects.ts.executeFromCLISync({ exit: false }) as ScriptResult[];
      expect(result).toEqual([{ status: 1, error: new Error("error object") }, { status: 1, error: "text" }, { status: 1 }]);
    });

    it("should throw if script throws (exit = false)", () => {
      process.argv = ["node", "src", "throw-script"];
      expect(() => projects.ts.executeFromCLISync({ exit: false })).toThrow("Cannot finish of execution of");
    });

    it("should throw if script does not export script", () => {
      process.argv = ["node", "src", "non-exporting"];
      expect(() => projects.ts.executeFromCLISync()).toThrow("does not export script");
    });
  });

  describe("hasScriptSync() method", () => {
    it("should return script name for existing scripts without script extension", () => {
      expect(projects.ts.hasScriptSync("create-file")).toBe(path.join(paths.projects.ts.scripts, "lib/scripts/create-file.js"));
    });

    it("should return script name for existing scripts with script extension", () => {
      expect(projects.ts.hasScriptSync("create-file.js")).toBe(path.join(paths.projects.ts.scripts, "lib/scripts/create-file.js"));
    });

    it("should return undefined for non-existing scripts", () => {
      expect(projects.ts.hasScriptSync("not-exists.js")).toBe(undefined);
    });
  });

  describe("executeSync() method", () => {
    it("should execute single script", () => {
      const result = projects.ts.executeSync("echo");
      expect(result.status).toBe(0);
    });

    it("should execute single failing script", () => {
      const result = projects.ts.executeSync("non-existing-command");
      expect(result.error).toBeDefined();
    });

    it("should execute single script with parameters", () => {
      const result = projects.ts.executeSync(["echo", [""]]);
      expect(result.status).toBe(0);
    });

    it("should execute multiple serial scripts", () => {
      const result = projects.ts.executeSync("echo", ["echo", [""]]);
      expect(result.status).toBe(0);
    });

    it("should execute multiple serial scripts which some fails", () => {
      const result = projects.ts.executeSync("echo", "not-existing-cmd", ["echo", [""]]);
      expect([result.error !== undefined, result.previousResults.length]).toEqual([true, 1]);
    });

    it("should execute multiple concurrent scripts", () => {
      const result = projects.ts.executeSync({ echo1: "echo", echo2: ["echo", [""]] });
      expect(result.status).toBe(0);
    });

    it("should execute multiple serial and concurrent scripts", () => {
      const result = projects.ts.executeSync(["echo", [""]], null, { echo1: "echo", echo2: ["echo", [""]] }, ["echo", [""]]);
      expect(result.status).toBe(0);
    });
  });
});

describe("ScriptKit", () => {
  let project;
  let scriptFile;
  let scriptKit;
  let superScriptFile;

  beforeAll(() => {
    try {
      project = getProject("ts");
      scriptFile = project.hasScriptSync("multiple-result");
      scriptKit = new ScriptKit(project, "multiple-result");
      superScriptFile = project.hasScriptSync("super-script");
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  it("should create instance", () => {
    expect(scriptKit instanceof ScriptKit).toBe(true);
  });

  it("should throw if script cannot be found", () => {
    expect(() => new ScriptKit(project, "not-exists")).toThrow("cannot be found in");
  });

  it("should have dir attribute", () => {
    expect(scriptKit.dir).toBe(path.join(paths.projects.ts.scripts, "lib/scripts"));
  });

  it("should have configDir attribute", () => {
    expect(scriptKit.configDir).toBe(path.join(paths.projects.ts.scripts, "lib/config"));
  });

  it("should have extension attribute", () => {
    expect(scriptKit.extension).toBe("js");
  });

  it("should have here() method", () => {
    expect(scriptKit.here("a")).toBe(path.join(paths.projects.ts.scripts, "lib/scripts/a"));
  });

  it("should have hereRelative() method", () => {
    expect(scriptKit.hereRelative("a")).toBe("./test-temp/project-module-ts/node_modules/scripts-module/lib/scripts/a");
  });

  it("should have executeSubScriptSync() method", () => {
    const result = project.executeScriptFileSync("super-script");
    expect(result).toEqual({ status: 0 });
  });
});
