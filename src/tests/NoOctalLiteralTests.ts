import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

/* tslint:disable:no-octal-literal */
/* tslint:disable:max-func-body-length */
describe('noOctalLiteralRule', (): void => {
    const ruleName: string = 'no-octal-literal';

    it('should not fail on similar but acceptable strings', (): void => {
        const script: string = 'test-data/NoOctalLiteral/NoOctalLiteralTestInput-passing.ts';
        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on 3 digit octal literals', (): void => {
        const script: string = `
/**
 * The following code should have errors:
 */
function demoScriptFail() {
    var a = "Sample text \\251";
    var b = "Sample text \\254 more text";
    var c = 'Sample text \\351';
    var d = 'Sample text \\354 more text';
}`;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Octal literals should not be used: \\251',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                startPosition: { character: 26, line: 6 }
            },
            {
                failure: 'Octal literals should not be used: \\254',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                startPosition: { character: 26, line: 7 }
            },
            {
                failure: 'Octal literals should not be used: \\351',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                startPosition: { character: 26, line: 8 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                startPosition: { character: 26, line: 9 }
            }
        ]);
    });

    it('should produce violations - batch1', (): void => {
        const inputFile: string = `
/**
 * The following code should have errors:
 */
function demoScriptFail1() {
    return "Sample text \\251";
    return "Sample text \\254 more text";
    return "Sample text \\23";
    return "Sample text \\7";
    return "Sample text \\025";
    return "Sample text \\0";
    return "Sample text \\\\\\0";
    return "Sample text \\-0";
    return "Sample text \\\\\\-0";
    return "Sample text \\-035";
    return "Sample text \\-235";
}`;
        TestHelper.assertViolations(ruleName, inputFile, [
            {
                failure: 'Octal literals should not be used: \\251',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 6 }
            },
            {
                failure: 'Octal literals should not be used: \\254',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 7 }
            },
            {
                failure: 'Octal literals should not be used: \\23',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 8 }
            },
            {
                failure: 'Octal literals should not be used: \\7',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 9 }
            },
            {
                failure: 'Octal literals should not be used: \\025',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 10 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 11 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 12 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 13 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 14 }
            },
            {
                failure: 'Octal literals should not be used: \\-035',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 15 }
            },
            {
                failure: 'Octal literals should not be used: \\-235',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 16 }
            }
        ]);
    });

    it('should produce violations - batch2', (): void => {
        const inputFile: string = `
/**
 * The following code should have errors:
 */
function demoScriptFail2() {
    return 'Sample text \\351';
    return 'Sample text \\354 more text';
    return 'Sample text \\33';
    return 'Sample text \\6';
    return 'Sample text \\125';
    return 'Sample text \\0';
    return 'Sample text \\-0';
    return 'Sample text \\\\\\0';
    return 'Sample text \\\\\\-0';
    return 'Sample text \\-035';
    return 'Sample text \\-235';
}`;
        TestHelper.assertViolations(ruleName, inputFile, [
            {
                failure: 'Octal literals should not be used: \\351',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 6 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 7 }
            },
            {
                failure: 'Octal literals should not be used: \\33',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 8 }
            },
            {
                failure: 'Octal literals should not be used: \\6',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 9 }
            },
            {
                failure: 'Octal literals should not be used: \\125',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 10 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 11 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 12 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 13 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 14 }
            },
            {
                failure: 'Octal literals should not be used: \\-035',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 15 }
            },
            {
                failure: 'Octal literals should not be used: \\-235',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 16 }
            }
        ]);
    });

    it('should produce violations - batch3', (): void => {
        const inputFile: string = `
/**
 * The following code should have errors:
 */
function demoScriptFail3() {
    return \`Sample text \\351\`;
    return \`Sample text \\354 more text\`;
    return \`Sample text \\33\`;
    return \`Sample text \\6\`;
    return \`Sample text \\125\`;
    return \`Sample text \\0\`;
    return \`Sample text \\-0\`;
    return \`Sample text \\\\\\0\`;
    return \`Sample text \\\\\\-0\`;
    return \`Sample text \\-035\`;
    return \`Sample text \\-235\`;
}`;
        TestHelper.assertViolations(ruleName, inputFile, [
            {
                failure: 'Octal literals should not be used: \\351',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 6 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 7 }
            },
            {
                failure: 'Octal literals should not be used: \\33',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 8 }
            },
            {
                failure: 'Octal literals should not be used: \\6',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 9 }
            },
            {
                failure: 'Octal literals should not be used: \\125',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 10 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 11 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 12 }
            },
            {
                failure: 'Octal literals should not be used: \\0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 13 }
            },
            {
                failure: 'Octal literals should not be used: \\-0',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 27, line: 14 }
            },
            {
                failure: 'Octal literals should not be used: \\-035',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 15 }
            },
            {
                failure: 'Octal literals should not be used: \\-235',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 16 }
            }
        ]);
    });

    it('should produce violations - batch4', (): void => {
        const inputFile: string = `
/**
 * The following code should have errors:
 */
function demoScriptFail4() {
    return 'Sample text \\354 \\n more text';
    return 'Sample text \\354 \\t more text';
    return 'Sample text \\354 \\u2028 more text';
    return 'Sample text \\354 \\u2029 more text';
    return \`Sample text \\354
more text\`;
}`;
        TestHelper.assertViolations(ruleName, inputFile, [
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 6 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 7 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 8 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 9 }
            },
            {
                failure: 'Octal literals should not be used: \\354',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-octal-literal',
                ruleSeverity: 'ERROR',
                startPosition: { character: 25, line: 10 }
            }
        ]);
    });
});

/* tslint:enable:no-octal-literal */
/* tslint:enable:max-func-body-length */
