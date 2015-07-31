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
                    "endPosition": { "character": 43, "line": 3, "position": 95 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 31, "line": 3, "position": 83 }
                },
                {
                    "endPosition": { "character": 57, "line": 4, "position": 157 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 45, "line": 4, "position": 145 }
                },
                {
                    "endPosition": { "character": 45, "line": 6, "position": 208 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 33, "line": 6, "position": 196 }
                },
                {
                    "endPosition": { "character": 59, "line": 7, "position": 272 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 47, "line": 7, "position": 260 }
                },
                {
                    "endPosition": { "character": 49, "line": 9, "position": 327 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 37, "line": 9, "position": 315 }
                },
                {
                    "endPosition": { "character": 63, "line": 10, "position": 399 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 51, "line": 10, "position": 387 }
                },
                {
                    "endPosition": { "character": 67, "line": 12, "position": 476 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 55, "line": 12, "position": 464 }
                },
                {
                    "endPosition": { "character": 81, "line": 13, "position": 563 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 69, "line": 13, "position": 551 }
                },
                {
                    "endPosition": { "character": 46, "line": 18, "position": 676 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 34, "line": 18, "position": 664 }
                },
                {
                    "endPosition": { "character": 60, "line": 19, "position": 741 },
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "test-data/MissingOptionalAnnotationFailingTestInput.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "character": 48, "line": 19, "position": 729 }
                }
            ]
        );
    });
});
/* tslint:enable:quotemark */
