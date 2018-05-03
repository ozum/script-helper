const Project = require("script-helper");

function script(project, args, s) {
  project.writeFileSync("created-by-script.txt", "cli", { track: false, force: true });
  return { status: 0 };
}

module.exports = { script };
