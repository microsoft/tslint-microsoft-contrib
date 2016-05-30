/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('preferTypeCastRule', () : void => {
    const ruleName : string = 'prefer-type-cast';

    it('should pass on traditional type cast', () : void => {
        const script : string = `
            let myString = <string>myVariable;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on as-cast within a .tsx file', () : void => {
        TestHelper.assertViolations(ruleName, 'test-data/PreferTypeCastRuleTests-passing.tsx', [ ]);
    });

    it('should fail on as-cast', () : void => {
        const script : string = `
            let myString = myVariable as string;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found as-cast instead of a traditional type-cast. Please convert to a type-cast: myVariable as string",
                "name": "file.ts",
                "ruleName": "prefer-type-cast",
                "startPosition": { "character": 28, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
