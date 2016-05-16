/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noJqueryRawElementsRule', () : void => {

    const ruleName : string = 'no-jquery-raw-elements';

    it('should pass on any string literals', () : void => {
        const script : string = `
            $("div");
            $("<div>");
            $("<div/>");
            $("<div />");
            $("<input readonly >");
            $("<input readonly='true' >");
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on tag string concatenation', () : void => {
        const script : string = `
            $("<" + tagName + " />");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Replace HTML string manipulation with jQuery API: $(\"<\" + tagName + \" />\")",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 13, "line": 2 }
            }
         ]);
    });

    it('should fail on attribute string concatenation', () : void => {
        const script : string = `
            $("<div className='" + className + "' >");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Replace HTML string manipulation with jQuery API: $(\"<div className='\" + className + \"' >\")",
                "name": "file.ts",
                "ruleName": ruleName,
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on dynamic open tag', () : void => {
        const script : string = `
            $(someTagOpening + content + '>');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Replace HTML string manipulation with jQuery API: $(someTagOpening + content + '>')",
                "name": "file.ts",
                "ruleName": "no-jquery-raw-elements",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on dynamic close tag', () : void => {
        const script : string = `
            jquery('<' + tagName + closingBits);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Replace HTML string manipulation with jQuery API: jquery('<' + tagName + closingBits)",
                "name": "file.ts",
                "ruleName": "no-jquery-raw-elements",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
