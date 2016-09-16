/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:no-http-string */
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noHttpStringRule', (): void => {
    const ruleName: string = 'no-http-string';

    it('should ban http strings in variables', (): void => {
        const inputScript: string = 'var x = \'http://www.examples.com\'';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.examples.com'",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": {"character": 9, "line": 1}
            }
        ]);
    });

    it('should ban http strings in default values', (): void => {
        const inputScript: string = 'function f(x : string = \'http://www.example.com/whatever\') {}';
        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Forbidden http url in string: 'http://www.example.com/whatever'",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": {"character": 25, "line": 1}
            }
        ]);
    });

    it('should allow https strings in variables', (): void => {
        const inputScript: string = 'var x = \'https://www.microsoft.com\'';
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow https strings in default values', (): void => {
        const inputScript: string = 'function f(x : string = \'https://www.microsoft.com\') {}';
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow http strings in that match the exclude regex', (): void => {
        const inputScript: string = 'var x = "http://www.allowed.com"';
        const excludeRules = ["http://www\\.allowed\\.com/?"];
        TestHelper.assertNoViolationWithOptions(ruleName, excludeRules, inputScript);
    });

    it('should disallow http strings in that do not match the exclude regex', (): void => {
        const inputScript: string = 'var x = "http://www.notallowed.com"';
        const excludeRules = ["http://www\\.allowed\\.com/?"];
        TestHelper.assertViolationsWithOptions(ruleName, excludeRules, inputScript, [{
            "failure": "Forbidden http url in string: 'http://www.notallowed.com'",
            "name": "file.ts",
            "ruleName": ruleName,
            "startPosition": {
                "character": 9,
                "line": 1
            }
        }]);
    });
});
/* tslint:enable:no-http-string */