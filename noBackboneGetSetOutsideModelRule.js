var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SyntaxKind = require('./utils/SyntaxKind');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var AstUtils = require('./utils/AstUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoBackboneGetSetOutsideModelRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.GET_FAILURE_STRING = 'Backbone get() called outside of owning model: ';
    Rule.SET_FAILURE_STRING = 'Backbone set() called outside of owning model: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoBackboneGetSetOutsideModelRuleWalker = (function (_super) {
    __extends(NoBackboneGetSetOutsideModelRuleWalker, _super);
    function NoBackboneGetSetOutsideModelRuleWalker() {
        _super.apply(this, arguments);
    }
    NoBackboneGetSetOutsideModelRuleWalker.prototype.visitCallExpression = function (node) {
        if (AstUtils.getFunctionTarget(node) !== 'this') {
            var functionName = AstUtils.getFunctionName(node);
            if (functionName === 'get' && node.arguments.length === 1 && node.arguments[0].kind === SyntaxKind.current().StringLiteral) {
                var msg = Rule.GET_FAILURE_STRING + node.getText();
                this.addFailure(this.createFailure(node.getStart(), node.getEnd(), msg));
            }
            if (functionName === 'set' && node.arguments.length === 2 && node.arguments[0].kind === SyntaxKind.current().StringLiteral) {
                var msg = Rule.SET_FAILURE_STRING + node.getText();
                this.addFailure(this.createFailure(node.getStart(), node.getEnd(), msg));
            }
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoBackboneGetSetOutsideModelRuleWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noBackboneGetSetOutsideModelRule.js.map