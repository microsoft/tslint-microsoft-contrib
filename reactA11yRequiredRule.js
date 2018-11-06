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
var FAILURE_STRING = 'Required input elements must have an aria-required set to true';
var REQUIRED_STRING = 'required';
var ARIA_REQUIRED_STRING = 'aria-required';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yRequiredRuleWalker(sourceFile, this.getOptions()))
            : [];
    };
    Rule.metadata = {
        ruleName: 'react-a11y-required',
        type: 'functionality',
        description: 'Enforce that required input elements must have aria-required set to true',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactA11yRequiredRuleWalker = (function (_super) {
    __extends(ReactA11yRequiredRuleWalker, _super);
    function ReactA11yRequiredRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactA11yRequiredRuleWalker.prototype.visitJsxElement = function (node) {
        this.validateOpeningElement(node.openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    ReactA11yRequiredRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.validateOpeningElement(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    ReactA11yRequiredRuleWalker.prototype.validateOpeningElement = function (node) {
        var tagName = node.tagName.getText();
        if (tagName !== 'input') {
            return;
        }
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
        var requiredAttribute = attributes[REQUIRED_STRING];
        if (!requiredAttribute) {
            return;
        }
        var ariaRequiredAttribute = attributes[ARIA_REQUIRED_STRING];
        if (!ariaRequiredAttribute || JsxAttribute_1.isEmpty(ariaRequiredAttribute) || !JsxAttribute_1.getBooleanLiteral(ariaRequiredAttribute)) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
        }
    };
    return ReactA11yRequiredRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=reactA11yRequiredRule.js.map