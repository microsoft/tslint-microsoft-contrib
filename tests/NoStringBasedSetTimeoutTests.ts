/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

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
                "startPosition": { "character": 0, "line": 2, "position": 39 },
                "endPosition": { "character": 35, "line": 2, "position": 74 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "endPosition": { "character": 40, "line": 3, "position": 116 },
                "startPosition": { "character": 0, "line": 3, "position": 76 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "endPosition": { "character": 42, "line": 4, "position": 160 },
                "startPosition": { "character": 0, "line": 4, "position": 118 }
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
                "endPosition": { "character": 31, "line": 3, "position": 115 },
                "startPosition": { "character": 0, "line": 3, "position": 84 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "endPosition": { "character": 36, "line": 4, "position": 177 },
                "startPosition": { "character": 0, "line": 4, "position": 141 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "endPosition": { "character": 38, "line": 5, "position": 236 },
                "startPosition": { "character": 0, "line": 5, "position": 198
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
                "endPosition": { "character": 23, "line": 3, "position": 96 },
                "startPosition": { "character": 0, "line": 3, "position": 73 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "endPosition": { "character": 28, "line": 4, "position": 158 },
                "startPosition": { "character": 0, "line": 4, "position": 130 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "endPosition": { "character": 30, "line": 5, "position": 217 },
                "startPosition": { "character": 0, "line": 5, "position": 187 }
            }
        ]);
    });

    it('should produce violations for any functions', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 35, "line": 3, "position": 163 },
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 3, "position": 128 }
            },
            {
                "endPosition": { "character": 40, "line": 4, "position": 225 },
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 4, "position": 185 }
            },
            {
                "endPosition": { "character": 42, "line": 5, "position": 284 },
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 5, "position": 242 }
            }
        ]);
    });

    it('should produce violations for string functions', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 28, "line": 3, "position": 160 },
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 3, "position": 132 }
            },
            {
                "endPosition": { "character": 33, "line": 4, "position": 222 },
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 4, "position": 189 }
            },
            {
                "endPosition": { "character": 35, "line": 5, "position": 282 },
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 0, "line": 5, "position": 247 }
            }
        ]);
    });

    it('should produce violations for parameters', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 25, "line": 3, "position": 103 },
                "failure": "Forbidden setTimeout string parameter: stringArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 4, "line": 3, "position": 82 }
            },
            {
                "endPosition": { "character": 22, "line": 6, "position": 193 },
                "failure": "Forbidden setTimeout string parameter: anyArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 4, "line": 6, "position": 175 }
            }
        ]);
    });

    it('should produce violations for our false positive case', () : void => {
        var inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-false-positive.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 27, "line": 4, "position": 236 },
                "failure": "Forbidden setTimeout string parameter: functionArg",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-false-positive.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 4, "line": 4, "position": 213 }
            }
        ]);
    });

});
