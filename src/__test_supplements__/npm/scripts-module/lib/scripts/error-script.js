const Project = require("script-helper");

function script(project, args, s) {
  return [{ status: 1, error: new Error("error object") }, { status: 1, error: "text" }, { status: 1 }];
}

module.exports = { script };