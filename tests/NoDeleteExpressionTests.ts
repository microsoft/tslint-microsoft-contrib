/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noDeleteExpressionRule', () : void => {

    var RULE_NAME : string = 'no-delete-expression';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoDeleteExpressionTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 26,
                    "line": 12,
                    "position": 233
                },
                "failure": "Variables should not be deleted: variableForDeletion",
                "name": "test-data/NoDeleteExpressionTestInput.ts",
                "ruleName": "no-delete-expression",
                "startPosition": {
                    "character": 7,
                    "line": 12,
                    "position": 214
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
