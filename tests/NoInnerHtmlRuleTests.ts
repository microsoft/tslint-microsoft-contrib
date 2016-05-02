/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noInnerHtmlRule', () : void => {

    var ruleName : string = 'no-inner-html';

    it('should pass on reading innerHTML strings', () : void => {
        var script : string = `
            var foo = element.innerHTML;
            var bar = element.outputHTML;
            var baz = $(element).html();
            var quxFunction = $(element).html;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on writing to innerHTML', () : void => {
        var script : string = `
            element.innerHTML = '<div/>';
            parent.child.innerHTML = '<div/>';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Writing a string to the innerHTML property is insecure: element.innerHTML = '<div/>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Writing a string to the innerHTML property is insecure: parent.child.innerHTML = '<div/>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on writing to outerHTML', () : void => {
        var script : string = `
            element.outerHTML = '<div/>';
            parent.child.outerHTML = '<div/>';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Writing a string to the outerHTML property is insecure: element.outerHTML = '<div/>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Writing a string to the outerHTML property is insecure: parent.child.outerHTML = '<div/>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on invoking html(x)', () : void => {
        var script : string = `
            $(element).html('<div/>');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Using the html() function to write a string to innerHTML is insecure: $(element).html('<div/>')",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
