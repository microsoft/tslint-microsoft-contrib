 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noIncrementDecrementRule', () : void => {

    var RULE_NAME : string = 'no-increment-decrement';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoIncrementDecrementTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, null, inputFile, [
            {
                "failure": "Forbidden ++ operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 4,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden -- operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 5,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden ++ operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 6,
                    "character": 1
                }
            },
            {
                "failure": "Forbidden -- operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "line": 7,
                    "character": 1
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
