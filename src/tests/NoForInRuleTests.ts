/* tslint:disable:max-line-length */

import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noForInRule', () : void => {
    const ruleName : string = 'no-for-in';

    it('should pass on a regular for statement', () : void => {
        const script : string = `
            for (var i = 0; i < 100; i++) {

            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on a regular for-of statement', () : void => {
        const script : string = `
            for (const item of array) {

            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on for-in statement', () : void => {
        const script : string = `
            for (name in object) {

            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not use the 'for in' statement: 'for (name in object)'. If this is an object, use 'Object.keys' instead. If this is an array use a standard 'for' loop instead.",
                "name": path.resolve("file.ts"),
                "ruleName": "no-for-in",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
