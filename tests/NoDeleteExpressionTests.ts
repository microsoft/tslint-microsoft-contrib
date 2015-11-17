/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noDeleteExpressionRule', (): void => {

    var RULE_NAME: string = 'no-delete-expression';

    it('should not produce violations', (): void => {
        const inputFile: string = 'test-data/NoDeleteExpressionPassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, null, inputFile, []);
    });

    it('should produce violations ', (): void => {
        const inputFile: string = 'test-data/NoDeleteExpressionFailingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, null, inputFile, [
            {
                "failure": "Variables should not be deleted: variableForDeletion",
                "name": "test-data/NoDeleteExpressionFailingTestInput.ts",
                "ruleName": "no-delete-expression",
                "startPosition": {
                    "line": 5,
                    "character": 12
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
