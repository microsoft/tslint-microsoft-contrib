/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');
import exportNameRule = require('../src/exportNameRule');

describe('exportNameRule', () : void => {

    var RULE_NAME : string = 'export-name';

    var exceptions : string[] = [];
    var original: any;

    beforeEach(() : void => {
        original = exportNameRule.Rule.getExceptions;
        exportNameRule.Rule.getExceptions = () : any => { return exceptions; };
    });

    afterEach(() : void => {
        exportNameRule.Rule.getExceptions = original;
    });

    it('should not produce violations for matching name', () : void => {
        exceptions.length = 0;
        var inputFile : string = 'test-data/ExportNameRulePassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations for conflicting name', () : void => {
        exceptions.length = 0;
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

    it('should not produce violations for conflicting name when suppressed', () : void => {
        exceptions.push('ThisIsNot.*NameOfTheFile');
        var inputFile : string = 'test-data/ExportNameRuleFailingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [ ]);
    });

});
/* tslint:enable:quotemark */
