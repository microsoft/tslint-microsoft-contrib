import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noIncrementDecrementRule', (): void => {
    const RULE_NAME: string = 'no-increment-decrement';

    it('should produce violations ', (): void => {
        const inputFile: string = `
var x;

x++;
x--;
++x;
--x;

`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: 'Forbidden ++ operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 4,
                    character: 1
                }
            },
            {
                failure: 'Forbidden -- operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 5,
                    character: 1
                }
            },
            {
                failure: 'Forbidden ++ operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 6,
                    character: 1
                }
            },
            {
                failure: 'Forbidden -- operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 7,
                    character: 1
                }
            }
        ]);
    });
});
