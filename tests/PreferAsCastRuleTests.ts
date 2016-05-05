/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('preferAsCastRule', () : void => {

    var ruleName : string = 'prefer-as-cast';

    it('should pass on as case', () : void => {
        var script : string = `
            let myString = myVariable as string;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on traditional type cast', () : void => {
        var script : string = `
            let myString = <string>myVariable;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found type-cast that does not use the as keyword. Please convert to an as-cast: <string>myVariable",
                "name": "file.ts",
                "ruleName": "prefer-as-cast",
                "startPosition": { "character": 28, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
