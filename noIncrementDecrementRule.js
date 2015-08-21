var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoIncrementDecrementWalker(sourceFile, this.getOptions()));
    };
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoIncrementDecrementWalker = (function (_super) {
    __extends(NoIncrementDecrementWalker, _super);
    function NoIncrementDecrementWalker() {
        _super.apply(this, arguments);
    }
    NoIncrementDecrementWalker.prototype.visitPostfixUnaryExpression = function (node) {
        this.validateUnaryExpression(node);
        _super.prototype.visitPostfixUnaryExpression.call(this, node);
    };
    NoIncrementDecrementWalker.prototype.visitPrefixUnaryExpression = function (node) {
        this.validateUnaryExpression(node);
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
    };
    NoIncrementDecrementWalker.prototype.validateUnaryExpression = function (node) {
        if (node.operator === 38) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden ++ operator'));
        }
        else if (node.operator === 39) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden -- operator'));
        }
    };
    return NoIncrementDecrementWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noIncrementDecrementRule.js.map