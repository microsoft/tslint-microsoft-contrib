/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noCookiesRule', () : void => {
    it('should not produce violations', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookiesPassingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [ ]
        );
    });

    it('should produce violations', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookiesFailingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 7, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 8, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 9, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 11, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 14, "character": 1 }
                }
            ]
        );
    });

    it('should not throw error ', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookiesTestInput-error.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookiesTestInput-error.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 5, "character": 16 }
                }
            ]
        );
    });

});
/* tslint:enable:quotemark */
