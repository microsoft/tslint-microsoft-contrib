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
            [ { "failure": "unused import: 'NoUnusedImportsRule'",
                "name": "test-data/NoUnusedImportsTestInput.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "character": 7, "line": 2, "position": 40 },
                "endPosition": { "character": 26, "line": 2, "position": 59 } } ]
        );
    });

});
/* tslint:enable:quotemark */
