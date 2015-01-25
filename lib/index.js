"use strict"

var fs = require("fs"),
	path = require("path")

function firstDirectiveType(input, define, opt, end) {
	var replaceWith = input.substring(0, end)
		.replace(opt.ifTag+define, "")
		.replace(opt.ifTag+"("+define+")", "")
	return replaceWith
}

function secondDirectiveType(input, define, opt) {
	var idx = input.indexOf(define),
		idx2 = input.indexOf("("+define+")"),
		replaceWith,
		elifIdx,
		elseIdx,
		endIdx

	if (idx === -1 || (idx > idx2 && idx2 !== -1)) {
		idx = idx2 + define.length + 2
	}
	else {
		idx = idx + define.length
	}

	replaceWith = input.substring(idx)

	elifIdx = replaceWith.indexOf(opt.elifTag)
	elseIdx = replaceWith.indexOf(opt.elseTag)
	endIdx = elifIdx
	
	if (endIdx === -1 || (endIdx > elseIdx && elseIdx !== -1)) {
		endIdx = elseIdx
	}

	return replaceWith.substring(0, endIdx)
}

function replaceDefines(file, define, opt) {
	var index = file.indexOf(opt.ifTag),
		secondSplit = file.substring(index),
		firstSplit = file.substring(0, index),
		output = firstSplit,
		replaceWith,
		defineIndex,
		elifIndex,
		elseIndex,
		endifIndex
	
	while (index !== -1) {
		defineIndex = secondSplit.indexOf(define)
		elifIndex = secondSplit.indexOf(opt.elifTag)
		elseIndex = secondSplit.indexOf(opt.elseTag)
		endifIndex = secondSplit.indexOf(opt.endifTag)

		if (defineIndex !== -1 && defineIndex < endifIndex) {
			if (elifIndex === -1 || elifIndex > endifIndex &&
				elseIndex === -1 || elseIndex > endifIndex &&
				endifIndex > 0) {
				replaceWith = firstDirectiveType(secondSplit, define, opt, endifIndex)
			}
			else if (elseIndex !== -1 &&
					 elifIndex === -1 || elifIndex > elseIndex &&
					 elseIndex < endifIndex) {
				replaceWith = firstDirectiveType(secondSplit, define, opt, elseIndex)
			}
			else if (elifIndex !== -1 && elifIndex < endifIndex &&
					 elseIndex === -1 || elseIndex > endifIndex) {
				replaceWith = secondDirectiveType(secondSplit, define, opt)
			}
			else if (elifIndex !== -1 && elifIndex < endifIndex &&
					 elseIndex !== -1 && elseIndex < endifIndex) {
				replaceWith = secondDirectiveType(secondSplit, define, opt)
			}
			output += replaceWith
		}
		else {
			output += secondSplit.substring(0, endifIndex+6)
		}
		
		secondSplit = secondSplit.substring(endifIndex+6)
		index = secondSplit.indexOf(opt.ifTag)
	}

	output += secondSplit
	return output
}

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

	defines.forEach(function (define) {
		file = replaceDefines(file, define, opt)
	})
	if (opt.dontWrite) {
		return ({ path: filePath, file: file })
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