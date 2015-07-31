 /// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noMultilineStringRule', () : void => {

    var RULE_NAME : string = 'no-multiline-string';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoMultilineStringTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 7,
                    "line": 4,
                    "position": 33
                },
                "failure": "Forbidden Multiline string:  `some...",
                "name": "test-data/NoMultilineStringTestInput.ts",
                "ruleName": "no-multiline-string",
                "startPosition": {
                    "character": 8,
                    "line": 2,
                    "position": 10
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
