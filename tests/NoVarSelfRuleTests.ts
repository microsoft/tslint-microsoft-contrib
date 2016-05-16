/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noVarSelfRule', () : void => {

    var ruleName : string = 'no-var-self';

    it('should pass on other variables named self', () : void => {
        var script : string = `
            var self = other;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on other variables set to this', () : void => {
        var script : string = `
            var other = this;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on var self = this;', () : void => {
        var script : string = `
            var self = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "No var self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {
                    "character": 17,
                    "line": 2
                }
            }
         ]);
    });

    it('should fail on var self = this starting a chain', () : void => {
        var script : string = `
            var self = this,
                foo = bar;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "No var self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {
                    "character": 17,
                    "line": 2
                }
            }
        ]);
    });

    it('should fail on var self = this in a chain', () : void => {
        var script : string = `
            var foo = bar,
                self = this,
                baz = qux;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "No var self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {
                    "character": 17,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on var self = this ending a chain', () : void => {
        var script : string = `
            var foo = bar,
                self = this;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "No var self = this",
                "name": "file.ts",
                "ruleName": "no-var-self",
                "startPosition": {
                    "character": 17,
                    "line": 3
                }
            }
         ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
