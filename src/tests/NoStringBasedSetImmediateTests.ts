/* tslint:disable:max-func-body-length */
import { TestHelper } from './TestHelper';

/* tslint:disable:no-consecutive-blank-lines */
describe('noStringBasedSetImmediateRule', (): void => {
    const RULE_NAME: string = 'no-string-based-set-immediate';

    it('should produce violations ', (): void => {
        const inputFile: string = 'test-data/NoStringBasedSetImmediateTestInput.ts';
        TestHelper.assertViolations(
            RULE_NAME,
            inputFile,
            [
                {
                    failure: 'Forbidden setImmediate string parameter: "var x = \'should fail\'"',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 47, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: typedStringVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 48, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: anyVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 49, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: untypedCreateFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 50, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: stringFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 51, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: "var x = \'should fail\'"',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 52, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: typedStringVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 53, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: anyVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 54, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: untypedCreateFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 55, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: stringFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 56, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: "var x = \'should fail\'"',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 57, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: typedStringVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 58, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: anyVariable',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 59, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: untypedCreateFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 60, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: stringFunction()',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 61, character: 1 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: stringArg',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 63, character: 5 }
                },
                {
                    failure: 'Forbidden setImmediate string parameter: anyArg',
                    name: inputFile,
                    ruleName: 'no-string-based-set-immediate',
                    startPosition: { line: 66, character: 5 }
                }
            ],
            true
        );
    });
});
/* tslint:enable:max-func-body-length */
/* tslint:enable:no-consecutive-blank-lines */
