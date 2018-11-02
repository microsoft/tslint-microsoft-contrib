import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('preferArrayLiteralRule', (): void => {
    const ruleName: string = 'prefer-array-literal';

    it('should allow string[] as variable type', (): void => {
        const inputScript: string = 'var x : string[];';
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow Array type parameters when options say to ignore type params', (): void => {
        const inputScript: string = `
            let myArray: Array<string> = [];

            interface MyInterface {
                myArray: Array<string>;
            }        `;
        TestHelper.assertViolationsWithOptions(ruleName, [true, { 'allow-type-parameters': true }], inputScript, []);
    });

    it('should ban Array<string> as variable type', (): void => {
        const inputScript: string = 'var x : Array<string>;';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace generic-typed Array with array literal: Array<string>',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'prefer-array-literal',
                startPosition: { character: 9, line: 1 }
            }
        ]);
    });

    it('should ban Array<string> as parameter type', (): void => {
        const inputScript: string = 'function (parm: Array<number>) {}';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace generic-typed Array with array literal: Array<number>',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'prefer-array-literal',
                startPosition: { character: 17, line: 1 }
            }
        ]);
    });

    it('should ban new Array() constructor', (): void => {
        const inputScript: string = 'new Array()';
        TestHelper.assertViolationsWithOptions(ruleName, [true, { 'allow-type-parameters': true }], inputScript, [
            {
                failure: 'Replace Array constructor with an array literal: new Array()',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'prefer-array-literal',
                startPosition: { character: 1, line: 1 }
            }
        ]);
    });

    it('should ban new Array(4, 5) constructor', (): void => {
        const inputScript: string = 'new Array(4, 5)';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace Array constructor with an array literal: new Array(4, 5)',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'prefer-array-literal',
                startPosition: { character: 1, line: 1 }
            }
        ]);
    });

    it('should ban new Array(4) constructor', (): void => {
        const inputScript: string = 'new Array(4)';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Replace Array constructor with an array literal: new Array(4)',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'prefer-array-literal',
                startPosition: { character: 1, line: 1 }
            }
        ]);
    });
});
