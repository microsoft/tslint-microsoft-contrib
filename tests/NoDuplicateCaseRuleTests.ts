/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noDuplicateCaseRule', () : void => {
    let ruleName : string = 'no-duplicate-case';

    it('should pass on valid switch', () : void => {
        let script : string = `
            var a = 1;

            switch (a) {
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            } `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on string duplicates', () : void => {
        let script : string = `
            switch (a) {
                case 1:
                    break;
                case 1:      /*error Duplicate case label.*/
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Duplicate case found in switch statement: 1",
                "name": "file.ts",
                "ruleName": "no-duplicate-case",
                "startPosition": { "character": 17, "line": 5 }
            }
        ]);
    });

    it('should fail on number duplicates', () : void => {
        let script : string = `
            switch (a) {
                case "1":
                    break;
                case "1":      /*error Duplicate case label.*/
                    break;
                case "2":
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Duplicate case found in switch statement: \"1\"",
                "name": "file.ts",
                "ruleName": "no-duplicate-case",
                "startPosition": { "character": 17, "line": 5 }
            }
        ]);
    });

    it('should fail on identifier duplicates', () : void => {
        let script : string = `
            switch (a) {
                case one:
                    break;
                case one:      /*error Duplicate case label.*/
                    break;
                case two:
                    break;
                default:
                    break;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Duplicate case found in switch statement: one",
                "name": "file.ts",
                "ruleName": "no-duplicate-case",
                "startPosition": { "character": 17, "line": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
