import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noInvalidRegexpRule', (): void => {
    const ruleName: string = 'no-invalid-regexp';

    it('should pass on valid input', (): void => {
        const script: string = `
            var a = new RegExp('.');        // valid constructor
            var b = RegExp('.');            // this is the constructor as well
            var c = this.RegExp('[');       // clearly not the typescript RegExp object
            var d = new RegExp(whatever);   // non-string literal parameter
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on invalid string in constuctor', (): void => {
        const script: string = `
            new RegExp('\\\\') /*error Invalid regular expression: /\/: \ at end of pattern*/
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Invalid regular expression: /\\/: \\ at end of pattern',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-invalid-regexp',
                startPosition: { character: 24, line: 2 }
            }
        ]);
    });

    it('should fail on invalid string in function call', (): void => {
        const script: string = `
            RegExp('[')      /*error Invalid regular expression: /[/: Unterminated character class*/
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Invalid regular expression: /[/: Unterminated character class',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-invalid-regexp',
                startPosition: { character: 20, line: 2 }
            }
        ]);
    });
});
