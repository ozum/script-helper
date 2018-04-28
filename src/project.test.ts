import path from "path";
import fs from "fs-extra";
import { paths, getProject, getFileName, ProjectName, getInstalledProject, installProjects, clear } from "./__test_supplements__/test-util";
import { Project } from "./index";
import { VError } from "verror";

let projects: { [key in ProjectName]?: Project };
let installedProjects: { [key in ProjectName]?: Project };
let selfProject: Project;

beforeAll(async () => {
  try {
    selfProject = new Project({ cwd: paths.scriptsSource, moduleRoot: paths.scriptsSource });
    await installProjects({ justUpdate: false });
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

  it("should have executed post-install script", () => {
    expect(installedProjects.ts.readFileSync("post-install.json", { parse: true })).toEqual({
      name: "project-module-ts",
      moduleName: "scripts-module",
      args: "--post_ok",
    });
  });

  it("should resolveModule", () => {
    expect(projects.ts.resolveModule("fs-extra")).toBe(path.join(paths.source, "node_modules/fs-extra")); // For coverage
    expect(installedProjects.ts.resolveModule("fs-extra")).toBe(path.join(paths.projects.ts.install, "node_modules/fs-extra")); // For real
  });

  describe("resolveScriptsBin", () => {
    it("should resolve scripts binary", () => {
      expect(projects.ts.resolveScriptsBin()).toBe("./src/__test_supplements__/npm/scripts-module/lib/index.js"); // For coverage
      expect(installedProjects.ts.resolveScriptsBin()).toBe("./test-temp/project-module-ts/node_modules/scripts-module/lib/index.js"); // For real
    });

    it("should resolve scripts binary if script module itself is also project", () => {
      expect(selfProject.resolveScriptsBin()).toBe("./src/index.ts"); // For coverage
    });
  });

  describe("resolveBin", () => {
    it("should return path of binary", () => {
      const installedBin = installedProjects.ts.resolveBin("js-beautify", { cwd: paths.projects.ts.install });
      // Real installation
      expect(installedBin).toBe("./node_modules/js-beautify/js/bin/js-beautify.js");
      // For Istanbul coverage
      expect(projects.ts.resolveBin("js-beautify")).toBe("js-beautify");
      expect(projects.ts.resolveBin("js-beautify", { cwd: paths.source })).toBe("js-beautify");
    });

    it("should return path of binary with differnt executable name", () => {
      const installedBin = installedProjects.ts.resolveBin("esprima", { executable: "esparse", cwd: paths.projects.ts.install });
      // Real installation
      expect(installedBin).toBe("./node_modules/esprima/bin/esparse.js");
      // For Istanbul coverage
      expect(projects.ts.resolveBin("esprima", { executable: "esparse" })).toBe("esparse");
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

  describe("optedIn", () => {
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

  describe("optedOut", () => {
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
});
