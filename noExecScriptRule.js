var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var AstUtils = require('./utils/AstUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoEvalScriptWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'forbidden execScript: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoEvalScriptWalker = (function (_super) {
    __extends(NoEvalScriptWalker, _super);
    function NoEvalScriptWalker() {
        _super.apply(this, arguments);
    }
    NoEvalScriptWalker.prototype.visitCallExpression = function (node) {
        this.validateExpression(node);
        _super.prototype.visitCallExpression.call(this, node);
    };
    NoEvalScriptWalker.prototype.validateExpression = function (node) {
        var expression = node.expression;
        var functionName = AstUtils.getFunctionName(node);
        if (functionName === 'execScript') {
            var msg = Rule.FAILURE_STRING + expression.getFullText().trim();
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), msg));
        }
    };
    return NoEvalScriptWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noExecScriptRule.js.map