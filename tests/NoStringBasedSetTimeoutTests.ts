/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noStringBasedSetTimeoutRule', () : void => {

    var RULE_NAME : string = 'no-string-based-set-timeout';

    it('should not throw error - case 1', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 2', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error2.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 3', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error3.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 4', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error4.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: this.onAnimationEnd()",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-error4.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 11, "character": 13 }
            }
        ]);
    });

    it('should not produce violations', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutPassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations for string literals', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 3, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 5, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string variables', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 6, "character": 1
                }
            }
        ]);
    });

    it('should produce violations for any variables', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for any functions', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string functions', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for parameters', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 5 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: anyArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 7, "character": 5 }
            }
        ]);
    });

    it('should produce violations for our false positive case', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-false-positive.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: functionArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-false-positive.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
