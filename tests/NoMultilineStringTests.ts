 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noMultilineStringRule', () : void => {
    const RULE_NAME : string = 'no-multiline-string';

    it('should produce violations ', () : void => {
        const inputFile : string = `

var x = \`some
        multiline
        string\`;`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden Multiline string: `some...",
                "name": "file.ts",
                "ruleName": "no-multiline-string",
                "startPosition": {
                    "line": 3,
                    "character": 9
                }
            }
        ]);
    });

});