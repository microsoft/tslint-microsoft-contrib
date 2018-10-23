import {TestHelper} from './TestHelper';

describe('noCookiesRule', () : void => {
    it('should not produce violations', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookies/NoCookiesPassingTestInput.ts';
        TestHelper.assertViolationsWithTypeChecker(
            ruleName,
            inputFile,
            [ ]
        );
    });

    it('should produce violations', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookies/NoCookiesFailingTestInput.ts';
        TestHelper.assertViolationsWithTypeChecker(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 7, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 8, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 9, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 11, "character": 1 }
                },
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesFailingTestInput.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 14, "character": 1 }
                }
            ]
        );
    });

    it('should not throw error ', () : void => {
        const ruleName : string = 'no-cookies';
        const inputFile : string = 'test-data/NoCookies/NoCookiesTestInput-error.ts';
        TestHelper.assertViolationsWithTypeChecker(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Forbidden call to document.cookie",
                    "name": "test-data/NoCookies/NoCookiesTestInput-error.ts",
                    "ruleName": "no-cookies",
                    "startPosition": { "line": 5, "character": 16 }
                }
            ]
        );
    });

});