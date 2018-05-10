import path from "path";
import { createProject, getPaths, stubLogger, clear, TARGETBASE } from "./__test_supplements__/test-helper";
import { ScriptKit } from "./index";

const TARGET = "temp-test-script-kit";

describe("ScriptKit", () => {
  const paths = getPaths("project-module-ts", TARGET);
  let project;
  let scriptFile;
  let scriptKit;
  let superScriptFile;

  beforeAll(async () => {
    project = await createProject("project-module-ts", TARGET);
    scriptFile = project.hasScriptSync("multiple-result");
    scriptKit = new ScriptKit(project, "multiple-result");
    superScriptFile = project.hasScriptSync("super-script");
  });

  afterAll(async () => {
    await clear(TARGET);
  });

  it("should create instance", () => {
    expect(scriptKit instanceof ScriptKit).toBe(true);
  });

  it("should throw if script cannot be found", () => {
    expect(() => new ScriptKit(project, "not-exists")).toThrow("cannot be found in");
  });

  it("should have dir attribute", () => {
    expect(scriptKit.dir).toBe(path.join(paths.moduleRoot, "lib/scripts"));
  });

  it("should have configDir attribute", () => {
    expect(scriptKit.configDir).toBe(path.join(paths.moduleRoot, "lib/config"));
  });

  it("should have extension attribute", () => {
    expect(scriptKit.extension).toBe("js");
  });

  it("should have here() method", () => {
    expect(scriptKit.here("a")).toBe(path.join(paths.moduleRoot, "lib/scripts/a"));
  });

  it("should have hereRelative() method", () => {
    const base = TARGETBASE.replace(path.join(__dirname, ".."), ".");
    expect(scriptKit.hereRelative("a")).toBe(`${base}/${TARGET}/project-module-ts/node_modules/scripts-module/lib/scripts/a`);
  });

  it("should have executeSubScriptSync() method", () => {
    const result = project.executeScriptFileSync("super-script");
    expect(result).toEqual({ status: 0 });
  });
});
