const Project = require("script-helper");

function script(project, args, s) {
  const data = { name: project.name, moduleName: project.moduleName, args: args.join(",") };
  project.writeFileSync("post-install.json", data, { serialize: true, format: "json", track: false });
  return { status: 0 };
}

module.exports = { script };
