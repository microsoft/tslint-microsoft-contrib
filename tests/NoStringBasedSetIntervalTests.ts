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
                "failure": "Forbidden setInterval string parameter: functionArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 32, "character": 5 }
            },
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 37, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 38, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 39, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 40, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 41, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 42, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 43, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 44, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 45, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 46, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 47, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 48, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 49, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 50, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 51, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 53, "character": 5 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyArg",
                "name": "test-data/NoStringBasedSetIntervalTestInput.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 56, "character": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
