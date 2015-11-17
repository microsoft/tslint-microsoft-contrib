/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noUnusedImportsRule', () : void => {

    it('should detect an unused import', () : void => {
        var ruleName : string = 'no-unused-imports';
        var inputFile : string = 'test-data/NoUnusedImportsTestInput.ts';
        TestHelper.assertViolations(
            ruleName, null, inputFile,
            [
                {
                    "failure": "unused import: 'NoUnusedImportsRule'",
                    "name": "test-data/NoUnusedImportsTestInput.ts",
                    "ruleName": "no-unused-imports",
                    "startPosition": { "line": 3, "character": 8 }
                }
            ]
        );
    });

    it('should flag an unused relative import', () : void => {
        var ruleName : string = 'no-unused-imports';
        var inputScript : string = `
import DM = require("DM");
import AB = DM.Dependency;
console.log(DM);`; // AB import is not used!

        TestHelper.assertViolations(ruleName, null, inputScript, [
            {
                "failure": "unused import: 'AB'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 3, "character": 8 }
            }
        ]);
    });

    it('should not flag imports that are used as other imports', () : void => {
        var ruleName : string = 'no-unused-imports';
        var inputScript : string = `
import DM = require("DM");
import AB = DM.Dependency;
console.log(AB);`;

        TestHelper.assertViolations(ruleName, null, inputScript, []);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
