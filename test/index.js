var should = require("chai").should(),
	codeStrip = require("../lib"),
	fs = require("fs")

describe("code strip", function () {
	it("converts /sourcefiles/test.cs into /testcs-intended.cs", function () {
		var directories = __dirname +"/sourcefiles/",
			fileTypes = "cs",
			defines = "ENABLED_DIRECTIVE",
			opts = {
			dontWrite: true
		}

		var converted = codeStrip(directories, fileTypes, defines, opts)[0].file

		converted.should.equal(fs.readFileSync(__dirname+"/testcs-intended.cs").toString())
	})
})