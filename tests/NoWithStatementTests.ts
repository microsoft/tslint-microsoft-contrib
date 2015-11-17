/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */

describe('noWithStatementsRule', () : void => {

    it('should produce violations', () : void => {
        var ruleName : string = 'no-with-statement';
        var script : string = `
            with ({}) {
                a = 1;
                b = 2;
            }
        `;
        TestHelper.assertViolations(ruleName, null, script, [
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
