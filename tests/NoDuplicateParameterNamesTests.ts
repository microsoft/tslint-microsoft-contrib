/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noDuplicateParameterNames', () : void => {
    let RULE_NAME : string = 'no-duplicate-parameter-names';

    it('should produce violations ', () : void => {
        let inputFile : string = 'test-data/NoDuplicateParameterNamesTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Duplicate parameter name: 'duplicateConstructorParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "line": 28,
                    "character": 54
                }
            },
            {
                "failure": "Duplicate parameter name: 'duplicateMethodParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "line": 29,
                    "character": 45
                }
            },
            {
                "failure": "Duplicate parameter name: 'duplicateArrowFunctionParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "line": 30,
                    "character": 64
                }
            },
            {
                "failure": "Duplicate parameter name: 'duplicateFunctionExpParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "line": 31,
                    "character": 65
                }
            },
            {
                "failure": "Duplicate parameter name: 'duplicateFunctionParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "line": 38,
                    "character": 48
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
