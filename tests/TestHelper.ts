/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import fs = require('fs');
import chai = require('chai');

/**
 * Test Utilities.
 */
module TestHelper {

    export interface FailurePosition {
        character: number;
        line: number;
        position?: number;
    }
    export interface ExpectedFailure {
        ruleName: string;
        name: string;
        failure: string;
        endPosition?: FailurePosition;
        startPosition: FailurePosition;
    }
    export function assertNoViolation(ruleName : string, inputFileOrScript : string) {
        TestHelper.assertViolations(ruleName, inputFileOrScript, []);
    }
    export function assertViolations(ruleName : string, inputFileOrScript : string, expectedFailures : ExpectedFailure[]) {

        var configuration = {
            rules: {}
        };
        configuration.rules[ruleName] = true;

        var options : Lint.ILinterOptions = {
            formatter: 'json',
            configuration: configuration,
            rulesDirectory: 'dist/src/',
            formattersDirectory: 'customFormatters/'
        };

        var linter : Lint.Linter;
        if (inputFileOrScript.match(/.*\.ts/)) {
            var contents = fs.readFileSync(inputFileOrScript, 'utf8');
            linter = new Lint.Linter(inputFileOrScript, contents, options);
        } else {
            linter = new Lint.Linter('file.ts', inputFileOrScript, options);
        }

        var result : Lint.LintResult = linter.lint();

        var actualFailures: ExpectedFailure[] = JSON.parse(result.output);

        // All the information we need is line and character of start position. For JSON comparison
        // to work, we will delete the information that we are not interested in from both actual and
        // expected failures.
        actualFailures.forEach((actual: ExpectedFailure): void => {
            delete actual.startPosition.position;
            delete actual.endPosition;
            // Editors start counting lines and characters from 1, but tslint does it from 0.
            // To make thing easier to debug, aling to editor values.
            actual.startPosition.line = actual.startPosition.line + 1;
            actual.startPosition.character = actual.startPosition.character + 1;
        });
        expectedFailures.forEach((expected: ExpectedFailure): void => {
            delete expected.startPosition.position;
            delete expected.endPosition;
        });

        var errorMessage = 'Wrong # of failures: \n' + JSON.stringify(actualFailures, null, 2);
        chai.assert.equal(expectedFailures.length, actualFailures.length, errorMessage);

        expectedFailures.forEach((expected : ExpectedFailure, index: number) : void => {
            var actual = actualFailures[index];
            chai.assert.deepEqual(actual, expected);
        });
    }
}

export = TestHelper;
