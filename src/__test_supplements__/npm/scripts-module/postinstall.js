const { Project } = require("script-helper");
const fs = require("fs");

const project = new Project({ debug: true, logLevel: "info" });

function init() {
  project.package.data.scripts.deneme = "echo 1";
  project.package.set("scripts.deneme2", "echo 2");
  project.deleteFile("package.json");
  project.writeFile("test.txt", "test text");
  project.save();
}

try {
  init();
} catch (e) {
  project.log.error(e);
  process.exit(1);
}
