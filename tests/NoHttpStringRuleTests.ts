/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noHttpStringRule', () : void => {

    var ruleName : string = 'no-http-string';

    it('should ban http strings in variables', () : void => {
        var inputScript : string = 'var x = \'http://www.examples.com\'';
        TestHelper.assertViolations(ruleName, null, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.examples.com'",
                "name": "file.ts",
                "ruleName": "no-http-string",
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
                "ruleName": "no-http-string",
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

});
/* tslint:enable:quotemark */
