const Project = require("script-helper");

function script(project, args, s) {
  return s.executeSubScriptSync("sub-script", args);
}

module.exports = { script };
