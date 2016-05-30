/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:max-func-body-length */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noStringBasedSetImmediateRule', () : void => {
    let RULE_NAME : string = 'no-string-based-set-immediate';

    it('should produce violations ', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetImmediateTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 37, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 38, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 39, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 40, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 41, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 42, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 43, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 44, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 45, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 46, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 47, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 48, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 49, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 50, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 51, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringArg",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 53, "character": 5 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyArg",
                "name": "test-data/NoStringBasedSetImmediateTestInput.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 56, "character": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:max-func-body-length */
