/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('noRegexSpacesRule', () : void => {

    var ruleName : string = 'no-regex-spaces';

    it('should pass on single space', () : void => {
        var script : string = `
            var re = /foo {3}bar/;
        `;

        TestHelper.assertViolations(ruleName, null, script, [ ]);
    });

    it('should pass on RegExp object', () : void => {
        var script : string = `
            var re = new RegExp("foo   bar");
        `;

        TestHelper.assertViolations(ruleName, null, script, [ ]);
    });

    it('should pass on no spaces', () : void => {
        var script : string = `
            var re = /foobar/;
        `;

        TestHelper.assertViolations(ruleName, null, script, [ ]);
    });

    it('should fail on spaces in middle', () : void => {
        var script : string = `
            var re = /foo   bar/;
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Spaces in regular expressions are hard to count. Use {3}",
                "name": "file.ts",
                "ruleName": "no-regex-spaces",
                "startPosition": { "character": 22, "line": 2 }
            }
        ]);
    });

    it('should fail on leading spaces', () : void => {
        var script : string = `
            var re = /  bar/;
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Spaces in regular expressions are hard to count. Use {2}",
                "name": "file.ts",
                "ruleName": "no-regex-spaces",
                "startPosition": { "character": 22, "line": 2 }
            }
        ]);
    });

    it('should fail on trailing spaces', () : void => {
        var script : string = `
            var re = /bar    /;
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Spaces in regular expressions are hard to count. Use {4}",
                "name": "file.ts",
                "ruleName": "no-regex-spaces",
                "startPosition": { "character": 22, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
