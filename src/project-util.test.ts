import path from "path";
import { getModuleRoot, getProjectPackage } from "./project-util";

describe("getModuleRoot() function", () => {
  it("should throw using stack when not in a real installation", () => {
    expect(() => getModuleRoot()).toThrow("Cannot get module root");
  });
});

describe("getProjectPackage() function", () => {
  it("should throw if package.json cannot be found up in the cwd", () => {
    expect(() => getProjectPackage("..", {})).toThrow("Cannot find project root");
  });

  it("should throw if package.json cannot be found up in the cwd and current module is not script module", () => {
    expect(() => getProjectPackage(".", {})).toThrow("Cannot find project root");
  });
});
