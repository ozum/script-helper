<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# script-helper

Helper for creating and maintaining boilerplates, configurations and script modules for npm projects.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Description](#description)
* [Inspired](#inspired)
* [Synopsis](#synopsis)
  * [Module Hierarchy](#module-hierarchy)
  * [Configuration](#configuration)
  * ['my-scripts' module](#my-scripts-module)
    * [my-scripts/package.json](#my-scriptspackagejson)
    * [my-scripts/lib/index.js](#my-scriptslibindexjs)
    * [my-scripts/lib/scripts/init.js](#my-scriptslibscriptsinitjs)
    * [my-scripts/lib/scripts/reset.js](#my-scriptslibscriptsresetjs)
    * [my-scripts/lib/scripts/test.js](#my-scriptslibscriptstestjs)
    * [my-scripts/lib/scripts/build.js](#my-scriptslibscriptsbuildjs)
  * [npm project module](#npm-project-module)
    * [package.json](#packagejson)
* [Configuration](#configuration-1)
* [Highlights](#highlights)
  * [Notes](#notes)
    * [Disable Tracking](#disable-tracking)
* [API](#api)
  * [Classes](#classes)
  * [Functions](#functions)
  * [Typedefs](#typedefs)
  * [Project](#project)
    * [new Project([options])](#new-projectoptions)
    * [project.name : <code>string</code>](#projectname--codestringcode)
    * [project.moduleName : <code>string</code>](#projectmodulename--codestringcode)
    * [project.moduleRoot : <code>string</code>](#projectmoduleroot--codestringcode)
    * [project.config : <code>Object</code>](#projectconfig--codeobjectcode)
    * [project.package : <code>DataObject</code>](#projectpackage--codedataobjectcode)
    * [project.isCompiled : <code>boolean</code>](#projectiscompiled--codebooleancode)
    * [project.isTypeScript : <code>boolean</code>](#projectistypescript--codebooleancode)
    * [project.availableScripts : <code>Array.&lt;string&gt;</code>](#projectavailablescripts--codearrayltstringgtcode)
    * [project.scriptsDir : <code>string</code>](#projectscriptsdir--codestringcode)
    * [project.configDir : <code>string</code>](#projectconfigdir--codestringcode)
    * [project.root : <code>string</code>](#projectroot--codestringcode)
    * [project.sourceRoot : <code>string</code>](#projectsourceroot--codestringcode)
    * [project.track : <code>boolean</code>](#projecttrack--codebooleancode)
    * [project.logger : <code>BasicLogger</code>](#projectlogger--codebasicloggercode)
    * [project.logLevel : <code>string</code>](#projectloglevel--codestringcode)
    * [project.resolveModule(name) ⇒ <code>string</code>](#projectresolvemodulename-%E2%87%92-codestringcode)
    * [project.resolveScriptsBin([options], [cwd]) ⇒ <code>string</code> \| <code>undefined</code>](#projectresolvescriptsbinoptions-cwd-%E2%87%92-codestringcode-%5C-codeundefinedcode)
    * [project.bin(executable) ⇒ <code>string</code>](#projectbinexecutable-%E2%87%92-codestringcode)
    * [project.resolveBin(modName, [options], [executable], [cwd]) ⇒ <code>string</code>](#projectresolvebinmodname-options-executable-cwd-%E2%87%92-codestringcode)
    * [project.fromModuleRoot(...part) ⇒ <code>string</code>](#projectfrommodulerootpart-%E2%87%92-codestringcode)
    * [project.fromConfigDir(...part) ⇒ <code>string</code>](#projectfromconfigdirpart-%E2%87%92-codestringcode)
    * [project.fromScriptsDir(...part) ⇒ <code>string</code>](#projectfromscriptsdirpart-%E2%87%92-codestringcode)
    * [project.hasAnyDep(deps, [t], [f]) ⇒ <code>\*</code>](#projecthasanydepdeps-t-f-%E2%87%92-code%5Ccode)
    * [project.envIsSet(name) ⇒ <code>boolean</code>](#projectenvissetname-%E2%87%92-codebooleancode)
    * [project.parseEnv(name, defaultValue) ⇒ <code>\*</code>](#projectparseenvname-defaultvalue-%E2%87%92-code%5Ccode)
    * [project.executeFromCLISync(exit) ⇒ <code>ScriptResult</code> \| <code>void</code>](#projectexecutefromclisyncexit-%E2%87%92-codescriptresultcode-%5C-codevoidcode)
    * [project.executeScriptFileSync(scriptFile, [args]) ⇒ <code>ScriptResult</code> \| <code>Array.&lt;ScriptResult&gt;</code>](#projectexecutescriptfilesyncscriptfile-args-%E2%87%92-codescriptresultcode-%5C-codearrayltscriptresultgtcode)
    * [project.hasScriptSync(scriptFile) ⇒ <code>string</code> \| <code>undefined</code>](#projecthasscriptsyncscriptfile-%E2%87%92-codestringcode-%5C-codeundefinedcode)
    * [project.executeSync(executable) ⇒ <code>ScriptResult</code>](#projectexecutesyncexecutable-%E2%87%92-codescriptresultcode)
    * [project.getConcurrentlyArgs(scripts, [options], [killOthers]) ⇒ <code>Array.&lt;string&gt;</code>](#projectgetconcurrentlyargsscripts-options-killothers-%E2%87%92-codearrayltstringgtcode)
    * [project.isOptedOut(key, [t], [f]) ⇒ <code>\*</code>](#projectisoptedoutkey-t-f-%E2%87%92-code%5Ccode)
    * [project.isOptedIn(key, [t], [f]) ⇒ <code>\*</code>](#projectisoptedinkey-t-f-%E2%87%92-code%5Ccode)
    * [project.fromRoot(...part) ⇒ <code>string</code>](#projectfromrootpart-%E2%87%92-codestringcode)
    * [project.fromSourceRoot(...part) ⇒ <code>string</code>](#projectfromsourcerootpart-%E2%87%92-codestringcode)
    * [project.isDataFile(projectFile) ⇒ <code>boolean</code>](#projectisdatafileprojectfile-%E2%87%92-codebooleancode)
    * [project.hasFileSync(projectFiles, [t], [f]) ⇒ <code>\*</code>](#projecthasfilesyncprojectfiles-t-f-%E2%87%92-code%5Ccode)
    * [project.saveSync() ⇒ <code>void</code>](#projectsavesync-%E2%87%92-codevoidcode)
    * [project.resetSync() ⇒ <code>void</code>](#projectresetsync-%E2%87%92-codevoidcode)
    * [project.resetFileSync(projectFile) ⇒ <code>void</code>](#projectresetfilesyncprojectfile-%E2%87%92-codevoidcode)
    * [project.getFileDetailsSync(projectFile, options) ⇒ <code>FileDetail</code>](#projectgetfiledetailssyncprojectfile-options-%E2%87%92-codefiledetailcode)
    * [project.getFileHashSync(projectFile) ⇒ <code>string</code>](#projectgetfilehashsyncprojectfile-%E2%87%92-codestringcode)
    * [project.getDataObjectSync(projectFile, [options]) ⇒ <code>DataObject</code>](#projectgetdataobjectsyncprojectfile-options-%E2%87%92-codedataobjectcode)
    * [project.createSymLinkSync(targetFile, projectFile, [options]) ⇒ <code>void</code>](#projectcreatesymlinksynctargetfile-projectfile-options-%E2%87%92-codevoidcode)
    * [project.readFileSync(projectFile, [options]) ⇒ <code>\*</code>](#projectreadfilesyncprojectfile-options-%E2%87%92-code%5Ccode)
    * [project.readFileDetailedSync(projectFile, [options]) ⇒ <code>Object</code>](#projectreadfiledetailedsyncprojectfile-options-%E2%87%92-codeobjectcode)
    * [project.writeFileSync(projectFile, data, [options]) ⇒ <code>void</code>](#projectwritefilesyncprojectfile-data-options-%E2%87%92-codevoidcode)
    * [project.deleteFileSync(projectFile, [options]) ⇒ <code>void</code>](#projectdeletefilesyncprojectfile-options-%E2%87%92-codevoidcode)
    * [project.copyFileSync(sourceFile, projectFile, [options]) ⇒ <code>void</code>](#projectcopyfilesyncsourcefile-projectfile-options-%E2%87%92-codevoidcode)
    * [project.createDirSync(projectDir, [options]) ⇒ <code>void</code>](#projectcreatedirsyncprojectdir-options-%E2%87%92-codevoidcode)
    * [project.deleteDirSync(projectDir, [options]) ⇒ <code>void</code>](#projectdeletedirsyncprojectdir-options-%E2%87%92-codevoidcode)
  * [DataObject](#dataobject)
    * [new DataObject([data], [options])](#new-dataobjectdata-options)
    * [dataObject.isChanged : <code>boolean</code>](#dataobjectischanged--codebooleancode)
    * [dataObject.data : <code>Data</code>](#dataobjectdata--codedatacode)
    * [dataObject.original : <code>Data</code>](#dataobjectoriginal--codedatacode)
    * [dataObject.snapshot : <code>Data</code>](#dataobjectsnapshot--codedatacode)
    * [dataObject.has(props, [t], [f]) ⇒ <code>\*</code>](#dataobjecthasprops-t-f-%E2%87%92-code%5Ccode)
    * [dataObject.hasSubProp(prop, subProps, [t], [f]) ⇒ <code>\*</code>](#dataobjecthassubpropprop-subprops-t-f-%E2%87%92-code%5Ccode)
    * [dataObject.get(path) ⇒ <code>\*</code>](#dataobjectgetpath-%E2%87%92-code%5Ccode)
    * [dataObject.set(path, value) ⇒ <code>this</code>](#dataobjectsetpath-value-%E2%87%92-codethiscode)
    * [dataObject.setObject(data, [options]) ⇒ <code>this</code>](#dataobjectsetobjectdata-options-%E2%87%92-codethiscode)
    * [dataObject.remove(path, [options]) ⇒ <code>this</code>](#dataobjectremovepath-options-%E2%87%92-codethiscode)
    * [dataObject.reset() ⇒ <code>Array.&lt;Operation&gt;</code>](#dataobjectreset-%E2%87%92-codearrayltoperationgtcode)
  * [replaceArgumentName(args, names, newName) ⇒ <code>Array</code>](#replaceargumentnameargs-names-newname-%E2%87%92-codearraycode)
  * [Options : <code>Object</code>](#options--codeobjectcode)
  * [Executable : <code>string</code> \| <code>Array.&lt;(string\|Array.&lt;string&gt;\|SpawnOptions)&gt;</code>](#executable--codestringcode-%5C-codearrayltstring%5Carrayltstringgt%5Cspawnoptionsgtcode)
  * [ScriptResult : <code>Object</code>](#scriptresult--codeobjectcode)
  * [Script : <code>function</code>](#script--codefunctioncode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

Provides utility class and related methods to create script modules which manipulate npm projects such as create/copy/remove files, directories and data files.
Also provides `reset()` method which reverses all modifications made by this module.

Script modules help to develop npm modules without config. A very good article explaining this concept is written by Kent C. Dodds which can be found
[here](https://blog.kentcdodds.com/automation-without-config-412ab5e47229).

With `script-helper`, it is very easy to cerate custom script modules.

Test coverage is 100%, and module is tested with real `npm install` command instead of mocks. This is why initialization of test is slow.
Since, installed files are same files but in different location, coverage report cannot be calculated from them. To overcome, a few tests are performed twice,
both on main module and on real installation. Tests on real installation are performed to get real results, and tests on module are performed to get coverage
report.

# Inspired

Inspired by [kcd-scripts](https://github.com/kentcdodds/kcd-scripts) utility functions, thanks to Kent C. Dodds and all [contributors](https://github.com/kentcdodds/kcd-scripts#contributors).

# Synopsis

## Module Hierarchy

```
┏ 'project' module: npm project.
┣━━ 'my-scripts' module: Your custom scripts module to manipulate npm projects. Uses `script-helper` (this module).
┣━━━━ 'script-helper' module: This module.
```

## Configuration

Configuration is based on [cosmiconfig](https://www.npmjs.com/package/cosmiconfig). See below for details.

## 'my-scripts' module

In examples below, it is assumed that your scripts module is named and uploaded to npm as `my-scripts`. You can use name you choose.

### my-scripts/package.json

```json
{
  "bin": { "my-scripts": "lib/index.js" },
  "scripts": {
    "postinstall": "my-scripts init",
    "preuninstall": "my-scripts reset",
    "test": "my-scripts test"
  }
}
```

### my-scripts/lib/index.js

```js
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
```

### my-scripts/lib/scripts/init.js

```js
function script(project, args) {
  // Reset previous modifications
  project.reset();

  // Add some scripts to package.json. (Does not overwrite if target keys are already defined or changed by user.)
  // You can change other keys by hand.
  project.package.set("scripts.test", "my-scripts test").set("scripts.compile", "my-scripts compile");

  // Create a .env file with default content. (Does not overwirte if it is already created or changed by user.)
  project.writeFile(".env", "PASSWORD=my-super-secret-password");

  // Create a symlink in project which points to a file in your custom module.
  // project/tsconfig.json -> project/node_modules/my-scripts/lib/config/tsconfig.json
  project.createSymLink("lib/config/tsconfig.json", "tsconfig.json");

  // Copy a file from your custom module to project.
  // Copy: project/node_modules/my-scripts/lib/config/changelog.md -> project/CHANGELOG.md
  project.copyFile("lib/config/changelog.md", "CHANGELOG.md");
}

// Function to be called must be exported under 'script' key if you use 'execute' helper.
module.exports = { script };
```

### my-scripts/lib/scripts/reset.js

```js
function script(project) {
  // Reset all created files, symlinks, changed JSON and YAML entries if they are not changed by user.
  // All modifications are tracked in a JSON file called 'my-scripts-registry.json'
  // 'my-scripts' is the name of your module and file name is shaped according the name of your module.
  project.reset();
}

module.exports = { script };
```

### my-scripts/lib/scripts/test.js

```js
function script(project) {
  // Your test related script. Do some testing stuff, execute mocha, jest or spawn something.
}

module.exports = { script };
```

### my-scripts/lib/scripts/build.js

```js
function script(project) {
  // Your build related script.
}

module.exports = { script };
```

and so on...

## npm project module

### package.json

Instead of adding scripts below manually, you can create an init script and add it to `postinstall` (see init example above)

```json
{
  "scripts": {
    "test": "my-scripts test"
  }
}
```

```
> npm test

or

> node_modules/.bin/my-scripts test
```

# Configuration

Your scripts module (i.e. `my-scripts`) has builtin [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) support. If user puts a cosmiconfig compatibale configuration in npm project,
you can access configration via `project.config()` method in your script functions.

By default you can design your own configuration schema. `script-helper` provides some defaults and related methods, as described below:

| Key      | Type             | Method                 | Description              |
| -------- | ---------------- | ---------------------- | ------------------------ |
| `optIn`  | `Array.<string>` | `project.isOptedIn()`  | Lists opted in options.  |
| `optOut` | `Array.<string>` | `project.isOptedOut()` | Lists opted out options. |

# Highlights

* Tries best for non-destructive modifications.
* Tracks all modifications in a registry json file.
* Provides `project.reset()` method to reset all changes made by this module.
* Changes in JSON and YAML files are tracked by key level using [resettable](https://www.npmjs.com/package/resettable).
  * User created keys and values would not be deleted/modified if `{ force: true }` ıs not used.
  * User can further modify data files. They do not interfere with this module's targets.
  * CAVEAT: [resettable](https://www.npmjs.com/package/resettable) cannot handle all cases, please see it's documentation and always use version control.
* Changes in non data files are tracked using SHA-1 hash.
* JSON, YAML and JavaScript files are normalized in memory before comparison to eliminate white-space noise.
* Provides `execute()` helper function to execute your scripts and handle errors and saving project data files and registry.
* Provides `project.save()` method for saving registry json file and changes made to data files.

## Notes

* For tracking data files by key level, use `project.readDataFile()` method, which returns [DataObject](#dataobject)
  * Methods of [DataObject](#dataobject) such as `set()`, `remove()` provides automatic log messages.
  * You can directly access data using `.data` property.
  * Tracking still works if you manipulate data from `.data` directly, because modifications are calculated during file save.
* All data files read with `project.readDataFile()` are saved during project save (`project.save()`).
  * Do not use `project.writeFile()` for those files.
* If user modifies file or data created by this library, they are not modified further if not forced with `{ force: true }` option.
* DO NOT forget `project.save()` after you finish your modifications.
  * Or use `execute()` helper function, which saves project even after error in your scripts, and handle `process.exit()` as necessary.
* `reset()` method does not recreate deleted files and directories.

### Disable Tracking

To completely disable tracking, set `track` to `false`in constructor:

```js
const project = new Project({ track: false });
```

Tracking may be enabled/disabled per operation:

```
project.writeFile("some.txt", "content", { track: false });
```

Please note that disabling tracking does not permit automatically modifying user created files / content.
`force` option is still needed to overwrite. However non-tracked modifications are treated like user created content.

For example:

```js
// Assume user.txt is created manually by user beforehand.
project.deleteFile("user.txt"); // NOT deleted, because it is created by user.
project.writeFile("auto.txt", "x"); // Created and tracked. It is known this file is created by this library.
project.deleteFile("auto.txt"); // Deleted, because it is known that file was created by this library.
project.writeFile("non-tracked.txt", "x", { track: false }); // Created and tracked. It is known this file is created by this library.
project.deleteFile("non-tracked.txt"); // NOT deleted, because it is not tracked, and it is unknown created by whom.
project.deleteFile("non-tracked.txt", { force: true }); // Deleted, because `force` is in effect.
```

# API

## Classes

<dl>
<dt><a href="#Project">Project</a></dt>
<dd><p>Provides utility class and related methods to create modules which manipulate npm projects such as create/copy/remove files, directories and data files.
Also provides <code>reset()</code> method which reverses all modifications made by this module.</p></dd>
<dt><a href="#DataObject">DataObject</a></dt>
<dd><p>This class is used for modifications of the given object.</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#replaceArgumentName">replaceArgumentName(args, names, newName)</a> ⇒ <code>Array</code></dt>
<dd><p>Returns a new array, after replacing output destination argument name with a new name. Does not mutate original array.</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd><p>to provide spawn method.</p></dd>
<dt><a href="#Executable">Executable</a> : <code>string</code> | <code>Array.&lt;(string|Array.&lt;string&gt;|SpawnOptions)&gt;</code></dt>
<dd><p>Type for holding executable. It may be string to store executable name without arguments. For executable
with arguments or options it is a tuple <code>[bin-name, [arg1, arg2, arg3], spawn-options]</code></p></dd>
<dt><a href="#ScriptResult">ScriptResult</a> : <code>Object</code></dt>
<dd><p>Type for returned value from CLI command.</p></dd>
<dt><a href="#Script">Script</a> : <code>function</code></dt>
<dd><p>Type for script function.</p></dd>
</dl>

<a name="Project"></a>

## Project

<p>Provides utility class and related methods to create modules which manipulate npm projects such as create/copy/remove files, directories and data files.
Also provides <code>reset()</code> method which reverses all modifications made by this module.</p>

**Kind**: global class

* [Project](#Project)
  * [new Project([options])](#new_Project_new)
  * [.name](#Project+name) : <code>string</code>
  * [.moduleName](#Project+moduleName) : <code>string</code>
  * [.moduleRoot](#Project+moduleRoot) : <code>string</code>
  * [.config](#Project+config) : <code>Object</code>
  * [.package](#Project+package) : [<code>DataObject</code>](#DataObject)
  * [.isCompiled](#Project+isCompiled) : <code>boolean</code>
  * [.isTypeScript](#Project+isTypeScript) : <code>boolean</code>
  * [.availableScripts](#Project+availableScripts) : <code>Array.&lt;string&gt;</code>
  * [.scriptsDir](#Project+scriptsDir) : <code>string</code>
  * [.configDir](#Project+configDir) : <code>string</code>
  * [.root](#ResettableFile+root) : <code>string</code>
  * [.sourceRoot](#ResettableFile+sourceRoot) : <code>string</code>
  * [.track](#ResettableFile+track) : <code>boolean</code>
  * [.logger](#ResettableFile+logger) : <code>BasicLogger</code>
  * [.logLevel](#ResettableFile+logLevel) : <code>string</code>
  * [.resolveModule(name)](#Project+resolveModule) ⇒ <code>string</code>
  * [.resolveScriptsBin([options], [cwd])](#Project+resolveScriptsBin) ⇒ <code>string</code> \| <code>undefined</code>
  * [.bin(executable)](#Project+bin) ⇒ <code>string</code>
  * [.resolveBin(modName, [options], [executable], [cwd])](#Project+resolveBin) ⇒ <code>string</code>
  * [.fromModuleRoot(...part)](#Project+fromModuleRoot) ⇒ <code>string</code>
  * [.fromConfigDir(...part)](#Project+fromConfigDir) ⇒ <code>string</code>
  * [.fromScriptsDir(...part)](#Project+fromScriptsDir) ⇒ <code>string</code>
  * [.hasAnyDep(deps, [t], [f])](#Project+hasAnyDep) ⇒ <code>\*</code>
  * [.envIsSet(name)](#Project+envIsSet) ⇒ <code>boolean</code>
  * [.parseEnv(name, defaultValue)](#Project+parseEnv) ⇒ <code>\*</code>
  * [.executeFromCLISync(exit)](#Project+executeFromCLISync) ⇒ [<code>ScriptResult</code>](#ScriptResult) \| <code>void</code>
  * [.executeScriptFileSync(scriptFile, [args])](#Project+executeScriptFileSync) ⇒ [<code>ScriptResult</code>](#ScriptResult) \| [<code>Array.&lt;ScriptResult&gt;</code>](#ScriptResult)
  * [.hasScriptSync(scriptFile)](#Project+hasScriptSync) ⇒ <code>string</code> \| <code>undefined</code>
  * [.executeSync(executable)](#Project+executeSync) ⇒ [<code>ScriptResult</code>](#ScriptResult)
  * [.getConcurrentlyArgs(scripts, [options], [killOthers])](#Project+getConcurrentlyArgs) ⇒ <code>Array.&lt;string&gt;</code>
  * [.isOptedOut(key, [t], [f])](#Project+isOptedOut) ⇒ <code>\*</code>
  * [.isOptedIn(key, [t], [f])](#Project+isOptedIn) ⇒ <code>\*</code>
  * [.fromRoot(...part)](#ResettableFile+fromRoot) ⇒ <code>string</code>
  * [.fromSourceRoot(...part)](#ResettableFile+fromSourceRoot) ⇒ <code>string</code>
  * [.isDataFile(projectFile)](#ResettableFile+isDataFile) ⇒ <code>boolean</code>
  * [.hasFileSync(projectFiles, [t], [f])](#ResettableFile+hasFileSync) ⇒ <code>\*</code>
  * [.saveSync()](#ResettableFile+saveSync) ⇒ <code>void</code>
  * [.resetSync()](#ResettableFile+resetSync) ⇒ <code>void</code>
  * [.resetFileSync(projectFile)](#ResettableFile+resetFileSync) ⇒ <code>void</code>
  * [.getFileDetailsSync(projectFile, options)](#ResettableFile+getFileDetailsSync) ⇒ <code>FileDetail</code>
  * [.getFileHashSync(projectFile)](#ResettableFile+getFileHashSync) ⇒ <code>string</code>
  * [.getDataObjectSync(projectFile, [options])](#ResettableFile+getDataObjectSync) ⇒ [<code>DataObject</code>](#DataObject)
  * [.createSymLinkSync(targetFile, projectFile, [options])](#ResettableFile+createSymLinkSync) ⇒ <code>void</code>
  * [.readFileSync(projectFile, [options])](#ResettableFile+readFileSync) ⇒ <code>\*</code>
  * [.readFileDetailedSync(projectFile, [options])](#ResettableFile+readFileDetailedSync) ⇒ <code>Object</code>
  * [.writeFileSync(projectFile, data, [options])](#ResettableFile+writeFileSync) ⇒ <code>void</code>
  * [.deleteFileSync(projectFile, [options])](#ResettableFile+deleteFileSync) ⇒ <code>void</code>
  * [.copyFileSync(sourceFile, projectFile, [options])](#ResettableFile+copyFileSync) ⇒ <code>void</code>
  * [.createDirSync(projectDir, [options])](#ResettableFile+createDirSync) ⇒ <code>void</code>
  * [.deleteDirSync(projectDir, [options])](#ResettableFile+deleteDirSync) ⇒ <code>void</code>

<a name="new_Project_new"></a>

### new Project([options])

| Param                     | Type                              | Default                                 | Description                                                                                                                                                                                 |
| ------------------------- | --------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [options]                 | <code>Object</code>               |                                         | <p>Options</p>                                                                                                                                                                              |
| [options.filesDir]        | <code>boolean</code>              | <code>require.main.filename</code>      | <p>Directory of <code>config</code> and <code>script</code> directories. Default value assumes file called from CLI resides same dir with <code>scripts</code> and <code>config</code>.</p> |
| [options.track]           | <code>boolean</code>              |                                         | <p>Sets default tracking option for methods.</p>                                                                                                                                            |
| [options.sortPackageKeys] | <code>Array.&lt;string&gt;</code> | <code>[&quot;scripts&quot;]</code>      | <p>Default keys to be sorted in package.json file.</p>                                                                                                                                      |
| [options.logLevel]        | <code>LogLevel</code>             | <code>&quot;info&quot;</code>           | <p>Sets log level. (&quot;error&quot;, &quot;warn&quot;, &quot;info&quot;, &quot;debug&quot;, &quot;verbose&quot;, &quot;silly&quot;)</p>                                                   |
| [options.cwd]             | <code>string</code>               | <code>&quot;[project root]&quot;</code> | <p>[<code>Special</code>] Working directory of project root. (Only for special purposes, normally not necessary.)</p>                                                                       |
| [options.moduleRoot]      | <code>string</code>               | <code>&quot;[module root]&quot;</code>  | <p>[<code>Special</code>] Root of the module using this library. (Only for special purposes, normally not necessary.)</p>                                                                   |
| [options.debug]           | <code>boolean</code>              | <code>false</code>                      | <p>Turns on debug mode.</p>                                                                                                                                                                 |

<a name="Project+name"></a>

### project.name : <code>string</code>

<p>Module name which provides configuration services to project using this library.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+moduleName"></a>

### project.moduleName : <code>string</code>

<p>Module name which provides configuration services to project using this library.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+moduleRoot"></a>

### project.moduleRoot : <code>string</code>

<p>Root directory path of module which provides configuration services to project using this library.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+config"></a>

### project.config : <code>Object</code>

<p>Configuration for module.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+package"></a>

### project.package : [<code>DataObject</code>](#DataObject)

<p>[DataObject](#DataObject) instance for <code>package.json</code> of project. Also this is a shorthand for <code>project.readDataFile(&quot;package.json&quot;)</code></p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+isCompiled"></a>

### project.isCompiled : <code>boolean</code>

<p>Whether project is a compiled project via TypeScript or Babel.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+isTypeScript"></a>

### project.isTypeScript : <code>boolean</code>

<p>Whether project is a TypeScript project.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+availableScripts"></a>

### project.availableScripts : <code>Array.&lt;string&gt;</code>

<p>Lists of available scripts in scripts folder.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+scriptsDir"></a>

### project.scriptsDir : <code>string</code>

<p>Path of the scripts dir.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="Project+configDir"></a>

### project.configDir : <code>string</code>

<p>Path of the config dir.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="ResettableFile+root"></a>

### project.root : <code>string</code>

<p>Root path for files to be managed. It is the directory registry file is located.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="ResettableFile+sourceRoot"></a>

### project.sourceRoot : <code>string</code>

<p>Source root path for files to be managed. It is the source root directory given during object construction.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="ResettableFile+track"></a>

### project.track : <code>boolean</code>

<p>Whether files of the project are tracked by default.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="ResettableFile+logger"></a>

### project.logger : <code>BasicLogger</code>

<p>Returns logger object which provides <code>error</code>, <code>warn</code>, <code>info</code>, <code>debug</code>, <code>verbose</code>, <code>silly</code> methods.</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
**Read only**: true  
<a name="ResettableFile+logLevel"></a>

### project.logLevel : <code>string</code>

<p>Log level if default logger is used. (&quot;none&quot;, &quot;error&quot;, &quot;warn&quot;, &quot;info&quot;, &quot;debug&quot;, &quot;verbose&quot;, &quot;silly&quot;)</p>

**Kind**: instance property of [<code>Project</code>](#Project)  
<a name="Project+resolveModule"></a>

### project.resolveModule(name) ⇒ <code>string</code>

<p>Returns root path of given module.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Root path of given module.</li>
</ul>  

| Param | Type                | Description                                    |
| ----- | ------------------- | ---------------------------------------------- |
| name  | <code>string</code> | <p>Name of the module to get root path of.</p> |

**Example**

```js
project.resolveModule("fs-extra"); // /path/to/project-module/node_modules/fs-extra
```

<a name="Project+resolveScriptsBin"></a>

### project.resolveScriptsBin([options], [cwd]) ⇒ <code>string</code> \| <code>undefined</code>

<p>Finds and returns path to module's binary. (Module which requires this library)</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> \| <code>undefined</code> - <ul>

<li>Path to parent module's binary.</li>
</ul>  

| Param     | Type                | Default                                | Description                      |
| --------- | ------------------- | -------------------------------------- | -------------------------------- |
| [options] | <code>Object</code> |                                        | <p>Options.</p>                  |
| [cwd]     | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | <p>Current working directory</p> |

**Example**

```js
project.resolveScriptsBin(); // my-scripts (executable of this libraray)
```

<a name="Project+bin"></a>

### project.bin(executable) ⇒ <code>string</code>

<p>Returns relative path to cwd of given executable located in project's <code>node_modules/.bin</code>.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path of the executable in <code>node_modules/.bim</code></li>
</ul>  

| Param      | Type                | Description                   |
| ---------- | ------------------- | ----------------------------- |
| executable | <code>string</code> | <p>Name of the executable</p> |

<a name="Project+resolveBin"></a>

### project.resolveBin(modName, [options], [executable], [cwd]) ⇒ <code>string</code>

<p>Finds and returns path of given command.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path to binary.</li>
</ul>  
**Throws**:

* <code>Error</code> <ul>
  <li>Throws error no binary cannot be found.</li>
  </ul>

| Param        | Type                | Default                                | Description                                       |
| ------------ | ------------------- | -------------------------------------- | ------------------------------------------------- |
| modName      | <code>string</code> |                                        | <p>Module name to find executable from.</p>       |
| [options]    | <code>Object</code> |                                        | <p>Options.</p>                                   |
| [executable] | <code>string</code> | <code>&quot;param.modName&quot;</code> | <p>Executable name. (Defaults to module name)</p> |
| [cwd]        | <code>string</code> | <code>&quot;process.cwd()&quot;</code> | <p>Current working directory</p>                  |

<a name="Project+fromModuleRoot"></a>

### project.fromModuleRoot(...part) ⇒ <code>string</code>

<p>Joins parts to form a path using <code>path.join</code>. Returns path in module by adding module root at the beginning of path.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Full path to module file.</li>
</ul>  

| Param   | Type                              | Description                                            |
| ------- | --------------------------------- | ------------------------------------------------------ |
| ...part | <code>Array.&lt;string&gt;</code> | <p>Path parts to get path relative to module root.</p> |

<a name="Project+fromConfigDir"></a>

### project.fromConfigDir(...part) ⇒ <code>string</code>

<p>Returns given path added to path of config directory. Path may be given as a single string or in multiple parts.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path in config directory.</li>
</ul>  

| Param   | Type                | Description                         |
| ------- | ------------------- | ----------------------------------- |
| ...part | <code>string</code> | <p>Path relative to config dir.</p> |

<a name="Project+fromScriptsDir"></a>

### project.fromScriptsDir(...part) ⇒ <code>string</code>

<p>Returns given path added to path of scripts directory. Path may be given as a single string or in multiple parts.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path in config directory.</li>
</ul>  

| Param   | Type                | Description                          |
| ------- | ------------------- | ------------------------------------ |
| ...part | <code>string</code> | <p>Path relative to scripts dir.</p> |

<a name="Project+hasAnyDep"></a>

### project.hasAnyDep(deps, [t], [f]) ⇒ <code>\*</code>

<p>Returns one of the given values based on whether project has any of the given dependencies in <code>dependencies</code>, <code>devDependencies</code>, <code>peerDependencies</code>.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of dependency in package.json.</li>
</ul>  

| Param | Type                                                     | Default            | Description                                            |
| ----- | -------------------------------------------------------- | ------------------ | ------------------------------------------------------ |
| deps  | <code>string</code> \| <code>Array.&lt;string&gt;</code> |                    | <p>Dependency or dependencies to check.</p>            |
| [t]   | <code>\*</code>                                          | <code>true</code>  | <p>Value to return if any of dependencies exists.</p>  |
| [f]   | <code>\*</code>                                          | <code>false</code> | <p>Value to return if none of dependencies exists.</p> |

<a name="Project+envIsSet"></a>

### project.envIsSet(name) ⇒ <code>boolean</code>

<p>Returns whether given environment variable is set and not empty.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>boolean</code> - <ul>

<li>Whether given environment variable is set and not empty.</li>
</ul>  

| Param | Type                | Description                                          |
| ----- | ------------------- | ---------------------------------------------------- |
| name  | <code>string</code> | <p>Name of the environment variable to look for.</p> |

<a name="Project+parseEnv"></a>

### project.parseEnv(name, defaultValue) ⇒ <code>\*</code>

<p>Returns environment variable if it exists and is not empty. Returns given default value otherwise.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li>Environment variable or default value.</li>
</ul>  

| Param        | Type                | Description                                                                   |
| ------------ | ------------------- | ----------------------------------------------------------------------------- |
| name         | <code>string</code> | <p>Name of the environment variable</p>                                       |
| defaultValue | <code>\*</code>     | <p>Default value to return if no environment variable is set or is empty.</p> |

<a name="Project+executeFromCLISync"></a>

### project.executeFromCLISync(exit) ⇒ [<code>ScriptResult</code>](#ScriptResult) \| <code>void</code>

<p>Executes script based on script name from CLI (process.argv). If <code>exit</code> is true, also exist
from process with success (0) or failure code (1).</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>ScriptResult</code>](#ScriptResult) \| <code>void</code> - <ul>

<li>Result of script</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if script throws error.</li>
  </ul>

| Param | Type                 | Description                          |
| ----- | -------------------- | ------------------------------------ |
| exit  | <code>boolean</code> | <p>Whether to exit from process.</p> |

**Example**

```js
// in my-scripts/lib/index.js
project.executeFromCLI();

// in package.json
{ "scripts": { "test": "my-scripts test" } }

// on CLI
> npm run test
> node_modules/.bin/my-scripts test
```

<a name="Project+executeScriptFileSync"></a>

### project.executeScriptFileSync(scriptFile, [args]) ⇒ [<code>ScriptResult</code>](#ScriptResult) \| [<code>Array.&lt;ScriptResult&gt;</code>](#ScriptResult)

<p>Executes given script file's exported <code>script</code> function. Script file should be given relative to scripts directory.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>ScriptResult</code>](#ScriptResult) \| [<code>Array.&lt;ScriptResult&gt;</code>](#ScriptResult) - <ul>

<li>Result of script function. (If more than one command executed, array of results)</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws if given file does not export a function in script property.</li>
  </ul>

| Param      | Type                              | Default         | Description                                         |
| ---------- | --------------------------------- | --------------- | --------------------------------------------------- |
| scriptFile | <code>string</code>               |                 | <p>Script file to execute in scripts directory.</p> |
| [args]     | <code>Array.&lt;string&gt;</code> | <code>[]</code> | <p>Arguments to pass script function.</p>           |

**Example**

```js
const result = executeScriptFileSync("build"); // Executes my-scripts/lib/scripts/build
```

<a name="Project+hasScriptSync"></a>

### project.hasScriptSync(scriptFile) ⇒ <code>string</code> \| <code>undefined</code>

<p>Checks whether given script exists in scripts directory. Script search method is as below:</p>
<ol>
<li>If given path found (dir or file), returns it.</li>
<li>If file name has no extension, looks a file name with extension in order of <code>ts</code>, <code>js</code>.</li>
<li>If file name with an extension is found, returns full path of filename including extension.</li>
</ol>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> \| <code>undefined</code> - <ul>

<li>Full path (with extension if it has one). Undefined if not found.</li>
</ul>  

| Param      | Type                | Description                            |
| ---------- | ------------------- | -------------------------------------- |
| scriptFile | <code>string</code> | <p>Module file to check existence.</p> |

<a name="Project+executeSync"></a>

### project.executeSync(executable) ⇒ [<code>ScriptResult</code>](#ScriptResult)

<p>Executes given binary using <code>spawn.sync</code> with given arguments and return results.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>ScriptResult</code>](#ScriptResult) - <ul>

<li>Result of the executable.</li>
</ul>  

| Param      | Type                                   | Description        |
| ---------- | -------------------------------------- | ------------------ |
| executable | [<code>Executable</code>](#Executable) | <p>Executable.</p> |

<a name="Project+getConcurrentlyArgs"></a>

### project.getConcurrentlyArgs(scripts, [options], [killOthers]) ⇒ <code>Array.&lt;string&gt;</code>

<p>Given an object containing keys as script names, values as commands, returns parameters to feed to concurrently.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;string&gt;</code> - <ul>

<li>Arguments to use with concurrently.</li>
</ul>  

| Param        | Type                                       | Default           | Description                                                  |
| ------------ | ------------------------------------------ | ----------------- | ------------------------------------------------------------ |
| scripts      | <code>Object.&lt;string, string&gt;</code> |                   | <p>Object with script names as keys, commands as values.</p> |
| [options]    | <code>Object</code>                        |                   | <p>Options</p>                                               |
| [killOthers] | <code>boolean</code>                       | <code>true</code> | <p>Whether -kill-others-on-fail should added.</p>            |

<a name="Project+isOptedOut"></a>

### project.isOptedOut(key, [t], [f]) ⇒ <code>\*</code>

<p>Returns whether given parameter is opted out by looking configuration.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of sub property.</li>
</ul>  

| Param | Type                | Default            | Description                                    |
| ----- | ------------------- | ------------------ | ---------------------------------------------- |
| key   | <code>string</code> |                    | <p>Paremeter to look for.</p>                  |
| [t]   | <code>\*</code>     | <code>true</code>  | <p>Value to return if it is opted out.</p>     |
| [f]   | <code>\*</code>     | <code>false</code> | <p>Value to return if it is not opted out.</p> |

<a name="Project+isOptedIn"></a>

### project.isOptedIn(key, [t], [f]) ⇒ <code>\*</code>

<p>Returns whether given parameter is opted in by looking configuration.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of sub property.</li>
</ul>  

| Param | Type                | Default            | Description                                   |
| ----- | ------------------- | ------------------ | --------------------------------------------- |
| key   | <code>string</code> |                    | <p>Paremeter to look for.</p>                 |
| [t]   | <code>\*</code>     | <code>true</code>  | <p>Value to return if it is opted in.</p>     |
| [f]   | <code>\*</code>     | <code>false</code> | <p>Value to return if it is not opted in.</p> |

<a name="ResettableFile+fromRoot"></a>

### project.fromRoot(...part) ⇒ <code>string</code>

<p>Returns given path after prepending it to the root. Path may be given as a single string or in multiple parts.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path in root.</li>
</ul>  

| Param   | Type                | Description                                         |
| ------- | ------------------- | --------------------------------------------------- |
| ...part | <code>string</code> | <p>Path or path parts to get full path in root.</p> |

**Example**

```js
const resettable = new ResettableFile({ registryFile: "dir/registry.json" });
resettable.fromRoot("path/to/file.txt"); // dir/path/to/file.txt
```

<a name="ResettableFile+fromSourceRoot"></a>

### project.fromSourceRoot(...part) ⇒ <code>string</code>

<p>Returns given path after prepending it to the source root. Path may be given as a single string or in multiple parts.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Path in root.</li>
</ul>  

| Param   | Type                | Description                                         |
| ------- | ------------------- | --------------------------------------------------- |
| ...part | <code>string</code> | <p>Path or path parts to get full path in root.</p> |

**Example**

```js
const resettable = new ResettableFile({ sourceRoot: "sourcedir" });
resettable.fromSourceRoot("path/to/file.txt"); // sourcedir/path/to/file.txt
```

<a name="ResettableFile+isDataFile"></a>

### project.isDataFile(projectFile) ⇒ <code>boolean</code>

<p>Checks whether given file is a tracked data file.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>boolean</code> - <ul>

<li>Whether given file is a tracked data file.</li>
</ul>  

| Param       | Type                | Description          |
| ----------- | ------------------- | -------------------- |
| projectFile | <code>string</code> | <p>File to check</p> |

<a name="ResettableFile+hasFileSync"></a>

### project.hasFileSync(projectFiles, [t], [f]) ⇒ <code>\*</code>

<p>Returns one of the given values based on existence of given file path or file paths in root.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of files in root.</li>
</ul>  

| Param        | Type                                                     | Default            | Description                                                 |
| ------------ | -------------------------------------------------------- | ------------------ | ----------------------------------------------------------- |
| projectFiles | <code>string</code> \| <code>Array.&lt;string&gt;</code> |                    | <p>File or list of files to look in root.</p>               |
| [t]          | <code>\*</code>                                          | <code>true</code>  | <p>Value to return if any of the files exists in root.</p>  |
| [f]          | <code>\*</code>                                          | <code>false</code> | <p>Value to return if none of the files exists in root.</p> |

<a name="ResettableFile+saveSync"></a>

### project.saveSync() ⇒ <code>void</code>

<p>Saves data files and registry file. Must be called if any changes are made.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if files cannot be written</li>
  </ul>

<a name="ResettableFile+resetSync"></a>

### project.resetSync() ⇒ <code>void</code>

<p>Resets modifications made by this library by deleting created files and returns data files in original state.
WARNING: Does not recreate deleted files.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if files cannot be written</li>
  </ul>

<a name="ResettableFile+resetFileSync"></a>

### project.resetFileSync(projectFile) ⇒ <code>void</code>

<p>Resets given file.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be reset.</li>
  </ul>

| Param       | Type                | Description          |
| ----------- | ------------------- | -------------------- |
| projectFile | <code>string</code> | <p>File to reset</p> |

<a name="ResettableFile+getFileDetailsSync"></a>

### project.getFileDetailsSync(projectFile, options) ⇒ <code>FileDetail</code>

<p>Returns file details related to given file path relative to root.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>FileDetail</code> - <ul>

<li>File details</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file details cannot be get.</li>
  </ul>

| Param         | Type                 | Description                                                        |
| ------------- | -------------------- | ------------------------------------------------------------------ |
| projectFile   | <code>string</code>  | <p>File to get detail for.</p>                                     |
| options       | <code>Object</code>  | <p>Options</p>                                                     |
| options.force | <code>boolean</code> | <p>Assume safe to operate on file even it is not auto created.</p> |
| options.track | <code>boolean</code> | <p>Whether to track file if it is created by module.</p>           |

<a name="ResettableFile+getFileHashSync"></a>

### project.getFileHashSync(projectFile) ⇒ <code>string</code>

<p>Calculates and returns hash for given file relative to root. For js, json and yaml files, ignores format differences and returns
same hash for same data even they are formatted differently.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>string</code> - <ul>

<li>Calculated hash for file.</li>
</ul>  

| Param       | Type                | Description                                                          |
| ----------- | ------------------- | -------------------------------------------------------------------- |
| projectFile | <code>string</code> | <p>File path of the file relative to root to calculate hash for.</p> |

<a name="ResettableFile+getDataObjectSync"></a>

### project.getDataObjectSync(projectFile, [options]) ⇒ [<code>DataObject</code>](#DataObject)

<p>Reads json or yaml data file and returns [DataObject](#DataObject) instance. Records changes made to object and writes them to registry file to be cleared when necessary.
Changes made are saved to same file when project is saved via <code>save()</code> method.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>DataObject</code>](#DataObject) - <ul>

<li>[DataObject](#DataObject) instance.</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be created.</li>
  </ul>

| Param                    | Type                              | Default                       | Description                                                                                                             |
| ------------------------ | --------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| projectFile              | <code>string</code>               |                               | <p>File path to read relative to root.</p>                                                                              |
| [options]                | <code>Object</code>               |                               | <p>Options</p>                                                                                                          |
| [options.create]         | <code>boolean</code>              | <code>false</code>            | <p>Whether to create file if it does not exist.</p>                                                                     |
| [options.defaultContent] | <code>Object</code>               |                               | <p>Default content to write if file is created.</p>                                                                     |
| [options.throwNotExists] | <code>boolean</code>              | <code>true</code>             | <p>Throw error if file does not exist.</p>                                                                              |
| [options.format]         | <code>boolean</code>              | <code>[file extension]</code> | <p>Format to serialize data in given format. (<code>json</code> or <code>yaml</code>) Default is <code>json</code>.</p> |
| [options.createFormat]   | <code>boolean</code>              | <code>&quot;json&quot;</code> | <p>Format to serialize data in given format. (<code>json</code> or <code>yaml</code>) Default is <code>json</code>.</p> |
| [options.track]          | <code>boolean</code>              | <code>[this.track]</code>     | <p>Whether to track file in registry if it is created by module.</p>                                                    |
| [options.force]          | <code>boolean</code>              | <code>false</code>            | <p>Whether to force write file even it exist.</p>                                                                       |
| [options.sortKeys]       | <code>Array.&lt;string&gt;</code> |                               | <p>List of keys which their values shoud be sorted. Key names be paths like &quot;scripts.test&quot;</p>                |

<a name="ResettableFile+createSymLinkSync"></a>

### project.createSymLinkSync(targetFile, projectFile, [options]) ⇒ <code>void</code>

<p>Creates a symbolic link in project which points to a file in module. Removes previously created symbolic link created by this library.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if symbolic link cannot be created.</li>
  </ul>

| Param           | Type                 | Default                   | Description                                                                       |
| --------------- | -------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| targetFile      | <code>string</code>  |                           | <p>Target file which link points to. Should be given relative to module root.</p> |
| projectFile     | <code>string</code>  |                           | <p>Link file. Should be given relative to project root.</p>                       |
| [options]       | <code>Object</code>  |                           | <p>Options</p>                                                                    |
| [options.force] | <code>boolean</code> | <code>false</code>        | <p>Writes file even it exists and not auto created.</p>                           |
| [options.track] | <code>boolean</code> | <code>[this.track]</code> | <p>Whether to track symlink if it is created by module.</p>                       |

**Example**

```js
// Creates tsconfig.json symbolic link file in project root, pointing to a file from toolkit.
createSymLink(here("../../config.json"), "tsconfig.json");
```

<a name="ResettableFile+readFileSync"></a>

### project.readFileSync(projectFile, [options]) ⇒ <code>\*</code>

<p>Reads and returns content of the given file relative to root. Optionally can create file if it does not exist.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>\*</code> - <ul>

<li>Content of the file.</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be found.</li>
  </ul>

| Param                    | Type                 | Default                       | Description                                                                                 |
| ------------------------ | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| projectFile              | <code>string</code>  |                               | <p>File to read relative to root.</p>                                                       |
| [options]                | <code>Object</code>  |                               | <p>Options</p>                                                                              |
| [options.create]         | <code>boolean</code> | <code>false</code>            | <p>Whether to create file if it does not exist.</p>                                         |
| [options.track]          | <code>boolean</code> | <code>[this.track]</code>     | <p>Whether to track file in registry if it is created by module.</p>                        |
| [options.force]          | <code>boolean</code> | <code>false</code>            | <p>Whether to force create even it is deleted by user.</p>                                  |
| [options.defaultContent] | <code>\*</code>      |                               | <p>Default content to write if file does not exist.</p>                                     |
| [options.throwNotExists] | <code>boolean</code> | <code>true</code>             | <p>Throw error if file does not exist.</p>                                                  |
| [options.parse]          | <code>boolean</code> | <code>false</code>            | <p>Whether to parse file content to create a js object.</p>                                 |
| [options.format]         | <code>Format</code>  | <code>[file extension]</code> | <p>Format to use parsing data.</p>                                                          |
| [options.createFormat]   | <code>Format</code>  | <code>json</code>             | <p>Format to be used while creating nonexisting file if no format is provided.</p>          |
| [options.serialize]      | <code>Format</code>  | <code>[parse]</code>          | <p>Whether to serialize content if file is created. (Default is status of parse option)</p> |

<a name="ResettableFile+readFileDetailedSync"></a>

### project.readFileDetailedSync(projectFile, [options]) ⇒ <code>Object</code>

<p>Reads and returns content and format of the given file relative to project root. Optionally can create file if it does not exist.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Object</code> - <ul>

<li>Content of the file.</li>
</ul>  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be found.</li>
  </ul>

| Param                    | Type                 | Default                       | Description                                                                                 |
| ------------------------ | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| projectFile              | <code>string</code>  |                               | <p>File to read relative to project root.</p>                                               |
| [options]                | <code>Object</code>  |                               | <p>Options</p>                                                                              |
| [options.create]         | <code>boolean</code> | <code>false</code>            | <p>Whether to create file if it does not exist.</p>                                         |
| [options.track]          | <code>boolean</code> | <code>[this.track]</code>     | <p>Whether to track file in registry if it is created by module.</p>                        |
| [options.force]          | <code>boolean</code> | <code>false</code>            | <p>Whether to force create even it is deleted by user.</p>                                  |
| [options.defaultContent] | <code>\*</code>      |                               | <p>Default content to write if file does not exist.</p>                                     |
| [options.throwNotExists] | <code>boolean</code> | <code>true</code>             | <p>Throw error if file does not exist.</p>                                                  |
| [options.parse]          | <code>boolean</code> | <code>false</code>            | <p>Whether to parse file content to create a js object.</p>                                 |
| [options.format]         | <code>Format</code>  | <code>[file extension]</code> | <p>Format to use parsing data.</p>                                                          |
| [options.createFormat]   | <code>Format</code>  | <code>json</code>             | <p>Format to be used while creating nonexisting file if no format is provided.</p>          |
| [options.serialize]      | <code>Format</code>  | <code>[parse]</code>          | <p>Whether to serialize content if file is created. (Default is status of parse option)</p> |

<a name="ResettableFile+writeFileSync"></a>

### project.writeFileSync(projectFile, data, [options]) ⇒ <code>void</code>

<p>Creates and writes given data to a file in project.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be created</li>
  </ul>

| Param               | Type                 | Default                       | Description                                                                                                             |
| ------------------- | -------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| projectFile         | <code>string</code>  |                               | <p>File path to relative to project root.</p>                                                                           |
| data                | <code>string</code>  |                               | <p>Data to write</p>                                                                                                    |
| [options]           | <code>Object</code>  |                               | <p>Options</p>                                                                                                          |
| [options.force]     | <code>boolean</code> | <code>false</code>            | <p>Writes file even it exists and not auto created.</p>                                                                 |
| [options.track]     | <code>boolean</code> | <code>[this.track]</code>     | <p>Whether to track file in registry if it is created by module.</p>                                                    |
| [options.serialize] | <code>boolean</code> | <code>false</code>            | <p>Whether to serialize object before written to file.</p>                                                              |
| [options.format]    | <code>Format</code>  | <code>[file extension]</code> | <p>Format to use serializing data.</p>                                                                                  |
| [options.sortKeys]  | <code>Array</code>   |                               | <p>Keys to be sorted. Keys may be given as chained paths. (i.e. <code>a.b.c</code> -&gt; Keys of c would be sorted)</p> |

**Example**

```js
project.writeFile("./some-config.json", '{"name": "my-project"}'); // Writes given data to some-config.json in project root.
```

<a name="ResettableFile+deleteFileSync"></a>

### project.deleteFileSync(projectFile, [options]) ⇒ <code>void</code>

<p>Deletes a file from project. Path should be given relative to project root.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be deleted.</li>
  </ul>

| Param           | Type                 | Default                   | Description                                                                                                           |
| --------------- | -------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| projectFile     | <code>string</code>  |                           | <p>File path relative to paroject root.</p>                                                                           |
| [options]       | <code>Object</code>  |                           | <p>Options</p>                                                                                                        |
| [options.force] | <code>boolean</code> | <code>false</code>        | <p>Deletes file even it exists and not auto created.</p>                                                              |
| [options.track] | <code>boolean</code> | <code>[this.track]</code> | <p>Whether to operate in tracked mode. In non-tracked mode existing files are not deleted if force is not active.</p> |
| [options.log]   | <code>boolean</code> | <code>true</code>         | <p>Whether to log operation.</p>                                                                                      |

**Example**

```js
project.copy("./some-config.json", "./some-config.json"); // Copies some-config.json file from module's root to project's root.
```

<a name="ResettableFile+copyFileSync"></a>

### project.copyFileSync(sourceFile, projectFile, [options]) ⇒ <code>void</code>

<p>Copies a file from module to project. Paths should be given relative to module root and project root.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if file cannot be created</li>
  </ul>

| Param           | Type                 | Default                   | Description                                                          |
| --------------- | -------------------- | ------------------------- | -------------------------------------------------------------------- |
| sourceFile      | <code>string</code>  |                           | <p>Source file path.</p>                                             |
| projectFile     | <code>string</code>  |                           | <p>Destinantion file path relative to paroject root.</p>             |
| [options]       | <code>Object</code>  |                           | <p>Options</p>                                                       |
| [options.force] | <code>boolean</code> | <code>false</code>        | <p>Overwrites file even it exists and not auto created.</p>          |
| [options.track] | <code>boolean</code> | <code>[this.track]</code> | <p>Whether to track file in registry if it is created by module.</p> |

**Example**

```js
project.copy("./some-config.json", "./some-config.json"); // Copies some-config.json file from module's root to project's root.
```

<a name="ResettableFile+createDirSync"></a>

### project.createDirSync(projectDir, [options]) ⇒ <code>void</code>

<p>Creates given directory and its tree relative to project root.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if directory tree cannot be created.</li>
  </ul>

| Param             | Type                 | Default                   | Description                                                          |
| ----------------- | -------------------- | ------------------------- | -------------------------------------------------------------------- |
| projectDir        | <code>string</code>  |                           | <p>Directory path to relative to project root.</p>                   |
| [options]         | <code>Object</code>  |                           | <p>Options</p>                                                       |
| [options.track]   | <code>boolean</code> | <code>[this.track]</code> | <p>Whether to track file in registry if it is created by module.</p> |
| [options.logDirs] | <code>boolean</code> | <code>true</code>         | <p>Whether to log delete operation of sub directories.</p>           |

**Example**

```js
project.createDir("path/to/dir"); // Created "path", "to" and "dir" as necessary.
```

<a name="ResettableFile+deleteDirSync"></a>

### project.deleteDirSync(projectDir, [options]) ⇒ <code>void</code>

<p>Deletes directory if empty or all of it's contents are created by this library. <code>force</code> option may be used to delete non-empty directories.</p>

**Kind**: instance method of [<code>Project</code>](#Project)  
**Throws**:

* <code>VError</code> <ul>
  <li>Throws error if directory or its content cannot be deleted.</li>
  </ul>

| Param              | Type                 | Default                   | Description                                                          |
| ------------------ | -------------------- | ------------------------- | -------------------------------------------------------------------- |
| projectDir         | <code>string</code>  |                           | <p>Destinantion directory to delete.</p>                             |
| [options]          | <code>Object</code>  |                           | <p>Options</p>                                                       |
| [options.force]    | <code>boolean</code> | <code>false</code>        | <p>Deletes directory and it's contents even it is not empty.</p>     |
| [options.track]    | <code>boolean</code> | <code>[this.track]</code> | <p>Whether to track file in registry if it is created by module.</p> |
| [options.logFiles] | <code>boolean</code> | <code>true</code>         | <p>Whether to log delete operation of files.</p>                     |
| [options.logDirs]  | <code>boolean</code> | <code>true</code>         | <p>Whether to log delete operation of sub directories.</p>           |

<a name="DataObject"></a>

## DataObject

<p>This class is used for modifications of the given object.</p>

**Kind**: global class

* [DataObject](#DataObject)
  * [new DataObject([data], [options])](#new_DataObject_new)
  * [.isChanged](#DataObject+isChanged) : <code>boolean</code>
  * [.data](#DataObject+data) : <code>Data</code>
  * [.original](#DataObject+original) : <code>Data</code>
  * [.snapshot](#DataObject+snapshot) : <code>Data</code>
  * [.has(props, [t], [f])](#DataObject+has) ⇒ <code>\*</code>
  * [.hasSubProp(prop, subProps, [t], [f])](#DataObject+hasSubProp) ⇒ <code>\*</code>
  * [.get(path)](#DataObject+get) ⇒ <code>\*</code>
  * [.set(path, value)](#DataObject+set) ⇒ <code>this</code>
  * [.setObject(data, [options])](#DataObject+setObject) ⇒ <code>this</code>
  * [.remove(path, [options])](#DataObject+remove) ⇒ <code>this</code>
  * [.reset()](#DataObject+reset) ⇒ <code>Array.&lt;Operation&gt;</code>

<a name="new_DataObject_new"></a>

### new DataObject([data], [options])

<p>Creates an instance of DataObject.</p>

| Param                | Type                                 | Default         | Description                                                                                                                                                  |
| -------------------- | ------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [data]               | <code>Object</code>                  | <code>{}</code> | <p>Data to be modified.</p>                                                                                                                                  |
| [options]            | <code>Object</code>                  |                 | <p>Options</p>                                                                                                                                               |
| [options.track]      | <code>boolean</code>                 |                 | <p>Whether to track changes.</p>                                                                                                                             |
| [options.sortKeys]   | <code>Array.&lt;string&gt;</code>    |                 | <p>List of keys which their values shoud be sorted. Key names be paths like &quot;scripts.test&quot;</p>                                                     |
| [options.name]       | <code>string</code>                  |                 | <p>Path of the name to be used in logs.</p>                                                                                                                  |
| [options.format]     | <code>Format</code>                  |                 | <p>Data format used for parsing and serializing data.</p>                                                                                                    |
| [options.operations] | <code>Array.&lt;Operation&gt;</code> |                 | <p>Operations to reset data to its original state.</p>                                                                                                       |
| [options.logger]     | <code>Logger</code>                  |                 | <p>A looger instance such as winston. Must implement <code>silky</code>, <code>verbose</code>, <code>info</code>, <code>warn</code>, <code>error</code>.</p> |

<a name="DataObject+isChanged"></a>

### dataObject.isChanged : <code>boolean</code>

<p>Whether data is changed.</p>

**Kind**: instance property of [<code>DataObject</code>](#DataObject)  
**Read only**: true  
<a name="DataObject+data"></a>

### dataObject.data : <code>Data</code>

<p>Stored data.</p>

**Kind**: instance property of [<code>DataObject</code>](#DataObject)  
**Read only**: true  
<a name="DataObject+original"></a>

### dataObject.original : <code>Data</code>

<p>Original state of the data after operations applied to reset into its original state.</p>

**Kind**: instance property of [<code>DataObject</code>](#DataObject)  
**Read only**: true  
<a name="DataObject+snapshot"></a>

### dataObject.snapshot : <code>Data</code>

<p>Data in the state given to constructor</p>

**Kind**: instance property of [<code>DataObject</code>](#DataObject)  
**Read only**: true  
<a name="DataObject+has"></a>

### dataObject.has(props, [t], [f]) ⇒ <code>\*</code>

<p>Returns one of the given values based on whether some of given property or properties exists in given object.
Property names may be given as chained such as <code>key</code> or <code>key.subkey</code>.</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of property.</li>
</ul>  

| Param | Type                                                   | Default            | Description                                                         |
| ----- | ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------- |
| props | <code>string</code> \| <code>Array.&lt;Path&gt;</code> |                    | <p>Property or properties to look in data</p>                       |
| [t]   | <code>\*</code>                                        | <code>true</code>  | <p>Value to return if some of the properties exists in project.</p> |
| [f]   | <code>\*</code>                                        | <code>false</code> | <p>Value to return if none of the properties exists in project.</p> |

**Example**

```js
const result = project.hasProp(["scripts.build", "scripts.build:doc"], "yes", "no");
```

<a name="DataObject+hasSubProp"></a>

### dataObject.hasSubProp(prop, subProps, [t], [f]) ⇒ <code>\*</code>

<p>Returns one of the given values based on whether some of given property path or property paths exists in object's target property path.
Property names may be given as chained such as <code>key</code> or <code>key.subkey</code>.</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>\*</code> - <ul>

<li><code>t</code> or <code>f</code> value based on existence of sub property.</li>
</ul>  

| Param    | Type                                                   | Default            | Description                                              |
| -------- | ------------------------------------------------------ | ------------------ | -------------------------------------------------------- |
| prop     | <code>Path</code>                                      |                    | <p>Property or properties to look in data</p>            |
| subProps | <code>string</code> \| <code>Array.&lt;Path&gt;</code> |                    | <p>Property or properties to look in data</p>            |
| [t]      | <code>\*</code>                                        | <code>true</code>  | <p>Value to return if some of the properties exists.</p> |
| [f]      | <code>\*</code>                                        | <code>false</code> | <p>Value to return if none of the properties exists.</p> |

**Example**

```js
const result = project.hasSubProp("scripts", ["build", "build:doc"]);
const result2 = project.hasSubProp("address.home", ["street.name", "street.no"]);
```

<a name="DataObject+get"></a>

### dataObject.get(path) ⇒ <code>\*</code>

<p>Returns data in given key or path. Path may be given as chained. (i.e &quot;scripts.compile&quot;)</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>\*</code> - <ul>

<li>Data stored at given key.</li>
</ul>  

| Param | Type              | Description                  |
| ----- | ----------------- | ---------------------------- |
| path  | <code>Path</code> | <p>Path to get data from</p> |

<a name="DataObject+set"></a>

### dataObject.set(path, value) ⇒ <code>this</code>

<p>Stores given data at given key or path. Based on force option, does not change value if it is not created automatically by this library by looking registry.
Path may be given as chained. (i.e &quot;scripts.compile&quot;)</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>this</code> - <ul>

<li>Object instance.</li>
</ul>  

| Param | Type              | Description                         |
| ----- | ----------------- | ----------------------------------- |
| path  | <code>Path</code> | <p>Path to store data at.</p>       |
| value | <code>\*</code>   | <p>Value to store at given key.</p> |

<a name="DataObject+setObject"></a>

### dataObject.setObject(data, [options]) ⇒ <code>this</code>

<p>Stores each key and its value in the object. Key's may be given as chained paths such as <code>scripts.compile</code>.</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>this</code> - <ul>

<li>Object instance.</li>
</ul>  

| Param           | Type                 | Default            | Description                                                            |
| --------------- | -------------------- | ------------------ | ---------------------------------------------------------------------- |
| data            | <code>Object</code>  |                    | <p>Data to store at object.</p>                                        |
| [options]       | <code>Object</code>  |                    | <p>Options</p>                                                         |
| [options.force] | <code>boolean</code> | <code>false</code> | <p>Whether to force change even value is altered by user manually.</p> |

**Example**

```js
data.setObject({ "a.b": 1, c: 2, d: 3 });
```

<a name="DataObject+remove"></a>

### dataObject.remove(path, [options]) ⇒ <code>this</code>

<p>Removes given path or paths from object . Based on force option, does not remove value if it is not created automatically by this library by looking registry.
Path may be given as chained. (i.e &quot;scripts.compile&quot;)</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>this</code> - <ul>

<li>Object instance.</li>
</ul>  

| Param           | Type                                                   | Default            | Description                                                            |
| --------------- | ------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------- |
| path            | <code>string</code> \| <code>Array.&lt;Path&gt;</code> |                    | <p>Path or list of paths to remove</p>                                 |
| [options]       | <code>Object</code>                                    |                    | <p>Options</p>                                                         |
| [options.force] | <code>boolean</code>                                   | <code>false</code> | <p>Whether to force change even value is altered by user manually.</p> |

<a name="DataObject+reset"></a>

### dataObject.reset() ⇒ <code>Array.&lt;Operation&gt;</code>

<p>Resets data and snapshot to its original states.</p>

**Kind**: instance method of [<code>DataObject</code>](#DataObject)  
**Returns**: <code>Array.&lt;Operation&gt;</code> - <ul>

<li>Unapplied operations</li>
</ul>  
<a name="replaceArgumentName"></a>

## replaceArgumentName(args, names, newName) ⇒ <code>Array</code>

<p>Returns a new array, after replacing output destination argument name with a new name. Does not mutate original array.</p>

**Kind**: global function  
**Returns**: <code>Array</code> - <ul>

<li>Index number of parameter whose name found in arguments.ü</li>
</ul>  

| Param   | Type                                                     | Description                                      |
| ------- | -------------------------------------------------------- | ------------------------------------------------ |
| args    | <code>Array</code>                                       | <p>Arguments array.</p>                          |
| names   | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <p>Parameter names to look for in arguments.</p> |
| newName | <code>string</code>                                      | <p>Parameter names to look for in arguments.</p> |

**Example**

```js
const arguments = ["--a", "--b"];
replaceArgumentName(arguments, ["--a"], "--c"); // -> ["--c", "--b"]
```

<a name="Options"></a>

## Options : <code>Object</code>

<p>to provide spawn method.</p>

**Kind**: global typedef  
**Properties**

| Name     | Type                | Description                              |
| -------- | ------------------- | ---------------------------------------- |
| stdio    | <code>Array</code>  | <p>stdio parameter to feed spawn</p>     |
| encoding | <code>string</code> | <p>encoding to provide to feed spawn</p> |

<a name="Executable"></a>

## Executable : <code>string</code> \| <code>Array.&lt;(string\|Array.&lt;string&gt;\|SpawnOptions)&gt;</code>

<p>Type for holding executable. It may be string to store executable name without arguments. For executable
with arguments or options it is a tuple <code>[bin-name, [arg1, arg2, arg3], spawn-options]</code></p>

**Kind**: global typedef  
**Example**

```js
const bin = "tsc";
const binWithArgs = ["tsc", ["--strict", "--target", "ESNext"]];
const binWithOptions = ["tsc", ["--strict", "--target", "ESNext"], { encoding: "utf-8" }];
```

<a name="ScriptResult"></a>

## ScriptResult : <code>Object</code>

<p>Type for returned value from CLI command.</p>

**Kind**: global typedef  
**Properties**

| Name    | Type                | Description                                                             |
| ------- | ------------------- | ----------------------------------------------------------------------- |
| status  | <code>number</code> | <p>Exit status code of cli command (0: success, other value: error)</p> |
| [error] | <code>Error</code>  | <p>Error object if execution of cli command fails.</p>                  |

<a name="Script"></a>

## Script : <code>function</code>

<p>Type for script function.</p>

**Kind**: global typedef

| Param     | Type                              | Description                                                                                            |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| project   | [<code>Project</code>](#Project)  | <p>Project instance.</p>                                                                               |
| args      | <code>Array.&lt;string&gt;</code> | <p>Argument.</p>                                                                                       |
| scriptKit | <code>ScriptKit</code>            | <p>[ScriptKit](ScriptKit) instance, which have utility methods fro currently executed script file.</p> |
