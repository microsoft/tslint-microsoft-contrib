 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noFunctionConstructorWithStringArgsRule', () : void => {

    var RULE_NAME : string = 'no-function-constructor-with-string-args';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoFunctionConstructorWithStringArgsTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 37,
                    "line": 0,
                    "position": 37
                },
                "failure": "forbidden: Function constructor with string arguments ",
                "name": "test-data/NoFunctionConstructorWithStringArgsTestInput.ts",
                "ruleName": "no-function-constructor-with-string-args",
                "startPosition": {
                    "character": 8,
                    "line": 0,
                    "position": 8
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
