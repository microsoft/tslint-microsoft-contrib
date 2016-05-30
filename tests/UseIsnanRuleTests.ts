/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('useIsnanRule', () : void => {
    const ruleName : string = 'use-isnan';

    it('should pass on xxx', () : void => {
        const script : string = `
        if (isNaN(NaN)) { }
        if (isNaN(something)) { }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on equality NaN', () : void => {
        const script : string = `
        if (foo == NaN) {  }
        if (NaN === foo) {  }
        if (foo != NaN) {  }
        if (NaN !== foo) {  }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found an invalid comparison for NaN: foo == NaN",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found an invalid comparison for NaN: NaN === foo",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found an invalid comparison for NaN: foo != NaN",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found an invalid comparison for NaN: NaN !== foo",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 5 }
            }
        ]);
    });

    it('should fail on other binary expressions', () : void => {
        const script : string = `
        if (foo > NaN) { }
        if (NaN >= foo) { }
        if (foo < NaN) { }
        if (NaN <= foo) { }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found an invalid comparison for NaN: foo > NaN",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found an invalid comparison for NaN: NaN >= foo",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found an invalid comparison for NaN: foo < NaN",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found an invalid comparison for NaN: NaN <= foo",
                "name": "file.ts",
                "ruleName": "use-isnan",
                "startPosition": { "character": 13, "line": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
