#!/usr/bin/env node

const path = require("path");
const { Project } = require("script-helper");
const project = new Project({ debug: false, logLevel: "info", filesDir: __dirname, moduleRoot: path.join(__dirname, "..") });
module.exports = project; // If you don't want to use execute() helper, you can access exported project via require.

// If called from directly from CLI
if (require.main === module) {
  try {
    const result = project.executeFromCLISync(); // Optional helper which executes scripts in 'scripts' directory, which is in same directory with this file.
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
