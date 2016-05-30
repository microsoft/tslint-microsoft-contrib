/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noForInRule', () : void => {
    let ruleName : string = 'no-for-in';

    it('should pass on regular for statement', () : void => {
        let script : string = `
            for (var i = 0; i < 100; i++) {

            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on for-in statement', () : void => {
        let script : string = `
            for (name in object) {

            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not use for in statements, use Object.keys instead: for (name in object)",
                "name": "file.ts",
                "ruleName": "no-for-in",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
