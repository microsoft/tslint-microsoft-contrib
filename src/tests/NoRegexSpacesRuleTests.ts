import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noRegexSpacesRule', (): void => {
    const ruleName: string = 'no-regex-spaces';

    it('should pass on single space', (): void => {
        const script: string = `
            var re = /foo {3}bar/;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on RegExp object', (): void => {
        const script: string = `
            var re = new RegExp("foo   bar");
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on no spaces', (): void => {
        const script: string = `
            var re = /foobar/;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on spaces in middle', (): void => {
        const script: string = `
            var re = /foo   bar/;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Spaces in regular expressions are hard to count. Use {3}',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-regex-spaces',
                startPosition: { character: 22, line: 2 }
            }
        ]);
    });

    it('should fail on leading spaces', (): void => {
        const script: string = `
            var re = /  bar/;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Spaces in regular expressions are hard to count. Use {2}',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-regex-spaces',
                startPosition: { character: 22, line: 2 }
            }
        ]);
    });

    it('should fail on trailing spaces', (): void => {
        const script: string = `
            var re = /bar    /;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Spaces in regular expressions are hard to count. Use {4}',
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-regex-spaces',
                startPosition: { character: 22, line: 2 }
            }
        ]);
    });
});
