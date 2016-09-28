import { TestHelper } from './TestHelper';
import { getFailureString } from '../src/reactA11yProptypesRule';

/**
 * Unit test for react-a11y-proptypes rule.
 */
describe('reactA11yProptypesRule', () => {
    const ruleName: string = 'react-a11y-proptypes';

    describe('should pass', () => {
        const fileDirectory: string = 'test-data/a11yProptypes/PassingTestInputs/';

        it('when can not check the type of attribute value until running time', () => {
            const fileName: string = fileDirectory + 'canNotCheckUntilRunTime.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when allowing undefined attribute value is undefined', () => {
            const fileName: string = fileDirectory + 'allowUndefined.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when boolean type value is vaild', () => {
            const fileName: string = fileDirectory + 'boolean.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when integer type value is vaild', () => {
            const fileName: string = fileDirectory + 'integer.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when number type value is vaild', () => {
            const fileName: string = fileDirectory + 'number.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when string type value is vaild', () => {
            const fileName: string = fileDirectory + 'string.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when token type value is vaild', () => {
            const fileName: string = fileDirectory + 'token.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when tokenlist type value is vaild', () => {
            const fileName: string = fileDirectory + 'tokenlist.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });

        it('when tristate type value is vaild', () => {
            const fileName: string = fileDirectory + 'tristate.tsx';
            TestHelper.assertNoViolation(ruleName, fileName);
        });
    });

    describe('should fail', () => {
        const fileDirectory: string = 'test-data/a11yProptypes/FailingTestInputs/';

        it('when not allowing undefined attribute value is undefined', () => {
            const fileName: string = fileDirectory + 'notAllowUndefined.tsx';

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-label', 'string', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-label', 'string', [])
                    }
                ]
            );
        });

        it('when boolean type value is invalid', () => {
            const fileName: string = fileDirectory + 'boolean.tsx';

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-hidden', 'boolean', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-hidden', 'boolean', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-hidden', 'boolean', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 6 },
                        failure: getFailureString('aria-hidden', 'boolean', [])
                    }
                ]
            );
        });

        it('when integer type value is invalid', () => {
            const fileName: string = fileDirectory + 'integer.tsx';

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 6 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 7 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 8 },
                        failure: getFailureString('aria-level', 'integer', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 9 },
                        failure: getFailureString('aria-level', 'integer', [])
                    }
                ]
            );
        });

        it('when number type value is invalid', () => {
            const fileName: string = fileDirectory + 'number.tsx';

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-valuemax', 'number', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-valuemax', 'number', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-valuemax', 'number', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 6 },
                        failure: getFailureString('aria-valuemax', 'number', [])
                    }
                ]
            );
        });

        it('when string type value is invalid', () => {
            const fileName: string = fileDirectory + 'string.tsx';

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-label', 'string', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-label', 'string', [])
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-label', 'string', [])
                    }
                ]
            );
        });

        it('when token type value is invalid', () => {
            const fileName: string = fileDirectory + 'token.tsx';
            const permittedValues: string[] = ['ascending', 'descending', 'none', 'other'];

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-sort', 'token', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-sort', 'token', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-sort', 'token', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 6 },
                        failure: getFailureString('aria-sort', 'token', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 7 },
                        failure: getFailureString('aria-sort', 'token', permittedValues)
                    }
                ]
            );
        });

        it('when tokenlist type value is invalid', () => {
            const fileName: string = fileDirectory + 'tokenlist.tsx';
            const permittedValues: string[] = ['additions', 'removals', 'text', 'all'];

            TestHelper.assertViolations(
                ruleName,
                fileName,
                [
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 3 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 4 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 5 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 6 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 7 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    },
                    {
                        name: fileName,
                        ruleName: ruleName,
                        startPosition: { character: 16, line: 8 },
                        failure: getFailureString('aria-relevant', 'tokenlist', permittedValues)
                    }
                ]
            );
        });
    });
});
