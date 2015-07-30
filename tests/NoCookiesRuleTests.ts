/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import TestHelper = require('./TestHelper');

describe('noCookiesRule', () : void => {

    it('should not produce violations', () : void => {
        var ruleName : string = 'no-cookies';
        var inputFile : string = 'test-data/NoCookiesPassingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [ ]
        );
    });

    it('should produce violations', () : void => {
        var ruleName : string = 'no-cookies';
        var inputFile : string = 'test-data/NoCookiesFailingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "endPosition": { "character": 8, "line": 6, "position": 88 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 0, "line": 6, "position": 80 }
                },
                {
                    "endPosition": { "character": 13, "line": 7, "position": 119 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 0, "line": 7, "position": 106 }
                },
                {
                    "endPosition": { "character": 15, "line": 8, "position": 152 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 0, "line": 8, "position": 137 }
                },
                {
                    "endPosition": { "character": 18, "line": 10, "position": 190 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 0, "line": 10, "position": 172 }
                },
                {
                    "endPosition": { "character": 3, "line": 13, "position": 234 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 0, "line": 13, "position": 231 }
                }
            ]
        );
    });

    it('should not throw error ', () : void => {
        var ruleName : string = 'no-cookies';
        var inputFile : string = 'test-data/NoCookiesTestInput-error.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "endPosition": { "character": 23, "line": 4, "position": 69 },
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesTestInput-error.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "character": 15, "line": 4, "position": 61 }
                }
            ]
        );
    });

});
