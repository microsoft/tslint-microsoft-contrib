import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('noJqueryRawElementsRule', (): void => {
    const ruleName: string = 'no-jquery-raw-elements';

    it('should pass on string literals that is not a tag', (): void => {
        const script: string = `
            $("div");
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on simple opening tag (Issue #153)', (): void => {
        const script: string = `
            const x = {
                html: "<pre>" + $("<div>").text(message).html() + "</pre>"
            }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on simple open and close tags', (): void => {
        const script: string = `
            $("<div></div>");
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on any simple content inside tags', (): void => {
        const script: string = `
            $("<div>some simple content</div>");
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on any simple self closing tags', (): void => {
        const script: string = `
            $("<div/>");
            $("<div />");
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on tag with nested elements', (): void => {
        const script: string = `
            $("<div><br/></div>"); // nested elements are better expressed in JQuery API
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Replace complex HTML strings with jQuery API: $("<div><br/></div>")',
                name: Utils.absolutePath('file.ts'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on tag with attributes', (): void => {
        const script: string = `
            $("<input readonly='true' >"); // attributes are better expressed in JQuery API
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Replace complex HTML strings with jQuery API: $("<input readonly=\'true\' >")',
                name: Utils.absolutePath('file.ts'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on tag with default attributes', (): void => {
        const script: string = `
            $("<input readonly >"); // default attributes are better expressed in JQuery API
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Replace complex HTML strings with jQuery API: $("<input readonly >")',
                name: Utils.absolutePath('file.ts'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on tag string concatenation', (): void => {
        const script: string = `
            $("<" + tagName + " />");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Replace HTML string manipulation with jQuery API: $("<" + tagName + " />")',
                name: Utils.absolutePath('file.ts'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on attribute string concatenation', (): void => {
        const script: string = `
            $("<div className='" + className + "' >");
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Replace HTML string manipulation with jQuery API: $("<div className=\'" + className + "\' >")',
                name: Utils.absolutePath('file.ts'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on dynamic open tag', (): void => {
        const script: string = `
            $(someTagOpening + content + '>');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Replace HTML string manipulation with jQuery API: $(someTagOpening + content + '>')",
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-jquery-raw-elements',
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });

    it('should fail on dynamic close tag', (): void => {
        const script: string = `
            jquery('<' + tagName + closingBits);
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Replace HTML string manipulation with jQuery API: jquery('<' + tagName + closingBits)",
                name: Utils.absolutePath('file.ts'),
                ruleName: 'no-jquery-raw-elements',
                startPosition: { character: 13, line: 2 }
            }
        ]);
    });
});
