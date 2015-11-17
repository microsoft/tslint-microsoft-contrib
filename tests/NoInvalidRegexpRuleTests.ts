/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noInvalidRegexpRule', () : void => {

    var ruleName : string = 'no-invalid-regexp';

    it('should pass on valid input', () : void => {
        var script : string = `
            var a = new RegExp('.');        // valid constructor
            var b = RegExp('.');            // this is the constructor as well
            var c = this.RegExp('[');       // clearly not the typescript RegExp object
            var d = new RegExp(whatever);   // non-string literal parameter
        `;

        TestHelper.assertViolations(ruleName, null, script, [ ]);
    });

    it('should fail on invalid string in constuctor', () : void => {
        var script : string = `
            new RegExp('\\\\') /*error Invalid regular expression: /\/: \ at end of pattern*/
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Invalid regular expression: /\\/: \\ at end of pattern",
                "name": "file.ts",
                "ruleName": "no-invalid-regexp",
                "startPosition": { "character": 24, "line": 2 }
            }
        ]);
    });

    it('should fail on invalid string in function call', () : void => {
        var script : string = `
            RegExp('[')      /*error Invalid regular expression: /[/: Unterminated character class*/
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Invalid regular expression: /[/: Unterminated character class",
                "name": "file.ts",
                "ruleName": "no-invalid-regexp",
                "startPosition": { "character": 20, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
