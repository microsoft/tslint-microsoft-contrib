import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noDisableAutoSanitizationRule', () : void => {
    it('should produce violation for execUnsafeLocalFunction', () : void => {
        const ruleName : string = 'no-disable-auto-sanitization';
        const script : string = 'var retVal = MSApp.execUnsafeLocalFunction(() => {});';
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    "failure": "Forbidden call to execUnsafeLocalFunction",
                    "ruleName": "no-disable-auto-sanitization",
                    "name": Utils.absolutePath("file.ts"),
                    "startPosition": { "line": 1, "character": 14 }
                }
            ]
        );
    });

    it('should produce violation for setInnerHTMLUnsafe', () : void => {
        const ruleName : string = 'no-disable-auto-sanitization';
        const script : string = 'WinJS.Utilities.setInnerHTMLUnsafe(element, text);';
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    "failure": "Forbidden call to setInnerHTMLUnsafe",
                    "ruleName": "no-disable-auto-sanitization",
                    "name": Utils.absolutePath("file.ts"),
                    "startPosition": { "line": 1, "character": 1 }
                }
            ]
        );
    });
});
