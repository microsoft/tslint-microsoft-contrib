/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noDisableAutoSanitizationRule', () : void => {
    it('should produce violation for execUnsafeLocalFunction', () : void => {
        let ruleName : string = 'no-disable-auto-sanitization';
        let script : string = 'var retVal = MSApp.execUnsafeLocalFunction(() => {});';
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    "failure": "Forbidden call to execUnsafeLocalFunction",
                    "ruleName": "no-disable-auto-sanitization",
                    "name": "file.ts",
                    "startPosition": { "line": 1, "character": 14 }
                }
            ]
        );
    });

    it('should produce violation for setInnerHTMLUnsafe', () : void => {
        let ruleName : string = 'no-disable-auto-sanitization';
        let script : string = 'WinJS.Utilities.setInnerHTMLUnsafe(element, text);';
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    "failure": "Forbidden call to setInnerHTMLUnsafe",
                    "ruleName": "no-disable-auto-sanitization",
                    "name": "file.ts",
                    "startPosition": { "line": 1, "character": 1 }
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
