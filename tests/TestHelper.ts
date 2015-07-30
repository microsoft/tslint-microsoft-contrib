/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import fs = require('fs');
import chai = require('chai');

module TestHelper {

    export interface FailurePosition {
        character: number;
        line: number;
        position: number;
    }
    export interface ExpectedFailure {
        ruleName: string;
        name: string;
        failure: string;
        endPosition: FailurePosition;
        startPosition: FailurePosition;
    }

    export function assertViolations(ruleName : string, inputFile : string, expectedFailures : ExpectedFailure[]) {

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

        var contents = fs.readFileSync(inputFile, 'utf8');

        var ll = new Lint.Linter(inputFile, contents, options);
        var result : Lint.LintResult = ll.lint();

        var actualFailures : ExpectedFailure[] = JSON.parse(result.output);

        var errorMessage = 'Wrong # of failures: \n' + JSON.stringify(actualFailures, null, 2);
        chai.assert.equal(expectedFailures.length, actualFailures.length, errorMessage);

        expectedFailures.forEach((expected : ExpectedFailure, index: number) : void => {
            var actual = actualFailures[index];
            chai.assert.deepEqual(actual, expected);
        });
    }
}

export = TestHelper;