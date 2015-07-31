/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noWithStatementsRule', () : void => {

    it('should produce violations', () : void => {
        var ruleName : string = 'no-with-statement';
        var inputFile : string = 'test-data/NoWithStatementTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Forbidden with statement",
                    "name": "test-data/NoWithStatementTestInput.ts",
                    "ruleName": "no-with-statement",
                    "endPosition": { "character": 1, "line": 5, "position": 37 },
                    "startPosition": { "character": 0, "line": 2, "position": 2 }
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
