import path from "path";
import fs from "fs-extra";
import { createProject, getPaths, stubLogger, clear, TARGETBASE } from "./__test_supplements__/test-helper";
import { Project, ScriptResult } from "./index";

const TARGET = "temp-test-project";
let projects: { ts: Project; babel: Project };
const paths = {
  ts: getPaths("project-module-ts", TARGET),
  babel: getPaths("project-module-babel", TARGET),
};

beforeAll(async () => {
  const projectArray = await Promise.all([createProject("project-module-ts", TARGET), createProject("project-module-babel", TARGET)]);
  projects = { ts: projectArray[0], babel: projectArray[1] };
});

afterAll(async () => {
  await clear(TARGET);
});

describe("Project", () => {
  it("should throw for wrong project", () => {
    expect(() => new Project()).toThrow("Cannot get module root.");
  });

  it("should throw for wrong module-root", () => {
    expect(() => new Project({ moduleRoot: "non-existing" })).toThrow("Cannot initialize project");
  });

  it("should have name attribute", () => {
    expect(projects.ts.name).toBe("project-module-ts");
  });

  it("should have safeName attribute", () => {
    expect(projects.ts.safeName).toBe("project-module-ts");
  });

  it("should have inherited root attribute", () => {
    expect(projects.ts.root).toBe(paths.ts.projectRoot);
  });

  it("should have moduleName attribute", () => {
    expect(projects.ts.moduleName).toBe("scripts-module");
  });

  it("should have moduleBin attribute", () => {
    expect(projects.ts.moduleBin).toBe("scripts-module");
  });

  it("should have safeModuleName attribute", () => {
    expect(projects.ts.safeModuleName).toBe("scripts-module");
  });

  it("should have moduleRoot attribute", () => {
    expect(projects.ts.moduleRoot).toBe(paths.ts.moduleRoot);
  });

  it("should have modulePackage attribute", () => {
    expect(projects.ts.modulePackage.name).toBe("scripts-module");
  });

  it("should have config attribute", () => {
    expect(projects.ts.config.testOption).toBe("OK");
  });

  it("should have package attribute", () => {
    expect(projects.ts.package.get("name")).toBe("project-module-ts");
  });

  it("should have isTypeScript attribute", () => {
    expect(projects.ts.isTypeScript).toBe(true);
  });

  it("should have isCompiled attribute for Babel", () => {
    expect(projects.babel.isCompiled).toBe(true);
  });

  it("should have isCompiled attribute for TypeScript", () => {
    expect(projects.ts.isCompiled).toBe(true);
  });

  it("should have availableScripts attribute", () => {
    const scripts = [
      "create-file",
      "error-script",
      "multiple-result",
      "non-exiting",
      "non-exporting",
      "post-install",
      "super-script",
      "throw-script",
    ];
    expect(projects.ts.availableScripts).toEqual(scripts);
  });

  it("should have scriptsDir attribute", () => {
    expect(projects.ts.scriptsDir).toBe(path.join(paths.ts.projectRoot, "node_modules/scripts-module/lib/scripts"));
  });

  it("should have configDir attribute", () => {
    expect(projects.ts.configDir).toBe(path.join(paths.ts.projectRoot, "node_modules/scripts-module/lib/config"));
  });

  it("should call fromScriptsDir() method", () => {
    expect(projects.ts.fromScriptsDir("a")).toBe(path.join(paths.ts.projectRoot, "node_modules/scripts-module/lib/scripts/a"));
  });

  it("should call fromConfigDir() method", () => {
    expect(projects.ts.fromConfigDir("a")).toBe(path.join(paths.ts.projectRoot, "node_modules/scripts-module/lib/config/a"));
  });

  it("should resolveModule", () => {
    expect(projects.ts.resolveModule("fs-extra")).toBe(path.join(__dirname, "../node_modules/fs-extra")); // Since this is not a real installation it returns current modules's node_modules
  });

  describe("resolveScriptsBin", () => {
    it("should resolve scripts binary", () => {
      expect(projects.ts.resolveScriptsBin({ executable: "echo-cli" })).toBe("echo-cli"); // Note: Not a realistic test
    });

    it("should resolve scripts binary if script module itself is also project", () => {
      const selfProject = new Project({
        cwd: path.join(__dirname, ".."),
        moduleRoot: path.join(__dirname, ".."),
        debug: true,
        logger: stubLogger,
      });
      expect(selfProject.resolveScriptsBin()).toBe("./src/index.ts");
    });
  });

  it("should return bin", () => {
    const base = TARGETBASE.replace(path.join(__dirname, ".."), ".");
    expect(projects.ts.bin("js-beautify")).toBe(`${base}/${TARGET}/project-module-ts/node_modules/.bin/js-beautify`);
  });

  describe("resolveBin", () => {
    it("should return path of binary if it has entry in bin same with module name among others.", () => {
      expect(projects.ts.resolveBin("js-beautify")).toBe("js-beautify");
    });

    it("should return binary name if it is in path.", () => {
      expect(projects.ts.resolveBin("echo-cli")).toBe("echo-cli");
    });

    it("should return path of binary", () => {
      expect(projects.ts.resolveBin("js-beautify")).toBe("js-beautify");
      expect(projects.ts.resolveBin("js-beautify", { cwd: path.join(__dirname, "..") })).toBe("js-beautify");
    });

    it("should return path of binary with differnt executable name", () => {
      expect(projects.ts.resolveBin("esprima", { executable: "esparse" })).toBe("esparse");
    });

    it("should throw if module not found", () => {
      expect(() => projects.ts.resolveBin("not-exists")).toThrow('Cannot resolve bin: "not-exists"');
    });

    it("should throw if bin not found in module", () => {
      expect(() => projects.ts.resolveBin("js-beautify", { executable: "not-exists" })).toThrow('There is no "bin.not-exists"');
    });

    it("should throw if bin not found in module not same with module name", () => {
      expect(() => projects.ts.resolveBin("typescript")).toThrow('There is no "bin.typescript"');
    });
  });

  it("should call fromModuleRoot()", () => {
    expect(projects.ts.fromModuleRoot("some/file.js")).toBe(path.join(paths.ts.moduleRoot, "some/file.js"));
  });

  describe("hasAnyDep() method", () => {
    it("should return true from hasAnyDep() for existing dependency", () => {
      expect(projects.ts.hasAnyDep("dotenv")).toBe(true);
    });

    it("should return false from hasAnyDep() for non-existing dependency", () => {
      expect(projects.ts.hasAnyDep("some-module")).toBe(false);
    });

    it("should return 1 from hasAnyDep() for existing dependency", () => {
      expect(projects.ts.hasAnyDep("dotenv", 1, 0)).toBe(1);
    });

    it("should return 0 from hasAnyDep() for non-existing dependency", () => {
      expect(projects.ts.hasAnyDep("some-module", 1, 0)).toBe(0);
    });
  });

  it("should return true from envIsSet() for existing environment variables", () => {
    process.env.SOME_VAR = "value";
    expect(projects.ts.envIsSet("SOME_VAR")).toBe(true);
  });

  it("should return false from envIsSet() for non-existing environment variables", () => {
    expect(projects.ts.envIsSet("SOME_NON_EXISTING_VAR")).toBe(false);
  });

  it("should return environment variable from parseEnv()", () => {
    process.env.SOME_VAR = "value";
    expect(projects.ts.parseEnv("SOME_VAR")).toBe("value");
  });

  it("should parse data returned from environment variable from parseEnv()", () => {
    process.env.SOME_VAR = '{"key": "value"}';
    expect(projects.ts.parseEnv("SOME_VAR")).toEqual({ key: "value" });
  });

  it("should return default environment variable from parseEnv() for non-existing variable", () => {
    expect(projects.ts.parseEnv("SOME_NON_EXISTING_VAR", "DEFAULT")).toBe("DEFAULT");
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
    });

    it("should return false for not opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("not-exists")).toBe(false);
    });

    it("should return 1 for opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("a", 1, 0)).toBe(1);
    });

    it("should return 0 for not opted in conifuration element", () => {
      expect(projects.ts.isOptedIn("not-exists", 1, 0)).toBe(0);
    });
  });

  describe("isOptedOut() method", () => {
    it("should return true for opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("z")).toBe(true);
    });

    it("should return false for not opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("not-exists")).toBe(false);
    });

    it("should return 1 for opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("z", 1, 0)).toBe(1);
    });

    it("should return 0 for not opted out conifuration element", () => {
      expect(projects.ts.isOptedOut("not-exists", 1, 0)).toBe(0);
    });
  });

  describe("executeScriptFileSync() method", () => {
    it("should execute script from scripts directory", () => {
      const result = projects.ts.executeScriptFileSync("multiple-result") as Array<any>;
      expect(result.length).toBe(2);
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

    it("should not process.exit() from script (exit: false)", () => {
      process.argv = ["node", "src", "non-exiting"];
      const result = projects.ts.executeFromCLISync() as ScriptResult;
      expect(result).toEqual({ exit: false, status: 0 });
    });

    it("should return exit code from script with single result", () => {
      process.argv = ["node", "src", "create-file"];
      const exit = projects.ts.executeFromCLISync() as ScriptResult;
      const content = projects.ts.readFileSync("created-by-script.txt");
      expect(content).toBe("cli");
      projects.ts.deleteFileSync("created-by-script.txt");
      expect(exit).toEqual({ exitCode: 0 });
    });

    it("should return status from script with single result (exit = false)", () => {
      process.argv = ["node", "src", "create-file"];
      const result = projects.ts.executeFromCLISync({ exit: false }) as ScriptResult;
      const content = projects.ts.readFileSync("created-by-script.txt");
      expect(content).toBe("cli");
      projects.ts.deleteFileSync("created-by-script.txt");
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
      expect(projects.ts.hasScriptSync("create-file")).toBe(path.join(paths.ts.moduleRoot, "lib/scripts/create-file.js"));
    });

    it("should return script name for existing scripts with script extension", () => {
      expect(projects.ts.hasScriptSync("create-file.js")).toBe(path.join(paths.ts.moduleRoot, "lib/scripts/create-file.js"));
    });

    it("should return undefined for non-existing scripts", () => {
      expect(projects.ts.hasScriptSync("not-exists.js")).toBe(undefined);
    });
  });

  describe("executeSync() method", () => {
    it("should execute single command", () => {
      const result = projects.ts.executeSync("echo");
      expect(result.status).toBe(0);
    });

    it("should execute single failing command", () => {
      const result = projects.ts.executeSync("non-existing-command");
      expect(result.error).toBeDefined();
    });

    it("should execute single command with parameters", () => {
      const result = projects.ts.executeSync(["echo", [""]]);
      expect(result.status).toBe(0);
    });

    it("should execute multiple commands scripts", () => {
      const result = projects.ts.executeSync("echo", ["echo", [""]]);
      expect(result.status).toBe(0);
    });

    it("should execute multiple serial commands which some fails", () => {
      const result = projects.ts.executeSync("echo", "not-existing-cmd", ["echo", [""]]);
      expect([result.error !== undefined, result.previousResults.length]).toEqual([true, 1]);
    });

    it("should execute multiple concurrent commands", () => {
      const result = projects.ts.executeSync({ echo1: "echo", echo2: ["echo", [""]] });
      expect(result.status).toBe(0);
    });

    it("should execute multiple serial and concurrent commands", () => {
      const result = projects.ts.executeSync(["echo", [""]], null, { echo1: "echo", echo2: ["echo", [""]] }, ["echo", [""]]);
      expect(result.status).toBe(0);
    });

    it("should return success if no commands provided", () => {
      const result = projects.ts.executeSync();
      expect(result.status).toBe(0);
    });
  });

  describe("executeWithoutExitSync() method", () => {
    it("should execute single command", () => {
      const result = projects.ts.executeWithoutExitSync("echo");
      expect(result.exit).toBe(false);
    });
  });
});
