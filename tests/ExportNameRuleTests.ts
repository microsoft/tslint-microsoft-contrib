/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('exportNameRule', () : void => {

    var RULE_NAME : string = 'export-name';

    it('should not produce violations for matching name', () : void => {
        var inputFile : string = 'test-data/ExportNameRulePassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations for conflicting name', () : void => {
        var inputFile : string = 'test-data/ExportNameRuleFailingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "The exported module name must match the file name. " +
                    "Found: test-data/ExportNameRuleFailingTestInput.ts and ThisIsNotTheNameOfTheFile",
                "name": "test-data/ExportNameRuleFailingTestInput.ts",
                "ruleName": "export-name",
                "startPosition": { "character": 10, "line": 4 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
