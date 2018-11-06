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
var AstUtils_1 = require("./utils/AstUtils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-function-expression',
        type: 'maintainability',
        description: 'Do not use function expressions; use arrow functions (lambdas) instead.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.FAILURE_STRING = 'Use arrow function instead of function expression';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoFunctionExpressionRuleWalker = (function (_super) {
    __extends(NoFunctionExpressionRuleWalker, _super);
    function NoFunctionExpressionRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowGenericFunctionExpression = false;
        if (AstUtils_1.AstUtils.getLanguageVariant(sourceFile) === ts.LanguageVariant.JSX) {
            _this.allowGenericFunctionExpression = true;
        }
        return _this;
    }
    NoFunctionExpressionRuleWalker.prototype.visitFunctionExpression = function (node) {
        var walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach(function (child) {
            walker.walk(child);
        });
        var isGenericFunctionInTSX = this.allowGenericFunctionExpression && walker.isGenericFunction;
        if (!walker.isAccessingThis &&
            !node.asteriskToken &&
            !isGenericFunctionInTSX) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    return NoFunctionExpressionRuleWalker;
}(Lint.RuleWalker));
var SingleFunctionWalker = (function (_super) {
    __extends(SingleFunctionWalker, _super);
    function SingleFunctionWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isAccessingThis = false;
        _this.isGenericFunction = false;
        return _this;
    }
    SingleFunctionWalker.prototype.visitNode = function (node) {
        if (node.getText() === 'this') {
            this.isAccessingThis = true;
        }
        _super.prototype.visitNode.call(this, node);
    };
    SingleFunctionWalker.prototype.visitTypeReference = function (node) {
        this.isGenericFunction = true;
        _super.prototype.visitTypeReference.call(this, node);
    };
    SingleFunctionWalker.prototype.visitFunctionExpression = function () {
    };
    SingleFunctionWalker.prototype.visitArrowFunction = function () {
    };
    return SingleFunctionWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noFunctionExpressionRule.js.map