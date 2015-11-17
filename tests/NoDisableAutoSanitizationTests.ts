/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noDisableAutoSanitizationRule', () : void => {

    it('should produce violation for execUnsafeLocalFunction', () : void => {
        var ruleName : string = 'no-disable-auto-sanitization';
        var script : string = 'var retVal = MSApp.execUnsafeLocalFunction(() => {});';
        TestHelper.assertViolations(ruleName, null,script,
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
        var ruleName : string = 'no-disable-auto-sanitization';
        var script : string = 'WinJS.Utilities.setInnerHTMLUnsafe(element, text);';
        TestHelper.assertViolations(ruleName, null,script,
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
