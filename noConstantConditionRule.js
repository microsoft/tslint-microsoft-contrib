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
        return this.applyWithWalker(new NoConstantConditionRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Found constant conditional: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoConstantConditionRuleWalker = (function (_super) {
    __extends(NoConstantConditionRuleWalker, _super);
    function NoConstantConditionRuleWalker() {
        _super.apply(this, arguments);
    }
    NoConstantConditionRuleWalker.prototype.isConstant = function (node) {
        if (node.kind === SyntaxKind_1.SyntaxKind.current().BinaryExpression) {
            var expression = node;
            var kind = expression.operatorToken.kind;
            if (kind >= SyntaxKind_1.SyntaxKind.current().FirstBinaryOperator && kind <= SyntaxKind_1.SyntaxKind.current().LastBinaryOperator) {
                return this.isConstant(expression.left) && this.isConstant(expression.right);
            }
        }
        if (node.kind === SyntaxKind_1.SyntaxKind.current().PrefixUnaryExpression || node.kind === SyntaxKind_1.SyntaxKind.current().PostfixUnaryExpression) {
            var expression = node;
            var kind = expression.operator;
            if (kind >= SyntaxKind_1.SyntaxKind.current().FirstBinaryOperator && kind <= SyntaxKind_1.SyntaxKind.current().LastBinaryOperator) {
                return this.isConstant(expression.operand);
            }
        }
        return node.kind === SyntaxKind_1.SyntaxKind.current().FalseKeyword
            || node.kind === SyntaxKind_1.SyntaxKind.current().TrueKeyword
            || node.kind === SyntaxKind_1.SyntaxKind.current().NumericLiteral;
    };
    NoConstantConditionRuleWalker.prototype.visitIfStatement = function (node) {
        if (this.isConstant(node.expression)) {
            var message = Rule.FAILURE_STRING + 'if (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        _super.prototype.visitIfStatement.call(this, node);
    };
    NoConstantConditionRuleWalker.prototype.visitConditionalExpression = function (node) {
        if (this.isConstant(node.condition)) {
            var message = Rule.FAILURE_STRING + node.condition.getText() + ' ?';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        _super.prototype.visitConditionalExpression.call(this, node);
    };
    NoConstantConditionRuleWalker.prototype.visitWhileStatement = function (node) {
        if (this.isConstant(node.expression)) {
            var message = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        _super.prototype.visitWhileStatement.call(this, node);
    };
    NoConstantConditionRuleWalker.prototype.visitDoStatement = function (node) {
        if (this.isConstant(node.expression)) {
            var message = Rule.FAILURE_STRING + 'while (' + node.expression.getText() + ')';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
        _super.prototype.visitDoStatement.call(this, node);
    };
    NoConstantConditionRuleWalker.prototype.visitForStatement = function (node) {
        if (node.condition != null) {
            if (this.isConstant(node.condition)) {
                var message = Rule.FAILURE_STRING + ';' + node.condition.getText() + ';';
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
            }
        }
        _super.prototype.visitForStatement.call(this, node);
    };
    return NoConstantConditionRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noConstantConditionRule.js.map