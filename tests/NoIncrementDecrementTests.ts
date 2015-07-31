 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noIncrementDecrementRule', () : void => {

    var RULE_NAME : string = 'no-increment-decrement';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoIncrementDecrementTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 3,
                    "line": 3,
                    "position": 15
                },
                "failure": "Forbidden ++ operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "character": 0,
                    "line": 3,
                    "position": 12
                }
            },
            {
                "endPosition": {
                    "character": 3,
                    "line": 4,
                    "position": 21
                },
                "failure": "Forbidden -- operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "character": 0,
                    "line": 4,
                    "position": 18
                }
            },
            {
                "endPosition": {
                    "character": 3,
                    "line": 5,
                    "position": 27
                },
                "failure": "Forbidden ++ operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "character": 0,
                    "line": 5,
                    "position": 24
                }
            },
            {
                "endPosition": {
                    "character": 3,
                    "line": 6,
                    "position": 33
                },
                "failure": "Forbidden -- operator",
                "name": "test-data/NoIncrementDecrementTestInput.ts",
                "ruleName": "no-increment-decrement",
                "startPosition": {
                    "character": 0,
                    "line": 6,
                    "position": 30
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
