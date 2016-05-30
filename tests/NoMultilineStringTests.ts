 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noMultilineStringRule', () : void => {
    let RULE_NAME : string = 'no-multiline-string';

    it('should produce violations ', () : void => {
        let inputFile : string = 'test-data/NoMultilineStringTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden Multiline string:  `some...",
                "name": "test-data/NoMultilineStringTestInput.ts",
                "ruleName": "no-multiline-string",
                "startPosition": {
                    "line": 3,
                    "character": 9
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
