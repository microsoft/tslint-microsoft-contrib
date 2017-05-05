"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var fs = require("fs");
var chai = require("chai");
var ts = require("typescript");
var ErrorTolerantWalker_1 = require("../utils/ErrorTolerantWalker");
var TestHelper;
(function (TestHelper) {
    var program;
    TestHelper.RULES_DIRECTORY = 'dist/src/';
    TestHelper.FORMATTER_DIRECTORY = 'customFormatters/';
    TestHelper.FILE_ENCODING = 'utf8';
    function assertNoViolation(ruleName, inputFileOrScript, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        runRuleAndEnforceAssertions(ruleName, null, inputFileOrScript, [], useTypeChecker);
    }
    TestHelper.assertNoViolation = assertNoViolation;
    function assertNoViolationWithOptions(ruleName, options, inputFileOrScript, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        runRuleAndEnforceAssertions(ruleName, options, inputFileOrScript, [], useTypeChecker);
    }
    TestHelper.assertNoViolationWithOptions = assertNoViolationWithOptions;
    function assertViolationsWithOptions(ruleName, options, inputFileOrScript, expectedFailures, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        runRuleAndEnforceAssertions(ruleName, options, inputFileOrScript, expectedFailures, useTypeChecker);
    }
    TestHelper.assertViolationsWithOptions = assertViolationsWithOptions;
    function assertViolations(ruleName, inputFileOrScript, expectedFailures, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        runRuleAndEnforceAssertions(ruleName, null, inputFileOrScript, expectedFailures, useTypeChecker);
    }
    TestHelper.assertViolations = assertViolations;
    function assertViolationsWithTypeChecker(ruleName, inputFileOrScript, expectedFailures) {
        runRuleAndEnforceAssertions(ruleName, null, inputFileOrScript, expectedFailures, true);
    }
    TestHelper.assertViolationsWithTypeChecker = assertViolationsWithTypeChecker;
    function runRule(ruleName, userOptions, inputFileOrScript, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        var configuration = {
            extends: [],
            jsRules: new Map(),
            linterOptions: {},
            rules: new Map(),
            rulesDirectory: []
        };
        if (userOptions != null && userOptions.length > 0) {
            configuration.rules.set(ruleName, {
                ruleName: ruleName,
                ruleArguments: userOptions
            });
        }
        else {
            configuration.rules.set(ruleName, {
                ruleName: ruleName
            });
        }
        var options = {
            formatter: 'json',
            fix: false,
            rulesDirectory: TestHelper.RULES_DIRECTORY,
            formattersDirectory: TestHelper.FORMATTER_DIRECTORY
        };
        var debug = ErrorTolerantWalker_1.ErrorTolerantWalker.DEBUG;
        ErrorTolerantWalker_1.ErrorTolerantWalker.DEBUG = true;
        var result;
        if (useTypeChecker) {
            program = ts.createProgram([inputFileOrScript], {});
        }
        if (inputFileOrScript.match(/.*\.ts(x)?$/)) {
            var contents = fs.readFileSync(inputFileOrScript, TestHelper.FILE_ENCODING);
            var linter = new Lint.Linter(options, useTypeChecker ? program : undefined);
            linter.lint(inputFileOrScript, contents, configuration);
            result = linter.getResult();
        }
        else {
            var filename = void 0;
            if (inputFileOrScript.indexOf('import React') > -1) {
                filename = 'file.tsx';
            }
            else {
                filename = 'file.ts';
            }
            var linter = new Lint.Linter(options, useTypeChecker ? program : undefined);
            linter.lint(filename, inputFileOrScript, configuration);
            result = linter.getResult();
        }
        ErrorTolerantWalker_1.ErrorTolerantWalker.DEBUG = debug;
        return result;
    }
    TestHelper.runRule = runRule;
    function runRuleAndEnforceAssertions(ruleName, userOptions, inputFileOrScript, expectedFailures, useTypeChecker) {
        if (useTypeChecker === void 0) { useTypeChecker = false; }
        var lintResult = runRule(ruleName, userOptions, inputFileOrScript, useTypeChecker);
        var actualFailures = JSON.parse(lintResult.output);
        actualFailures.forEach(function (actual) {
            delete actual.startPosition.position;
            delete actual.endPosition;
            actual.startPosition.line = actual.startPosition.line + 1;
            actual.startPosition.character = actual.startPosition.character + 1;
        });
        expectedFailures.forEach(function (expected) {
            delete expected.startPosition.position;
            delete expected.endPosition;
            if (!expected.ruleSeverity) {
                expected.ruleSeverity = 'ERROR';
            }
        });
        var errorMessage = "Wrong # of failures: \n" + JSON.stringify(actualFailures, null, 2);
        chai.assert.equal(actualFailures.length, expectedFailures.length, errorMessage);
        expectedFailures.forEach(function (expected, index) {
            var actual = actualFailures[index];
            chai.assert.deepEqual(actual, expected);
        });
    }
})(TestHelper = exports.TestHelper || (exports.TestHelper = {}));
//# sourceMappingURL=TestHelper.js.map