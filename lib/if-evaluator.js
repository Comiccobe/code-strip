"use strict"

module.exports = function (statement, defines) {
	if (typeof statement === "undefined") {
		return true
	}
	var result = false
	statement = statement.map(function (item) {
		if (typeof item === "string" && item !== "!" &&
			item !== "&&" && item !== "||") {
			if (typeof defines[item] !== "undefined") {
				return defines[item]
			}
			else {
				return "unknown"
			}
		}
		else if (typeof item !== "string" &&
				 typeof item.length !== "undefined") {
			return module.exports(item, defines)
		}
		return item
	})

	for (var j = 0; j < statement.length; j++) {
		if (statement[j] === "!") {
			if (statement[j+1] === "unknown") {
				statement[j+1] = "unknown"
			}
			else {
				statement[j+1] = !statement[j+1]
			}
			statement.splice(j, 1)
			j--
		}
	}

	var leftHand = statement[0]
	var concat = null
	var rightHand = null
	for (var i = 1; i < statement.length; i++) {
		var item = statement[i]
		if (item === "&&") {
			concat = "AND"
		}
		else if (item === "||") {
			concat = "OR"
		}
		else {
			rightHand = item
		}

		if (leftHand !== null && concat !== null && rightHand !== null) {
			if (concat === "AND" &&
				(leftHand === "unknown" || rightHand === "unknown")) {
				return "unknown"
			}
			if (leftHand === "unknown" && rightHand === "unknown") {
				return "unknown"
			}
			if (concat === "OR" && leftHand === "unknown") {
				leftHand = false
			}
			if (concat === "OR" && rightHand === "unknown") {
				rightHand = false
			}
			var r
			if (concat === "AND") {
				r = leftHand && rightHand
			}
			else if (concat === "OR") {
				r = leftHand || rightHand
			}
			statement[i] = r
			statement.splice(i-2, 2)
			i -= 2
			leftHand = r
			concat = null
			rightHand = null
		}
	}

	return leftHand
}