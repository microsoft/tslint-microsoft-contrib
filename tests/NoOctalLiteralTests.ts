/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/* tslint:disable:no-octal-literal */
describe('noOctalLiteralRule', () : void => {

    var RULE_NAME : string = 'no-octal-literal';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoOctalLiteralTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Octal literals should not be used: \\251",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 13, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\254",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 14, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\23",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 15, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\7",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 16, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\025",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 17, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 18, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 19, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-035",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 20, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-235",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 21, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\351",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 25, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\354",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 26, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\33",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 27, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\6",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 28, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\125",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 29, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 30, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-0",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 31, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-035",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 32, "character": 25 }
            },
            {
                "failure": "Octal literals should not be used: \\-235",
                "name": "test-data/NoOctalLiteralTestInput.ts",
                "ruleName": "no-octal-literal",
                "startPosition": { "line": 33, "character": 25 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-octal-literal */
