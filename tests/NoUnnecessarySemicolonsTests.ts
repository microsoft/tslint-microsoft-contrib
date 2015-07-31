/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noUnnecessarySemiColons', () : void => {

    it('should produce violations', () : void => {
        var ruleName : string = 'no-unnecessary-semicolons';
        var inputFile : string = 'test-data/NoUnnecessarySemicolonsTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "endPosition": { "character": 1, "line": 1, "position": 34 },
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "character": 0, "line": 1, "position": 33 }
                },
                {
                    "endPosition": { "character": 1, "line": 2, "position": 37 },
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "character": 0, "line": 2, "position": 36 }
                },
                {
                    "endPosition": {"character": 2, "line": 2, "position": 38},
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": {"character": 1, "line": 2, "position": 37}
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
