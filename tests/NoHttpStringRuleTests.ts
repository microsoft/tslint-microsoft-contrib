/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noHttpStringRule', () : void => {

    const ruleName : string = 'no-http-string';

    it('should ban http strings in variables', () : void => {
        var inputScript : string = 'var x = \'http://www.examples.com\'';
        TestHelper.assertViolations(ruleName, null, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.examples.com'",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 9, "line": 1 }
            }
        ]);
    });

    it('should ban http strings in default values', () : void => {
        var inputScript : string = 'function f(x : string = \'http://www.example.com/whatever\') {}';
        TestHelper.assertViolations(ruleName, null, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.example.com/whatever'",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 25, "line": 1 }
            }
        ]);
    });
	
    it('should allow https strings in variables', () : void => {
        var inputScript : string = 'var x = \'https://www.microsoft.com\'';
        TestHelper.assertNoViolation(ruleName, null, inputScript);
    });

    it('should allow https strings in default values', () : void => {
        var inputScript : string = 'function f(x : string = \'https://www.microsoft.com\') {}';
        TestHelper.assertNoViolation(ruleName, null, inputScript);
    });

	it('should allow http strings in that match the exclude regex', (): void => {
        var inputScript: string = 'var x = "http://www.allowed.com"';
		var excludeRules = ["http://www\\.allowed\\.com/?"];
        TestHelper.assertNoViolation(ruleName, excludeRules, inputScript);
    });

	it('should disallow http strings in that do not match the exclude regex', (): void => {
        var inputScript: string = 'var x = "http://www.notallowed.com"';
		var excludeRules = ["http://www\\.allowed\\.com/?"];
        TestHelper.assertViolations(ruleName, excludeRules, inputScript, [{
			"failure": "Forbidden http url in string: 'http://www.notallowed.com'",
			"name": "file.ts",
			"ruleName": ruleName,
			"startPosition": {
				"character": 9,
				"line": 1
			}
		}]);
    });

});
/* tslint:enable:quotemark */
