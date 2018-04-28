#!/usr/bin/env node

const { Project, execute } = require("script-helper");
const project = new Project();
module.exports = project; // If you don't want to use execute() helper, you can access exported project via require.

// If called from directly from CLI
if (require.main === module) {
  try {
    execute({ project }); // Optional helper which executes scripts in 'scripts' directory, which is in same directory with this file.
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
