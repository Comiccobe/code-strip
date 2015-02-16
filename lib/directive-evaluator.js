"use strict"

var evaluateStatement = require("./if-evaluator")

function gatherIfStatements(treeArray, index) {
	var res = []
	var item = treeArray[index]
	while (typeof item !== "undefined" &&
		   item.type !== "IF_END" && item.type !== "ELSE") {
		res.push(item)
		item = treeArray[++index]
	}
	return res
}

function processIfStatements(ifStatemenets, defines) {
	for (var i = 0; i < ifStatemenets.length; i++) {
		var item = ifStatemenets[i]
		item.parsed = evaluateStatement(item.value.parsed, defines)
		switch (item.parsed) {
			case "unknown":
			ifStatemenets.forEach(function (itm) {
				itm.parsed = "unknown"
			})
			return ifStatemenets

			case true:
			for (var j = i+1; j < ifStatemenets.length; j++) {
				ifStatemenets[j].parsed = "remove"
			}
			return ifStatemenets
		}
	}
	return ifStatemenets
}

module.exports = function (tree, defines) {
	var result = ""
	if (typeof tree === "undefined") {
		return result
	}

	for (var i = 0; i < tree.length; i++) {
		var item = tree[i]
		if (item.type === "IF_START") {
			var ifCases = gatherIfStatements(tree, i)
			processIfStatements(ifCases, defines)
		}
	}

	tree.forEach(function (item) {
		if (item.type === "ELSE" && item.parsed === true) {
			result += module.exports(item.content, defines)
		}
		else if (typeof item.value === "string" && item.parsed !== "remove") {
			result += item.value
		}
		else if (typeof item.value !== "undefined") {
			if (item.parsed === "unknown") {
				result += item.value.value
				result += module.exports(item.content, defines)
			}
			else if (item.parsed === true) {
				result += module.exports(item.content, defines)
			}
		}
	})

	return result
}