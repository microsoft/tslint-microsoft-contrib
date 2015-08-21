/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noUnusedImportsRule', () : void => {

    it('should detect an unused import', () : void => {
        var ruleName : string = 'no-unused-imports';
        var inputFile : string = 'test-data/NoUnusedImportsTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "unused import: 'NoUnusedImportsRule'",
                    "name": "test-data/NoUnusedImportsTestInput.ts",
                    "ruleName": "no-unused-imports",
                    "startPosition": { "line": 3, "character": 8 }
                }
            ]
        );
    });

});
/* tslint:enable:quotemark */
