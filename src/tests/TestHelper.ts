import * as Lint from 'tslint/lib/lint';
import * as fs from 'fs';
import * as chai from 'chai';
import {ErrorTolerantWalker} from '../utils/ErrorTolerantWalker';

/**
 * Test Utilities.
 */
export module TestHelper {

    /**
     * This setting must point to your rule .js files.
     */
    export const RULES_DIRECTORY: string = 'dist/src/';

    /**
     * This setting must point to your formatter .js files.
     */
    export const FORMATTER_DIRECTORY: string = 'customFormatters/';

    /**
     * You must specify an encoding for file read/writes
     */
    export const FILE_ENCODING: string = 'utf8';

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
    interface RuleConfiguration {
        rules: {
            [key: string]: boolean | any[];
        };
    }

    export function assertNoViolation(ruleName: string,
                                      inputFileOrScript: string) {
        runRuleAndEnforceAssertions(ruleName, null, inputFileOrScript, []);
    }
    export function assertNoViolationWithOptions(ruleName: string,
                                                 options: any[],
                                                 inputFileOrScript: string) {
        runRuleAndEnforceAssertions(ruleName, options, inputFileOrScript, []);
    }
    export function assertViolationsWithOptions(ruleName: string,
                                                options: any[],
                                                inputFileOrScript: string,
                                                expectedFailures: ExpectedFailure[]) {
        runRuleAndEnforceAssertions(ruleName, options, inputFileOrScript, expectedFailures);
    }
    export function assertViolations(ruleName: string,
                                     inputFileOrScript: string,
                                     expectedFailures: ExpectedFailure[]) {
        runRuleAndEnforceAssertions(ruleName, null, inputFileOrScript, expectedFailures);
    }

    export function runRule(ruleName : string, userOptions: string[], inputFileOrScript : string): Lint.LintResult {
        const configuration: RuleConfiguration = {
            rules: {}
        };
        if (userOptions != null && userOptions.length > 0) {
            //options like `[4, 'something', false]` were passed, so prepend `true` to make the array like `[true, 4, 'something', false]`
            configuration.rules[ruleName] = (<any[]>[true]).concat(userOptions);
        } else {
            configuration.rules[ruleName] = true;
        }

        const options : Lint.ILinterOptions = {
            formatter: 'json',
            configuration: configuration,
            rulesDirectory: RULES_DIRECTORY,
            formattersDirectory: FORMATTER_DIRECTORY
        };

        const debug: boolean = ErrorTolerantWalker.DEBUG;
        ErrorTolerantWalker.DEBUG = true; // never fail silently
        let result: Lint.LintResult;
        if (inputFileOrScript.match(/.*\.ts(x)?$/)) {
            const contents = fs.readFileSync(inputFileOrScript, FILE_ENCODING);
            const linter = new Lint.Linter(inputFileOrScript, contents, options);
            result = linter.lint();
        } else {
            let filename: string;
            if (inputFileOrScript.indexOf('import React') > -1) {
                filename = 'file.tsx';
            } else {
                filename = 'file.ts';
            }
            const linter = new Lint.Linter(filename, inputFileOrScript, options);
            result = linter.lint();
        }
        ErrorTolerantWalker.DEBUG = debug;
        return result;
    }

    function runRuleAndEnforceAssertions(ruleName : string, userOptions: string[], inputFileOrScript : string,
                                         expectedFailures : ExpectedFailure[]) {

        const lintResult: Lint.LintResult = runRule(ruleName, userOptions, inputFileOrScript);
        const actualFailures: ExpectedFailure[] = JSON.parse(lintResult.output);

        // All the information we need is line and character of start position. For JSON comparison
        // to work, we will delete the information that we are not interested in from both actual and
        // expected failures.
        actualFailures.forEach((actual: ExpectedFailure): void => {
            delete actual.startPosition.position;
            delete actual.endPosition;
            // Editors start counting lines and characters from 1, but tslint does it from 0.
            // To make thing easier to debug, align to editor values.
            actual.startPosition.line = actual.startPosition.line + 1;
            actual.startPosition.character = actual.startPosition.character + 1;
        });
        expectedFailures.forEach((expected: ExpectedFailure): void => {
            delete expected.startPosition.position;
            delete expected.endPosition;
        });

        const errorMessage = `Wrong # of failures: \n${JSON.stringify(actualFailures, null, 2)}`;
        chai.assert.equal(actualFailures.length, expectedFailures.length, errorMessage);

        expectedFailures.forEach((expected: ExpectedFailure, index: number): void => {
            const actual = actualFailures[index];
            chai.assert.deepEqual(actual, expected);
        });
    }
}
