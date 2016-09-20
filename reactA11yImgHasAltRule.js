"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var Lint = require('tslint/lib/lint');
var JsxAttribute_1 = require('./utils/JsxAttribute');
var TypeGuard_1 = require('./utils/TypeGuard');
var roleString = 'role';
var altString = 'alt';
function getFailureStringNoAlt(tagName) {
    return "<" + tagName + "> elements must have an alt attribute or use role='presentation' for presentational images. A reference for the presentation role can be found at https://www.w3.org/TR/wai-aria/roles#presentation.";
}
exports.getFailureStringNoAlt = getFailureStringNoAlt;
function getFailureStringEmptyAlt(tagName) {
    return "The value of 'alt' attribute in <" + tagName + "> tag is undefined or empty. Add more details in 'alt' attribute or use role='presentation' for presentational images. A reference for the presentation role can be found at https://www.w3.org/TR/wai-aria/roles#presentation.";
}
exports.getFailureStringEmptyAlt = getFailureStringEmptyAlt;
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ImgHasAltWalker(sourceFile, this.getOptions()))
            : [];
    };
    Rule.metadata = {
        ruleName: 'react-a11y-img-has-alt',
        type: 'maintainability',
        description: 'Enforce that an `img` element contains the `alt` attribute or `role="presentation"` for decorative image.',
        options: 'string[]',
        optionExamples: ['true', '[true, ["Image"]]'],
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ImgHasAltWalker = (function (_super) {
    __extends(ImgHasAltWalker, _super);
    function ImgHasAltWalker() {
        _super.apply(this, arguments);
    }
    ImgHasAltWalker.prototype.visitJsxSelfClosingElement = function (node) {
        var tagName = node.tagName && node.tagName.getText();
        var options = this.getOptions();
        var additionalTagNames = options.length > 1 ? options[1] : [];
        var targetTagNames = ['img'].concat(additionalTagNames);
        if (!tagName || targetTagNames.indexOf(tagName) === -1) {
            return;
        }
        if (JsxAttribute_1.getAllAttributesFromJsxElement(node).some(TypeGuard_1.isJsxSpreadAttribute)) {
            return;
        }
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
        var role = attributes[roleString];
        var roleValue = role && JsxAttribute_1.getStringLiteral(role);
        if (roleValue && roleValue.match(/\bpresentation\b/)) {
            return;
        }
        var altProp = attributes[altString];
        if (!altProp) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), getFailureStringNoAlt(tagName)));
        }
        else if (JsxAttribute_1.isEmpty(altProp) || JsxAttribute_1.getStringLiteral(altProp) === '') {
            this.addFailure(this.createFailure(altProp.getStart(), altProp.getWidth(), getFailureStringEmptyAlt(tagName)));
        }
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    return ImgHasAltWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=reactA11yImgHasAltRule.js.map