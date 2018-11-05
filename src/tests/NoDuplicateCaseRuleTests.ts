import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noDuplicateCaseRule', (): void => {
    const ruleName: string = 'no-duplicate-case';

    it('should pass on valid switch', (): void => {
        const script: string = `
            var a = 1;

            switch (a) {
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            } `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on string duplicates', (): void => {
        const script: string = `
            switch (a) {
                case 1:
                    break;
                case 1:      /*error Duplicate case label.*/
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Duplicate case found in switch statement: 1',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-duplicate-case',
                startPosition: { character: 17, line: 5 }
            }
        ]);
    });

    it('should fail on number duplicates', (): void => {
        const script: string = `
            switch (a) {
                case "1":
                    break;
                case "1":      /*error Duplicate case label.*/
                    break;
                case "2":
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Duplicate case found in switch statement: "1"',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-duplicate-case',
                startPosition: { character: 17, line: 5 }
            }
        ]);
    });

    it('should fail on identifier duplicates', (): void => {
        const script: string = `
            switch (a) {
                case one:
                    break;
                case one:      /*error Duplicate case label.*/
                    break;
                case two:
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Duplicate case found in switch statement: one',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-duplicate-case',
                startPosition: { character: 17, line: 5 }
            }
        ]);
    });
});
