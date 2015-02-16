"use strict"

function parseStatement(input, idx, delimiter) {
	var chr = input[idx]
	var statement = ""
	var fullText = ""
	var statementArray = []

	var mode = "none"
	while (typeof chr !== "undefined" && chr !== delimiter) {
		switch (chr) {
			case "(":
			statementArray.push(statement.replace(/\s/g, ""))
			var parseResult = parseStatement(input, idx+1, ")")
			statementArray.push(parseResult.parsed)
			fullText += input.substring(idx, idx + parseResult.length+1)
			idx += parseResult.length
			statement = ""
			chr = input[idx]
			break;
			
			case "!":
			if (mode !== "NOT") {
				statementArray.push(statement.replace(/\s/g, ""))
				statement = ""
				mode = "NOT"
			}
			break;

			case "&":
			if (mode !== "AND") {
				statementArray.push(statement.replace(/\s/g, ""))
				statement = ""
				mode = "AND"
			}
			break;

			case "|":
			if (mode !== "OR") {
				statementArray.push(statement.replace(/\s/g, ""))
				statement = ""
				mode = "OR"
			}
			break;

			case "/":
			if (mode !== "COMMENT") {
				statementArray.push(statement.replace(/\s/g, ""))
				statement = ""
				mode = "COMMENT"
			}
			break;

			default:
			if (mode !== "CODE") {
				statementArray.push(statement.replace(/\s/g, ""))
				statement = ""
			}
			mode = "CODE"
			break;
		}

		if (chr !== ")") {
			statement += chr
			fullText += chr
		}
		chr = input[++idx]
	}

	if (chr === delimiter) {
		fullText += delimiter
	}

	statementArray.push(statement.replace(/\s/g, ""))
	statementArray.splice(0, 1)
	statementArray = statementArray.filter(function (itm) {
		if (itm === "") {
			return false
		}
		return true
	})

	for (var i = 0; i < statementArray.length; i++) {
		if (statementArray[i] === "//") {
			statementArray.splice(i, statementArray.length - i)
			break;
		}
	}

	var result = {
		value: fullText,
		parsed: statementArray,
		length: fullText.length
	}

	return result
}

function getLine(input, startId) {
	var endId = startId
	while (typeof input[endId] !== "undefined" && input[endId] !== "\n") {
		endId++
	}
	endId++
	return input.substring(startId, endId)
}

function parseFile(input) {
	var tree = {
		type: "ROOT",
		content: []
	}
	var current = tree,
		statement,
		line
	for (var i = 0; i < input.length;) {
		if (input.substring(i, i+4) === "#if ") {
			statement = parseStatement(input, i+4, "\n")
			statement.value = "#if " + statement.value
			if (current.type === "CODE") {
				current = current.parent
			}
			current.content.push({
				parent: current,
				type: "IF_START",
				value: statement,
				content: []
			})
			current = current.content[current.content.length-1]
			i += statement.length + 4
			continue
		}
		if (input.substring(i, i+6) === "#elif ") {
			statement = parseStatement(input, i+6, "\n")
			statement.value = "#elif " + statement.value
			if (current.type === "CODE") {
				current = current.parent.parent
			}
			else if (current.type !== "ROOT") {
				current = current.parent
			}
			current.content.push({
				parent: current,
				type: "ELSE_IF",
				value: statement,
				content: []
			})
			current = current.content[current.content.length-1]
			i += statement.length + 6
			continue
		}
		if (input.substring(i, i+5) === "#else") {
			if (current.type === "CODE") {
				current = current.parent.parent
			}
			else if (current.type !== "ROOT") {
				current = current.parent
			}

			line = getLine(input, i)

			current.content.push({
				parent: current,
				type: "ELSE",
				value: line,
				content: []
			})
			current = current.content[current.content.length-1]
			i += line.length
			continue 
		}
		if (input.substring(i, i+6) === "#endif") {
			if (current.parent) {
				current = current.parent
			}
			/*
			if (current.type === "CODE") {
				current = current.parent.parent
			}
			else if (current.type !== "ROOT") {
				current = current.parent
			}
			*/

			line = getLine(input, i)

			current.content.push({
				parent: current,
				value: line,
				type: "IF_END"
			})
			if (current.type !== "ROOT") {
				current = current.parent
			}
			i += line.length
			continue
		}
		if (current.type !== "CODE") {
			current.content.push({
				parent: current,
				type: "CODE",
				value: ""
			})
			current = current.content[current.content.length-1]
		}
		current.value += input[i]
		i++
	}

	return tree
}

function stripParents(input) {
	var output = input.map(function (item) {
		var newItem = item
		delete item.parent
		if (typeof item.content !== "undefined") {
			item.content = stripParents(item.content)
		}
		return item
	})
	return output
}

module.exports = function (input) {
	var tree = parseFile(input)
	tree.content = stripParents(tree.content)
	return tree
}