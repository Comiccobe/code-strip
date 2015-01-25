Code strip
=========

A small library that removes compiler directives and the disabled code that goes along with it.


## Installation

  npm install code-strip

or for command line:
	npm install -g code-strip


## Usage

### function signature

	codeStrip(“directories”, “fileTypes”, “directives”, [options])

### Get docs

	require(“code-strip”).docs()

### Running from node with single directory, single file type and single directive

	var codeStrip = require(“code-strip”),
			fs = require(“fs”)

	codeStrip(“temp/dir”, “cs”, “ENABLED_DIRECTIVE”)

### Running from node with multiple directories, file types and directives

	var codeStrip = require(“code-strip”),
			fs = require(“fs”)

	codeStrip(
		[“temp/dir”, “temp/dir2”],
		[“cs”, “cpp”],
		[“DIRECTIVE_0”, “DIRECTIVE_1”]
	)

### Running from command line

	code-strip “temp/dir” “cs”

or for multiple directories and fileTypes

	code-strip “temp/dir,temp/dir2” “cs,cpp”

with extra options

	code-strip “temp/dir” “cs” —dontWrite


## Options with defaults

	{
		dontWrite: false,
		ifTag: "#if ",
		endifTag: "#endif",
		elseTag: "#else",
		elifTag: "#elif "
	}


## Example input / outputs

input:

	#if ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
	#endif

output:

	
    THIS LINE SHOULD EXIST

	


## Tests

  npm test



## Release History
* 0.1.4 Updated README.md
* 0.1.3 Changes to package.json
* 0.1.2 Changes to package.json
* 0.1.1 Changes to package.json
* 0.1.0 Initial release