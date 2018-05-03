import { replaceArgumentName } from "./index";
import path from "path";

describe("replaceArgumentName()", () => {
  it("should replace argument name if it exists", () => {
    expect(replaceArgumentName(["--a", "--b"], ["--a"], "--c")).toEqual(["--c", "--b"]);
  });

  it("should return arguments as it is if argument name does not exist", () => {
    expect(replaceArgumentName(["--a", "--b"], ["--x"], "--c")).toEqual(["--a", "--b"]);
  });
});
