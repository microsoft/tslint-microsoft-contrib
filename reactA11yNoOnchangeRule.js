"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var JsxAttribute_1 = require("./utils/JsxAttribute");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yNoOnchangeRuleWalker(sourceFile, this.getOptions()))
            : [];
    };
    Rule.metadata = {
        ruleName: 'react-a11y-no-onchange',
        type: 'functionality',
        description: 'For accessibility of your website, enforce usage of onBlur over onChange on select menus.',
        options: 'string[]',
        optionsDescription: 'Additional tag names to validate.',
        optionExamples: ['true', '[true, ["Select"]]'],
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactA11yNoOnchangeRuleWalker = (function (_super) {
    __extends(ReactA11yNoOnchangeRuleWalker, _super);
    function ReactA11yNoOnchangeRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactA11yNoOnchangeRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.checkJsxOpeningElement(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    ReactA11yNoOnchangeRuleWalker.prototype.visitJsxElement = function (node) {
        this.checkJsxOpeningElement(node.openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    ReactA11yNoOnchangeRuleWalker.prototype.checkJsxOpeningElement = function (node) {
        var tagName = node.tagName.getText();
        var options = this.getOptions();
        var additionalTagNames = Array.isArray(options) && options.length > 0 ? options[0] : [];
        var targetTagNames = ['select'].concat(additionalTagNames);
        if (!tagName || targetTagNames.indexOf(tagName) === -1) {
            return;
        }
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
        if (attributes.hasOwnProperty('onchange')) {
            var errorMessage = "onChange event handler should not be used with the <" + tagName + ">. Please use onBlur instead.";
            this.addFailureAt(node.getStart(), node.getWidth(), errorMessage);
        }
    };
    return ReactA11yNoOnchangeRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=reactA11yNoOnchangeRule.js.map