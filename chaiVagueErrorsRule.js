"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker_1 = require('./utils/ErrorTolerantWalker');
var SyntaxKind_1 = require('./utils/SyntaxKind');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ChaiVagueErrorsRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Found chai call with vague failure message. Please add an explicit failure message';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ChaiVagueErrorsRuleWalker = (function (_super) {
    __extends(ChaiVagueErrorsRuleWalker, _super);
    function ChaiVagueErrorsRuleWalker() {
        _super.apply(this, arguments);
    }
    ChaiVagueErrorsRuleWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (this.isExpectInvocation(node)) {
            if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    ChaiVagueErrorsRuleWalker.prototype.visitCallExpression = function (node) {
        if (this.isExpectInvocation(node)) {
            if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression) {
                var propExpression = node.expression;
                if (/equal|equals|eql/.test(propExpression.name.getText())) {
                    if (node.arguments.length === 1) {
                        if (/true|false|null|undefined/.test(node.arguments[0].getText())) {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                        }
                    }
                }
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    ChaiVagueErrorsRuleWalker.prototype.isExpectInvocation = function (node) {
        var callExpression = ChaiVagueErrorsRuleWalker.getLeftMostCallExpression(node);
        if (callExpression == null) {
            return false;
        }
        return /.*\.?expect/.test(callExpression.expression.getText());
    };
    ChaiVagueErrorsRuleWalker.getLeftMostCallExpression = function (node) {
        var leftSide = node.expression;
        while (leftSide != null) {
            if (leftSide.kind === SyntaxKind_1.SyntaxKind.current().CallExpression) {
                return leftSide;
            }
            else if (leftSide.kind === (SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression)) {
                leftSide = leftSide.expression;
            }
            else {
                return null;
            }
        }
        return null;
    };
    return ChaiVagueErrorsRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=chaiVagueErrorsRule.js.map