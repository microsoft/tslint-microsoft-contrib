/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('missingOptionalAnnotationRule', () : void => {

    it('should not produce violations', () : void => {
        var ruleName : string = 'missing-optional-annotation';
        var inputFile : string = 'test-data/MissingOptionalAnnotationPassingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
            ]
        );
    });

    it('should produce violations', () : void => {
        var ruleName : string = 'missing-optional-annotation';
        var inputFile : string = 'test-data/MissingOptionalAnnotationFailingTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 4, "character": 32 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 5, "character": 46 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 7, "character": 34 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 8, "character": 48 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 10, "character": 38 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 11, "character": 52 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 13, "character": 56 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 14, "character": 70 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 19, "character": 35 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 20, "character": 49 }
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
