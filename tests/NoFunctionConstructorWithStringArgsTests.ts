 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noFunctionConstructorWithStringArgsRule', () : void => {
    let RULE_NAME : string = 'no-function-constructor-with-string-args';

    it('should produce violations ', () : void => {
        let inputFile : string = 'test-data/NoFunctionConstructorWithStringArgsTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "forbidden: Function constructor with string arguments ",
                "name": "test-data/NoFunctionConstructorWithStringArgsTestInput.ts",
                "ruleName": "no-function-constructor-with-string-args",
                "startPosition": {
                    "line": 1,
                    "character": 9
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
