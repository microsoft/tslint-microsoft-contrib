import { TestHelper } from './TestHelper';

describe('noFunctionConstructorWithStringArgsRule', (): void => {
    const RULE_NAME: string = 'no-function-constructor-with-string-args';

    it('should produce violations ', (): void => {
        const inputFile: string = 'test-data/NoFunctionConstructorWithStringArgsTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: 'forbidden: Function constructor with string arguments ',
                name: 'test-data/NoFunctionConstructorWithStringArgsTestInput.ts',
                ruleName: 'no-function-constructor-with-string-args',
                startPosition: {
                    line: 1,
                    character: 9
                }
            }
        ]);
    });
});
