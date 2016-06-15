/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noTypeofUndefinedRule', () : void => {

    const ruleName : string = 'no-typeof-undefined';

    it('should pass on normal comparisons', () : void => {
        const script : string = `
            if(x === undefined) {}
            if(x == undefined) {}
            if(x === null) {}
            if(x == null) {}

            if(x === 'undefined') {}
            if(x == 'undefined') {}

            if(typeof x === 'object') {}
            if(typeof x == 'object') {}
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on normal comparisons - yoda style', () : void => {
        const script : string = `
            if(undefined === x) {}
            if(undefined == x) {}
            if(null === x) {}
            if(null == x) {}

            if('undefined' === x) {}
            if('undefined' == x) {}

            if('object' === typeof x) {}
            if('object' == typeof) {}
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on typeof strict comparison', () : void => {
        const script : string = `
            if(typeof x === 'undefined') {}
            if('undefined' === typeof x) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Avoid typeof x === 'undefined' comparisons. Prefer x == undefined or x === undefined: typeof x === 'undefined'",
                "name": "file.ts",
                "ruleName": "no-typeof-undefined",
                "startPosition": { "character": 16, "line": 2 }
            },
            {
                "failure": "Avoid typeof x === 'undefined' comparisons. Prefer x == undefined or x === undefined: 'undefined' === typeof x",
                "name": "file.ts",
                "ruleName": "no-typeof-undefined",
                "startPosition": { "character": 16, "line": 3 }
            }
        ]);
    });

    it('should fail on typeof weak comparison', () : void => {
        const script : string = `
            if(typeof x == 'undefined') {}
            if('undefined' == typeof x) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Avoid typeof x === 'undefined' comparisons. Prefer x == undefined or x === undefined: typeof x == 'undefined'",
                "name": "file.ts",
                "ruleName": "no-typeof-undefined",
                "startPosition": { "character": 16, "line": 2 }
            },
            {
                "failure": "Avoid typeof x === 'undefined' comparisons. Prefer x == undefined or x === undefined: 'undefined' == typeof x",
                "name": "file.ts",
                "ruleName": "no-typeof-undefined",
                "startPosition": { "character": 16, "line": 3 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
