/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noInnerHtmlRule', () : void => {
    const ruleName : string = 'no-inner-html';

    it('should pass on reading innerHTML strings', () : void => {
        const script : string = `
            var foo = element.innerHTML;
            var bar = element.outerHTML;
            var baz = $(element).html();
            var quxFunction = $(element).html;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on writing to innerHTML', () : void => {
        const script : string = `
            element.innerHTML = '<div></div>';
            parent.child.innerHTML = '<div></div>';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Writing a string to the innerHTML property is insecure: element.innerHTML = '<div></div>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Writing a string to the innerHTML property is insecure: parent.child.innerHTML = '<div></div>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on writing to outerHTML', () : void => {
        const script : string = `
            element.outerHTML = '<div></div>';
            parent.child.outerHTML = someVariable;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Writing a string to the outerHTML property is insecure: element.outerHTML = '<div></div>'",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Writing a string to the outerHTML property is insecure: parent.child.outerHTML = someVariable",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on invoking html(x)', () : void => {
        const script : string = `
            $(element).html('whatever');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Using the html() function to write a string to innerHTML is insecure: $(element).html('whatever')",
                "name": "file.ts",
                "ruleName": "no-inner-html",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
