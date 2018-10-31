import { TestHelper } from './TestHelper';

/**
 * Unit tests.
 */
describe('detectUnsafeRegexRule', (): void => {

    const ruleName: string = 'detect-unsafe-regex';

    describe('Check for litteral patterns', () => {

        it('should pass with literals', (): void => {
            const script: string = 'test-data/DetectUnsafeRegex/PassingTestInputs/allowLiterals.ts';
            TestHelper.assertViolationsWithTypeChecker(ruleName, script, []);
        });

        it('should fail with variables', (): void => {
            const script: string = 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts';
            TestHelper.assertViolationsWithTypeChecker(ruleName, script, [
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': {
                        'character': 55, 'line': 6
                    }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 72, 'line': 7 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 63, 'line': 8 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 72, 'line': 8 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 51, 'line': 12 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 68, 'line': 13 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 59, 'line': 14 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowNonLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 68, 'line': 14 }
                }
            ]);
        });

        it('should fail temperated literals', (): void => {
            const script: string = 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowTemplateLiterals.ts';
            TestHelper.assertViolationsWithTypeChecker(ruleName, script, [
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowTemplateLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 46, 'line': 1 }
                },
                {
                    'failure': 'Non literal RegExp detected, this can lead to ReDos vulnerabilities: '
                        + 'https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowTemplateLiterals.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 51, 'line': 2 }
                }
            ]);
        });
    });

    describe('check for safe patterns', () => {
        it('should pass with safe patterns', (): void => {
            const script: string = 'test-data/DetectUnsafeRegex/PassingTestInputs/allowSafePatterns.ts';
            TestHelper.assertViolationsWithTypeChecker(ruleName, script, []);
        });

        it('should fail on unsafe patterns', () => {
            const script: string = 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts';
            TestHelper.assertViolationsWithTypeChecker(ruleName, script, [
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 32, 'line': 1 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 32, 'line': 2 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 38, 'line': 4 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 38, 'line': 5 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 39, 'line': 7 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 39, 'line': 8 }
                },
                {
                    'failure': 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS',
                    'name': 'test-data/DetectUnsafeRegex/FailingTestInputs/disallowUnsafePatterns.ts',
                    'ruleName': 'detect-unsafe-regex',
                    'ruleSeverity': 'ERROR',
                    'startPosition': { 'character': 48, 'line': 10 }
                }
            ]);
        });
    });

});
