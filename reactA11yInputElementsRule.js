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
exports.MISSING_PLACEHOLDER_INPUT_FAILURE_STRING = 'Input elements must include default, place-holding characters if empty';
exports.MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING = 'Textarea elements must include default, place-holding characters if empty';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactA11yInputElementsRuleWalker(sourceFile, this.getOptions()));
        }
        else {
            return [];
        }
    };
    Rule.metadata = {
        ruleName: 'react-a11y-input-elements',
        type: 'functionality',
        description: 'For accessibility of your website, HTML input boxes and text areas must include default, place-holding characters.',
        options: undefined,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactA11yInputElementsRuleWalker = (function (_super) {
    __extends(ReactA11yInputElementsRuleWalker, _super);
    function ReactA11yInputElementsRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactA11yInputElementsRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        var tagName = node.tagName.getText();
        if (tagName === 'input') {
            var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
            if (JsxAttribute_1.isEmpty(attributes.value) && JsxAttribute_1.isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), exports.MISSING_PLACEHOLDER_INPUT_FAILURE_STRING);
            }
        }
        else if (tagName === 'textarea') {
            var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
            if (JsxAttribute_1.isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), exports.MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
            }
        }
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    ReactA11yInputElementsRuleWalker.prototype.visitJsxElement = function (node) {
        var tagName = node.openingElement.tagName.getText();
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
        if (tagName === 'textarea') {
            if (node.children.length === 0 && JsxAttribute_1.isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), exports.MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
            }
        }
        _super.prototype.visitJsxElement.call(this, node);
    };
    return ReactA11yInputElementsRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=reactA11yInputElementsRule.js.map