import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

/**
 * Unit tests.
 */
describe('noIncrementDecrementRule', (): void => {
    const RULE_NAME: string = 'no-increment-decrement';
    const OPTION_ALLOW_FOR_LOOPS = 'allow-for-loops';

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
    it('allows increments and decrements in loop incrementor clause, if allow-for-loops option is specified', (): void => {
        const inputFile: string = `
for(let x=0; x<10; x++) {}
for(let y=10; y>=0; y--) {}
`;
        TestHelper.assertNoViolationWithOptions(RULE_NAME, [true, OPTION_ALLOW_FOR_LOOPS], inputFile);
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                failure: 'Forbidden ++ operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 2,
                    character: 20
                }
            },
            {
                failure: 'Forbidden -- operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 3,
                    character: 21
                }
            }
        ]);
    });
    it('forbids increments and decrements in loop bodies, even with allow-for-loops', (): void => {
        const inputFile: string = `
for(let x=0; x<10; x+=1) {
    x++;
    x--;
}
`;
        const expectedViolations: TestHelper.ExpectedFailure[] = [
            {
                failure: 'Forbidden ++ operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 3,
                    character: 5
                }
            },
            {
                failure: 'Forbidden -- operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 4,
                    character: 5
                }
            }
        ];
        TestHelper.assertViolationsWithOptions(RULE_NAME, [true, OPTION_ALLOW_FOR_LOOPS], inputFile, expectedViolations);
        TestHelper.assertViolations(RULE_NAME, inputFile, expectedViolations);
    });

    it('forbids increments and decrements in loop initializer and condition, even with allow-for-loops', (): void => {
        const inputFile: string = `for(let x=++y; x<--y; x+=1) {}`;
        const expectedViolations: TestHelper.ExpectedFailure[] = [
            {
                failure: 'Forbidden ++ operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 1,
                    character: 11
                }
            },
            {
                failure: 'Forbidden -- operator',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-increment-decrement',
                startPosition: {
                    line: 1,
                    character: 18
                }
            }
        ];
        TestHelper.assertViolationsWithOptions(RULE_NAME, [true, OPTION_ALLOW_FOR_LOOPS], inputFile, expectedViolations);
        TestHelper.assertViolations(RULE_NAME, inputFile, expectedViolations);
    });
});
