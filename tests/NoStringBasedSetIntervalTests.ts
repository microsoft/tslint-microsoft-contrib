/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noStringBasedSetIntervalRule', () : void => {

    var RULE_NAME : string = 'no-string-based-set-interval';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetIntervalTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 28, "line": 31, "position": 1219 },
                "failure": "Forbidden setInterval string parameter: functionArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 4, "line": 31, "position": 1195 }
            },
            {
                "endPosition": { "character": 36, "line": 36, "position": 1299 },
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 36, "position": 1263 }
            },
            {
                "endPosition": { "character": 32, "line": 37, "position": 1353 },
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 37, "position": 1321 }
            },
            {
                "endPosition": { "character": 24, "line": 38, "position": 1403 },
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 38, "position": 1379 }
            },
            {
                "endPosition": { "character": 36, "line": 39, "position": 1473 },
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 39, "position": 1437 }
            },
            {
                "endPosition": { "character": 29, "line": 40, "position": 1524 },
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 40, "position": 1495 }
            },
            {
                "endPosition": { "character": 41, "line": 41, "position": 1594 },
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 41, "position": 1553 }
            },
            {
                "endPosition": { "character": 37, "line": 42, "position": 1648 },
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 42, "position": 1611 }
            },
            {
                "endPosition": { "character": 29, "line": 43, "position": 1698 },
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 43, "position": 1669 }
            },
            {
                "endPosition": { "character": 41, "line": 44, "position": 1768 },
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 44, "position": 1727 }
            },
            {
                "endPosition": { "character": 34, "line": 45, "position": 1819 },
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 45, "position": 1785 }
            },
            {
                "endPosition": { "character": 43, "line": 46, "position": 1887 },
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 46, "position": 1844 }
            },
            {
                "endPosition": { "character": 39, "line": 47, "position": 1942 },
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 47, "position": 1903 }
            },
            {
                "endPosition": { "character": 31, "line": 48, "position": 1993 },
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 48, "position": 1962 }
            },
            {
                "endPosition": { "character": 43, "line": 49, "position": 2064 },
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 49, "position": 2021 }
            },
            {
                "endPosition": { "character": 36, "line": 50, "position": 2116 },
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 0, "line": 50, "position": 2080 }
            },
            {
                "endPosition": { "character": 26, "line": 52, "position": 2204 },
                "failure": "Forbidden setInterval string parameter: stringArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 4, "line": 52, "position": 2182 }
            },
            {
                "endPosition": { "character": 23, "line": 55, "position": 2295 },
                "failure": "Forbidden setInterval string parameter: anyArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "character": 4, "line": 55, "position": 2276 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
