import path from "path";
import { findModuleRoot, getPackageAndDir } from "./project-util";

describe("findModuleRoot() function", () => {
  it("should throw using stack when not in a real installation", () => {
    const previous = process.cwd();
    expect(() => findModuleRoot()).toThrow("Cannot find module root");
  });

  it("should return main required package (useStack: false)", () => {
    expect(findModuleRoot({ useStack: false })).toBe(path.join(__dirname, "../package.json"));
  });
});

describe("getPackageAndDir() function", () => {
  it("should throw using stack when not in a real installation", () => {
    expect(() => getPackageAndDir()).toThrow("Cannot find package.json and project directory");
  });

  it("should throw if package.json cannot be found up in the cwd", () => {
    expect(() => getPackageAndDir({ cwd: ".." })).toThrow("Project directory cannot be found in cwd");
  });
});
