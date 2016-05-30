/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noStringBasedSetTimeoutRule', () : void => {
    let RULE_NAME : string = 'no-string-based-set-timeout';

    it('should not throw error - case 1', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 2', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error2.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should support type inference on shadowed variables', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 18 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp2",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 21 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 27 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 28 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 35 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp3",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 37 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 38 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 40 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp2",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 41 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-shadow-vars.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 48 }
            }
        ]);
    });

    it('should not throw error - case 3', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error3.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 4', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error4.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: this.onAnimationEnd()",
                "name": "test-data/NoStringBasedSetTimeoutTestInput-error4.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 11, "character": 13 }
            }
        ]);
    });

    it('should not throw error - case 5', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutTestInput-error5.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not produce violations', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutPassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations for string literals', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts';
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
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts';
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
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts';
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
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts';
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
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts';
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
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-parameters.ts';
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

    it('should not produce violations what used to be a false positive case', () : void => {
        let inputFile : string = `
        function invoke(functionArg1 : () => void, functionArg2 = () => {}) {
            setTimeout(functionArg1);
            setTimeout(functionArg2);
        }`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [ ]);
    });

    it('should not fail within a constructor', () : void => {
        let inputFile : string = `
        class MyClass {
            constructor(arg1) {
                setTimeout(arg1, 5);
            }
        }`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: arg1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 17, "line": 4 }
            }
        ]);
    });

    it('should create violations on template strings', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-template-string.ts';

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: `${data}`",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-template-string.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 1, "line": 2 }
            }
        ]);
    });

    it('should pass all Issue #46 usages', () : void => {
        let inputFile : string = 'test-data/NoStringBasedSetTimeoutFailingTestInput-issue46.ts';

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-issue46.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 15 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-issue46.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 16 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-issue46.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 19 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": "test-data/NoStringBasedSetTimeoutFailingTestInput-issue46.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
