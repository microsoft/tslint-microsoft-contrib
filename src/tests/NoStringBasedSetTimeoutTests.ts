import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noStringBasedSetTimeoutRule', () : void => {
    const RULE_NAME : string = 'no-string-based-set-timeout';

    it('should not throw error - case 1', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 2', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-case2.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should pass when function parameter is Function', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-functionParamFunction.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should support type inference on shadowed variables', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-shadowedVariables.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 18 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp2",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 21 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 27 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 28 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 35 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp3",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 37 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 38 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 40 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp2",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 41 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 48 }
            }
        ]);
    });

    it('should not throw error - case 3', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error3.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 4', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error4.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: this.onAnimationEnd()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error4.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 12, "character": 13 }
            }
        ]);
    });

    it('should not throw error - case 5', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error5.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should not produce violations', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-case3.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, []);
    });

    it('should produce violations for string literals', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 3, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 5, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string variables', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 6, "character": 1
                }
            }
        ]);
    });

    it('should produce violations for any variables', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for any functions', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string functions', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for parameters', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-parameters.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringArg",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 5 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: anyArg",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 7, "character": 5 }
            }
        ]);
    });

    it('should not produce violations what used to be a false positive case', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-formerFalsePositive.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [ ]);
    });

    it('should not fail within a constructor', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-constructor.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: arg1",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 4 }
            }
        ]);
    });

    it('should create violations on template strings', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-template-strings.ts';

        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                // tslint:disable-next-line:no-invalid-template-strings
                "failure": "Forbidden setTimeout string parameter: `${data}`",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 1, "line": 2 }
            }
        ]);
    });

    it('should pass all Issue #46 usages', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-issue46.ts';

        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 15 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 16 }
            },
            {
                // tslint:disable-next-line:no-invalid-template-strings
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 19 }
            },
            {
                // tslint:disable-next-line:no-invalid-template-strings
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": inputFile,
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            }
        ]);
    });

    it('should produce violation for string variable - case 4', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-case4.ts';
        TestHelper.assertViolationsWithTypeChecker(RULE_NAME, inputFile, [
            {
                ruleName: 'no-string-based-set-timeout',
                failure: 'Forbidden setTimeout string parameter: typedStringVariable',
                name: 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-case4.ts',
                startPosition: { line: 9, character: 5 }
            }
        ]);
    });

});