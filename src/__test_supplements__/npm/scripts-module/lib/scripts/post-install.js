const Project = require("script-helper");

function script(project, args) {
  const data = { name: project.name, moduleName: project.moduleName, args: args.join(",") };
  project.writeFileSync("post-install.json", data, { serialize: true, forma: "json", track: false });
}

module.exports = { script };
