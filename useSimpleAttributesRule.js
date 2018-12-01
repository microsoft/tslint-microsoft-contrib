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
            ? this.applyWithWalker(new UseSimpleAttributesRuleWalker(sourceFile, this.getOptions()))
            : [];
    };
    Rule.metadata = {
        ruleName: 'use-simple-attributes',
        type: 'functionality',
        description: 'Enforce usage of only simple attribute types.',
        rationale: 'Simpler attributes in JSX and TSX files helps keep code clean and readable.\
            Separate complex expressions into their own line and use clear variable names to make your code more understandable.',
        options: null,
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var UseSimpleAttributesRuleWalker = (function (_super) {
    __extends(UseSimpleAttributesRuleWalker, _super);
    function UseSimpleAttributesRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UseSimpleAttributesRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.checkJsxOpeningElement(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    UseSimpleAttributesRuleWalker.prototype.visitJsxElement = function (node) {
        this.checkJsxOpeningElement(node.openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    UseSimpleAttributesRuleWalker.prototype.checkJsxOpeningElement = function (node) {
        var attributes = JsxAttribute_1.getJsxAttributesFromJsxElement(node);
        for (var _i = 0, _a = Object.keys(attributes); _i < _a.length; _i++) {
            var key = _a[_i];
            var attribute = attributes[key];
            var binaryExpression = this.getNextNodeRecursive(attribute, ts.SyntaxKind.BinaryExpression);
            if (binaryExpression && !this.isSimpleBinaryExpression(binaryExpression)) {
                var binaryExpressionErrorMessage = 'Attribute contains a complex binary expression';
                this.addFailureAt(node.getStart(), node.getWidth(), binaryExpressionErrorMessage);
            }
            var ternaryExpression = this.getNextNodeRecursive(attribute, ts.SyntaxKind.ConditionalExpression);
            if (ternaryExpression) {
                var ternaryExpressionErrorMessage = 'Attribute contains a ternary expression';
                this.addFailureAt(node.getStart(), node.getWidth(), ternaryExpressionErrorMessage);
            }
        }
    };
    UseSimpleAttributesRuleWalker.prototype.isSimpleBinaryExpression = function (binaryExpression) {
        if (binaryExpression.kind !== ts.SyntaxKind.BinaryExpression) {
            return false;
        }
        var allowedBinaryNodes = [
            ts.SyntaxKind.NumericLiteral,
            ts.SyntaxKind.StringLiteral,
            ts.SyntaxKind.TrueKeyword,
            ts.SyntaxKind.FalseKeyword,
            ts.SyntaxKind.Identifier
        ];
        var leftTerm = allowedBinaryNodes.find(function (kind) { return kind === binaryExpression.left.kind; });
        var rightTerm = allowedBinaryNodes.find(function (kind) { return kind === binaryExpression.right.kind; });
        return leftTerm ? (rightTerm ? true : false) : false;
    };
    UseSimpleAttributesRuleWalker.prototype.getNextNodeRecursive = function (node, kind) {
        if (!node) {
            return undefined;
        }
        var childNodes = node.getChildren();
        var match = childNodes.find(function (cn) { return cn.kind === kind; });
        if (!match) {
            for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
                var childNode = childNodes_1[_i];
                match = this.getNextNodeRecursive(childNode, kind);
            }
        }
        return match;
    };
    return UseSimpleAttributesRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=useSimpleAttributesRule.js.map