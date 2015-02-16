"use strict"

var fs = require("fs"),
	path = require("path"),
	parseFile = require("./directive-lexer"),
	evaluateTree = require("./directive-evaluator")

function listFiles(fp) {
	var exists = fs.existsSync(fp),
		stats = exists && fs.lstatSync(fp),
		isDirectory = exists && stats.isDirectory(),
		result = []

	if (exists && isDirectory) {
		result = fs.readdirSync(fp).map(function (child) {
				return listFiles(path.join(fp, child))
			})
	   		.reduce(function (a, b) { return a.concat(b) })

	} else {
		result.push(fp)
	}
	return result
}

function fileTypeFilter(f, fileTypes) {
	var includeFile = false

	fileTypes.map(function (ft) {
		if (f.indexOf(ft) === f.length - ft.length) {
			includeFile = true
		}
	})

	return includeFile
}

function processFiles(filePath, defines, opt) {
	var file = fs.readFileSync(filePath).toString()

	var tree = parseFile(file)
	file = evaluateTree(tree.content, defines)

	if (opt.writeTree) {
		fs.writeFileSync(filePath+".json", JSON.stringify(tree, null, '\t'))
	}

	if (opt.dontWrite) {
		return { path: filePath, file: file }
	}
	else {
		fs.writeFileSync(filePath, file)
	}
}

module.exports = function (directories, fileTypes, defines, opt) {
	var convertedFiles

	if (typeof directories === "undefined") {
		throw "No directories supplied"
	}

	if (typeof fileTypes === "undefined") {
		throw "No fileTypes supplied"
	}

	if (typeof defines === "undefined") {
		throw "No defines supplied"
	}

	if (typeof directories === "string") {
		directories = [directories]
	}

	if (typeof fileTypes === "string") {
		fileTypes = [fileTypes]
	}

	if (typeof defines === "string") {
		defines = [defines]
	}

	if (typeof opt === "undefined") {
		opt = {}
	}
	
	for (var x in module.exports.DEFAULTS) {
		if (!module.exports.DEFAULTS.hasOwnProperty(x)) {
			continue
		}
		if (typeof opt[x] === "undefined") {
			opt[x] = module.exports.DEFAULTS[x]
		}
	}

	convertedFiles = directories.map(listFiles)
			.reduce(function (a, b) { return a.concat(b) })
			.filter(function (f) { return fileTypeFilter(f, fileTypes) })
			.map(function (f) { return processFiles(f, defines, opt) })

	if (opt.dontWrite) {
		return convertedFiles
	}
}

// default options
module.exports.DEFAULTS = {
	dontWrite: false,
	writeTree: false,
	ifTag: "#if ",
	endifTag: "#endif",
	elseTag: "#else",
	elifTag: "#elif "
}

// expose docs
module.exports.docs = function () {
	console.log("\nGENERAL USE: $code-strip [directories] [fileTypes] [defines] [options]")
	console.log("OPTIONS:")
	for (var option in module.exports.DEFAULTS) {
		console.log('  --' + option)
	}
	console.log("\nEXAMPLES:\n\n" + '  $code-strip "./temp" "cs" "MY_DIRECTIVE" --dontWrite true')
	console.log('  $code-strip "./temp,./build" "cs,cpp" "DEFINE0,DEFINE1" --dontWrite true')
	console.log('\nGENERAL HELP: ' + 'http://git.io/uCafxw\n')
}