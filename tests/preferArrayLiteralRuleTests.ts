/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('preferArrayLiteralRule', () : void => {

    var ruleName : string = 'prefer-array-literal';

    it('should allow string[] as variable type', () : void => {
        var inputScript : string = 'var x : string[];';
        TestHelper.assertViolations(ruleName, inputScript, [
        ]);
    });

    it('should ban Array<string> as variable type', () : void => {
        var inputScript : string = 'var x : Array<string>;';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Replace generic-typed Array with array literal: Array<string>",
                "name": "file.ts",
                "ruleName": "prefer-array-literal",
                "startPosition": { "character": 9, "line": 1 }
            }
        ]);
    });

    it('should ban Array<string> as parameter type', () : void => {
        var inputScript : string = 'function (parm: Array<number>) {}';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Replace generic-typed Array with array literal: Array<number>",
                "name": "file.ts",
                "ruleName": "prefer-array-literal",
                "startPosition": { "character": 17, "line": 1 }
            }
        ]);
    });
});
/* tslint:enable:quotemark */
