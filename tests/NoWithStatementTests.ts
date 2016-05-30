/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */

describe('noWithStatementsRule', () : void => {
    it('should produce violations', () : void => {
        let ruleName : string = 'no-with-statement';
        let script : string = `
            with ({}) {
                a = 1;
                b = 2;
            }
        `;
        TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "Forbidden with statement",
                    "name": "file.ts",
                    "ruleName": "no-with-statement",
                    "startPosition": { "character": 13, "line": 2 }
                }
            ]);
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
