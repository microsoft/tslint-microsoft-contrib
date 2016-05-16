/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noJqueryRawElementsRule', () : void => {

    var ruleName : string = 'no-jquery-raw-elements';

    it('should pass on a simple name', () : void => {
        var script : string = `
            $("div");
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on a bracket-wrapped name', () : void => {
        var script : string = `
            $("<div>");
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on a bracket-wrapped closed name', () : void => {
        var script : string = `
            $("<div/>");
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on a bracket-wrapped space-closed name', () : void => {
        var script : string = `
            $("<div />");
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on a default attribute', () : void => {
        var script : string = `
            $("<input readonly >");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "HTML string manipulation is a security risk; use jQuery instead",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 13, "line": 2 }
            }
         ]);
    });

    it('should fail on a set attribute', () : void => {
        var script : string = `
            $("<input readonly='true' >");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "HTML string manipulation is a security risk; use jQuery instead",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 13, "line": 2 }
            }
         ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
