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
        return this.applyWithWalker(new MochaAvoidOnlyRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_IT = 'Do not commit Mocha it.only function call';
    Rule.FAILURE_STRING_DESCRIBE = 'Do not commit Mocha describe.only function call';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MochaAvoidOnlyRuleWalker = (function (_super) {
    __extends(MochaAvoidOnlyRuleWalker, _super);
    function MochaAvoidOnlyRuleWalker() {
        _super.apply(this, arguments);
    }
    MochaAvoidOnlyRuleWalker.prototype.visitCallExpression = function (node) {
        if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression) {
            if (node.arguments.length === 2) {
                if (node.arguments[0].kind === SyntaxKind_1.SyntaxKind.current().StringLiteral) {
                    if (node.arguments[1].kind === SyntaxKind_1.SyntaxKind.current().FunctionExpression
                        || node.arguments[1].kind === SyntaxKind_1.SyntaxKind.current().ArrowFunction) {
                        if (node.expression.getText() === 'it.only') {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_IT));
                        }
                        else if (node.expression.getText() === 'describe.only') {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_DESCRIBE));
                        }
                    }
                }
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return MochaAvoidOnlyRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=mochaAvoidOnlyRule.js.map