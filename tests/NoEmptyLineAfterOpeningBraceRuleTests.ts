/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';


/**
 * Unit tests.
 */
describe('noEmptyLineAfterOpeningBraceRule', (): void => {
    const ruleName: string = 'no-empty-line-after-opening-brace';

    it('should allow a single-line block', (): void => {
        const inputScript: string = 'function () { }';

        TestHelper.assertViolations(ruleName, inputScript, []);
    });


    it('should allow a multiline block without a newline after the opening brace', (): void => {
        const inputScript: string = `
            function () {
            }
        `;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should ban a multiline block with a newline after the opening brace', (): void => {
        const inputScript: string = `
            function () {

            }
        `;

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                failure: 'Opening brace cannot be followed by empty line',
                name: 'file.ts',
                ruleName: ruleName,
                startPosition: {
                    character: 1,
                    line: 3
                }
            }
        ]);
    });
});
