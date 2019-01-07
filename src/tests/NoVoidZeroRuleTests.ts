import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noVoidZeroRule', (): void => {
    const ruleName: string = 'no-void-zero';

    it('should pass when function is given argument of undefined', (): void => {
        const inputScript: string = `function mockFunction(undefined, arg) {}`;
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should fail when assigned void 0', (): void => {
        const inputScript: string = `const foo = void 0`;
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace void 0 with undefined',
                name: Utils.absolutePath('file.ts'),
                ruleName,
                startPosition: { line: 1, character: 13 }
            }
        ]);
    });

    it('should fail when function is given argument of void 0', (): void => {
        const inputScript: string = `
            const baz = (void 0) => {};
            function (void 0) { }
        `;
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace void 0 with undefined',
                name: Utils.absolutePath('file.ts'),
                ruleName,
                startPosition: { line: 2, character: 26 }
            },
            {
                failure: 'Replace void 0 with undefined',
                name: Utils.absolutePath('file.ts'),
                ruleName,
                startPosition: { line: 3, character: 13 }
            },
            {
                failure: 'Replace void 0 with undefined',
                name: Utils.absolutePath('file.ts'),
                ruleName,
                startPosition: { line: 3, character: 13 }
            }
        ]);
    });

    it('should fail when constructor is given argument of void 0', (): void => {
        const inputScript: string = `new Array(void 0)`;
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace void 0 with undefined',
                name: Utils.absolutePath('file.ts'),
                ruleName,
                startPosition: { line: 1, character: 11 }
            }
        ]);
    });
});
