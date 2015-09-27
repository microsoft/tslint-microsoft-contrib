/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-http-string */
import TestHelper = require('./TestHelper');

describe('noHttpStringRule', () : void => {

    var ruleName : string = 'no-http-string';

    it('should ban http strings in variables', () : void => {
        var inputScript : string = 'var x = \'http://www.microsoft.com\'';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.microsoft.com'",
                "name": "file.ts",
                "ruleName": "no-http-string",
                "startPosition": { "character": 9, "line": 1 }
            }
        ]);
    });

    it('should ban http strings in default values', () : void => {
        var inputScript : string = 'function f(x : string = \'http://www.microsoft.com\') {}';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.microsoft.com'",
                "name": "file.ts",
                "ruleName": "no-http-string",
                "startPosition": { "character": 25, "line": 1 }
            }
        ]);
    });


    it('should allow https strings in variables', () : void => {
        var inputScript : string = 'var x = \'https://www.microsoft.com\'';
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow https strings in default values', () : void => {
        var inputScript : string = 'function f(x : string = \'https://www.microsoft.com\') {}';
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-http-string */
