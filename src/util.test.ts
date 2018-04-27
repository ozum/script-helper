import { replaceArgumentName, getFromHereFunctions } from "./util";
import path from "path";

describe("replaceArgumentName()", () => {
  it("should replace argument name if it exists", () => {
    expect(replaceArgumentName(["--a", "--b"], ["--a"], "--c")).toEqual(["--c", "--b"]);
  });

  it("should return arguments as it is if argument name does not exist", () => {
    expect(replaceArgumentName(["--a", "--b"], ["--x"], "--c")).toEqual(["--a", "--b"]);
  });
});

describe("fromHereFunctions()", () => {
  const { here, hereRelative } = getFromHereFunctions(__dirname);

  it("should return absolute path for path relative to base path", () => {
    expect(here("../a")).toBe(path.join(__dirname, "../a"));
  });

  it("should return relative path from cwd for path relative to base path", () => {
    expect(hereRelative("a")).toBe("./src/a");
  });
});
