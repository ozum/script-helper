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
  * [Project](#project)
    * [new Project([options])](#new-projectoptions)
    * [project.name : <code>string</code>](#projectname--codestringcode)
    * [project.moduleName : <code>string</code>](#projectmodulename--codestringcode)
    * [project.moduleRoot : <code>string</code>](#projectmoduleroot--codestringcode)
    * [project.config : <code>Object</code>](#projectconfig--codeobjectcode)
    * [project.package : <code>DataObject</code>](#projectpackage--codedataobjectcode)
    * [project.isCompiled : <code>boolean</code>](#projectiscompiled--codebooleancode)
    * [project.isTypeScript : <code>boolean</code>](#projectistypescript--codebooleancode)
    * [project.resolveModule(name) ⇒ <code>string</code>](#projectresolvemodulename-%E2%87%92-codestringcode)
    * [project.resolveScriptsBin([options], [cwd]) ⇒ <code>string</code> \| <code>undefined</code>](#projectresolvescriptsbinoptions-cwd-%E2%87%92-codestringcode-%5C-codeundefinedcode)
    * [project.resolveBin(modName, [options], [executable], [cwd]) ⇒ <code>string</code>](#projectresolvebinmodname-options-executable-cwd-%E2%87%92-codestringcode)
    * [project.fromModuleRoot(...part) ⇒ <code>string</code>](#projectfrommodulerootpart-%E2%87%92-codestringcode)
    * [project.hasAnyDep(deps, [t], [f]) ⇒ <code>\*</code>](#projecthasanydepdeps-t-f-%E2%87%92-code%5Ccode)
    * [project.envIsSet(name) ⇒ <code>boolean</code>](#projectenvissetname-%E2%87%92-codebooleancode)
    * [project.parseEnv(name, defaultValue) ⇒ <code>\*</code>](#projectparseenvname-defaultvalue-%E2%87%92-code%5Ccode)
    * [project.getConcurrentlyArgs(scripts, [options], [killOthers]) ⇒ <code>Array.&lt;string&gt;</code>](#projectgetconcurrentlyargsscripts-options-killothers-%E2%87%92-codearrayltstringgtcode)
    * [project.isOptedOut(key, [t], [f]) ⇒ <code>\*</code>](#projectisoptedoutkey-t-f-%E2%87%92-code%5Ccode)
    * [project.isOptedIn(key, [t], [f]) ⇒ <code>\*</code>](#projectisoptedinkey-t-f-%E2%87%92-code%5Ccode)
  * [execute([project], [projectOptions]) ⇒ <code>void</code>](#executeproject-projectoptions-%E2%87%92-codevoidcode)
  * [replaceArgumentName(args, names, newName) ⇒ <code>Array</code>](#replaceargumentnameargs-names-newname-%E2%87%92-codearraycode)
  * [getFromHereFunctions(baseDir) ⇒ <code>Result</code>](#getfromherefunctionsbasedir-%E2%87%92-coderesultcode)

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
</dl>

## Functions

<dl>
<dt><a href="#execute">execute([project], [projectOptions])</a> ⇒ <code>void</code></dt>
<dd><p>Executes script based on script name from CLI arguments (process.argv).</p></dd>
<dt><a href="#replaceArgumentName">replaceArgumentName(args, names, newName)</a> ⇒ <code>Array</code></dt>
<dd><p>Returns a new array, after replacing output destination argument name with a new name. Does not mutate original array.</p></dd>
<dt><a href="#getFromHereFunctions">getFromHereFunctions(baseDir)</a> ⇒ <code><a href="#getFromHereFunction..Result">Result</a></code></dt>
<dd><p>Higher order function which returns functions which calculates paths related to base path given.</p></dd>
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
  * [.package](#Project+package) : <code>DataObject</code>
  * [.isCompiled](#Project+isCompiled) : <code>boolean</code>
  * [.isTypeScript](#Project+isTypeScript) : <code>boolean</code>
  * [.resolveModule(name)](#Project+resolveModule) ⇒ <code>string</code>
  * [.resolveScriptsBin([options], [cwd])](#Project+resolveScriptsBin) ⇒ <code>string</code> \| <code>undefined</code>
  * [.resolveBin(modName, [options], [executable], [cwd])](#Project+resolveBin) ⇒ <code>string</code>
  * [.fromModuleRoot(...part)](#Project+fromModuleRoot) ⇒ <code>string</code>
  * [.hasAnyDep(deps, [t], [f])](#Project+hasAnyDep) ⇒ <code>\*</code>
  * [.envIsSet(name)](#Project+envIsSet) ⇒ <code>boolean</code>
  * [.parseEnv(name, defaultValue)](#Project+parseEnv) ⇒ <code>\*</code>
  * [.getConcurrentlyArgs(scripts, [options], [killOthers])](#Project+getConcurrentlyArgs) ⇒ <code>Array.&lt;string&gt;</code>
  * [.isOptedOut(key, [t], [f])](#Project+isOptedOut) ⇒ <code>\*</code>
  * [.isOptedIn(key, [t], [f])](#Project+isOptedIn) ⇒ <code>\*</code>

<a name="new_Project_new"></a>

### new Project([options])

| Param                     | Type                              | Default                                     | Description                                                                                                                               |
| ------------------------- | --------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [options]                 | <code>Object</code>               |                                             | <p>Options</p>                                                                                                                            |
| [options.track]           | <code>boolean</code>              |                                             | <p>Sets default tracking option for methods.</p>                                                                                          |
| [options.sortPackageKeys] | <code>Array.&lt;string&gt;</code> | <code>[&quot;scripts&quot;]</code>          | <p>Default keys to be sorted in package.json file.</p>                                                                                    |
| [options.logLevel]        | <code>string</code>               | <code>&quot;\&quot;info\&quot;&quot;</code> | <p>Sets log level. (&quot;error&quot;, &quot;warn&quot;, &quot;info&quot;, &quot;debug&quot;, &quot;verbose&quot;, &quot;silly&quot;)</p> |
| [options.cwd]             | <code>string</code>               | <code>&quot;[project root]&quot;</code>     | <p>[<code>Special</code>] Working directory of project root. (Only for special purposes, normally not necessary.)</p>                     |
| [options.moduleRoot]      | <code>string</code>               | <code>&quot;[module root]&quot;</code>      | <p>[<code>Special</code>] Root of the module using this library. (Only for special purposes, normally not necessary.)</p>                 |

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

### project.package : <code>DataObject</code>

<p>[DataObject](DataObject) instance for <code>package.json</code> of project. Also this is a shorthand for <code>project.readDataFile(&quot;package.json&quot;)</code></p>

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

<a name="execute"></a>

## execute([project], [projectOptions]) ⇒ <code>void</code>

<p>Executes script based on script name from CLI arguments (process.argv).</p>

**Kind**: global function

| Param                            | Type                              | Description                                                                                                                               |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [project]                        | [<code>Project</code>](#Project)  | <p>[Project](#Project) object to be pass executed functions.</p>                                                                          |
| [projectOptions]                 | <code>Object</code>               | <p>If no project is provided, options to be used while creating a new [Project](#Project) object</p>                                      |
| [projectOptions.track]           | <code>boolean</code>              | <p>Sets default tracking option for methods.</p>                                                                                          |
| [projectOptions.sortPackageKeys] | <code>Array.&lt;string&gt;</code> | <p>Default keys to be sorted in package.json file.</p>                                                                                    |
| [projectOptions.logLevel]        | <code>string</code>               | <p>Sets log level. (&quot;error&quot;, &quot;warn&quot;, &quot;info&quot;, &quot;debug&quot;, &quot;verbose&quot;, &quot;silly&quot;)</p> |
| [projectOptions.cwd]             | <code>string</code>               | <p>[<code>Special</code>] Working directory of project root. (Only for special purposes, normally not necessary.)</p>                     |
| [projectOptions.moduleRoot]      | <code>string</code>               | <p>[<code>Special</code>] Root of the module using this library. (Only for special purposes, normally not necessary.)</p>                 |

**Example**

```js
> node_modules/.bin/my-scripts test

Or in package.json
{ "scripts": { "test": "my-scripts test" } }

> npm run test
```

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

<a name="getFromHereFunctions"></a>

## getFromHereFunctions(baseDir) ⇒ [<code>Result</code>](#getFromHereFunction..Result)

<p>Higher order function which returns functions which calculates paths related to base path given.</p>

**Kind**: global function  
**Returns**: [<code>Result</code>](#getFromHereFunction..Result) - <ul>

<li>Functions which calculates paths.</li>
</ul>  

| Param   | Type                | Description                                        |
| ------- | ------------------- | -------------------------------------------------- |
| baseDir | <code>string</code> | <p>Base dir to be used in generated functions.</p> |

**Example**

```js
const { here, hereRelative } = getFromHereFunction(__dirname);
const absPath = here("a.txt"); // /some/path/mydir/a.txt
const relativePath = hereRelative("b.txt"); // ./b.txt
```
