/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noDuplicateParameterNames', () : void => {

    var RULE_NAME : string = 'no-duplicate-parameter-names';

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoDuplicateParameterNamesTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": {
                    "character": 82,
                    "line": 27,
                    "position": 693
                },
                "failure": "Duplicate parameter name: 'duplicateConstructorParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "character": 53,
                    "line": 27,
                    "position": 664
                }
            },
            {
                "endPosition": {
                    "character": 68,
                    "line": 28,
                    "position": 824
                },
                "failure": "Duplicate parameter name: 'duplicateMethodParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "character": 44,
                    "line": 28,
                    "position": 800
                }
            },
            {
                "endPosition": {
                    "character": 94,
                    "line": 29,
                    "position": 990
                },
                "failure": "Duplicate parameter name: 'duplicateArrowFunctionParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "character": 63,
                    "line": 29,
                    "position": 959
                }
            },
            {
                "endPosition": {
                    "character": 93,
                    "line": 30,
                    "position": 1125
                },
                "failure": "Duplicate parameter name: 'duplicateFunctionExpParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "character": 64,
                    "line": 30,
                    "position": 1096
                }
            },
            {
                "endPosition": {
                    "character": 73,
                    "line": 37,
                    "position": 1397
                },
                "failure": "Duplicate parameter name: 'duplicateFunctionParameter'",
                "name": "test-data/NoDuplicateParameterNamesTestInput.ts",
                "ruleName": "no-duplicate-parameter-names",
                "startPosition": {
                    "character": 47,
                    "line": 37,
                    "position": 1371
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
