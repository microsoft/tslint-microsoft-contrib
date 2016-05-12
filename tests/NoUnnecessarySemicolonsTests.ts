/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noUnnecessarySemiColons', () : void => {
    it('should produce violations', () : void => {
        var ruleName : string = 'no-unnecessary-semicolons';
        var inputFile : string = 'test-data/NoUnnecessarySemicolonsTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "line": 2, "character": 1 }
                },
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "line": 3, "character": 1 }
                },
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": {"line": 3, "character": 2}
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
