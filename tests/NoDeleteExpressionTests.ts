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
                "failure": "Variables should not be deleted: variableForDeletion",
                "name": "test-data/NoDeleteExpressionTestInput.ts",
                "ruleName": "no-delete-expression",
                "startPosition": {
                    "line": 13,
                    "character": 8
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
