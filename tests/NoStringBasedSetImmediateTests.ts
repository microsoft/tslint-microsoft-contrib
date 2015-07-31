/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noStringBasedSetImmediateRule', () : void => {

    var RULE_NAME : string = 'no-string-based-set-immediate';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetImmediateTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 29, "line": 31, "position": 1235 },
                "failure": "Forbidden setImmediate string parameter: functionArg",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 4, "line": 31, "position": 1210 }
            },
            {
                "endPosition": { "character": 37, "line": 36, "position": 1316 },
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 36, "position": 1279 }
            },
            {
                "endPosition": { "character": 33, "line": 37, "position": 1371 },
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 37, "position": 1338 }
            },
            {
                "endPosition": { "character": 25, "line": 38, "position": 1422 },
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 38, "position": 1397 }
            },
            {
                "endPosition": { "character": 37, "line": 39, "position": 1493 },
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 39, "position": 1456 }
            },
            {
                "endPosition": { "character": 30, "line": 40, "position": 1545 },
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 40, "position": 1515 }
            },
            {
                "endPosition": { "character": 42, "line": 41, "position": 1616 },
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 41, "position": 1574 }
            },
            {
                "endPosition": { "character": 38, "line": 42, "position": 1671 },
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 42, "position": 1633 }
            },
            {
                "endPosition": { "character": 30, "line": 43, "position": 1722 },
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 43, "position": 1692 }
            },
            {
                "endPosition": { "character": 42, "line": 44, "position": 1793 },
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 44, "position": 1751 }
            },
            {
                "endPosition": { "character": 35, "line": 45, "position": 1845 },
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 45, "position": 1810 }
            },
            {
                "endPosition": { "character": 44, "line": 46, "position": 1914 },
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 46, "position": 1870 }
            },
            {
                "endPosition": { "character": 40, "line": 47, "position": 1970 },
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 47, "position": 1930 }
            },
            {
                "endPosition": { "character": 32, "line": 48, "position": 2022 },
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 48, "position": 1990 }
            },
            {
                "endPosition": { "character": 44, "line": 49, "position": 2094 },
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 49, "position": 2050 }
            },
            {
                "endPosition": { "character": 37, "line": 50, "position": 2147 },
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 0, "line": 50, "position": 2110 }
            },
            {
                "endPosition": { "character": 27, "line": 52, "position": 2236 },
                "failure": "Forbidden setImmediate string parameter: stringArg",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 4, "line": 52, "position": 2213 }
            },
            {
                "endPosition": { "character": 24, "line": 55, "position": 2328 },
                "failure": "Forbidden setImmediate string parameter: anyArg",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "character": 4, "line": 55, "position": 2308 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
