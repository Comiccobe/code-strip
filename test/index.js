var should = require("chai").should(),
	codeStrip = require("../lib"),
	evalIf = require("../lib/if-evaluator"),
	fs = require("fs")

describe("code strip", function () {
	it("converts /sourcefiles/test.cs into /testcs-intended.cs", function () {
		var directories = __dirname +"/sourcefiles/",
			fileTypes = "cs",
			defines = {
				"ENABLED_DIRECTIVE": true
			},
			opts = {
				dontWrite: true
			}

		var converted = codeStrip(directories, fileTypes, defines, opts)[0].file
		
		converted.should.equal(fs.readFileSync(__dirname+"/testcs-intended.cs").toString())
	})

	it("evaluates if-statements correctly", function () {
		var statement = [
				"!",
				"SMARTLOC_PRO",
				"||",
				"UNITY_EDITOR_OSX"
			],
			defines = {
				"SMARTLOC_PRO": true
			}

		evalIf(statement, defines).should.equal("unknown")
	})
})