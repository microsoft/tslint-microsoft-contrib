var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var AstUtils = require('./AstUtils');
var NoStringParameterToFunctionCallWalker = (function (_super) {
    __extends(NoStringParameterToFunctionCallWalker, _super);
    function NoStringParameterToFunctionCallWalker(sourceFile, targetFunctionName, options, languageServices) {
        _super.call(this, sourceFile, options);
        this.languageServices = languageServices;
        this.typeChecker = this.languageServices.getProgram().getTypeChecker();
        this.targetFunctionName = targetFunctionName;
        this.failureString = 'Forbidden ' + targetFunctionName + ' string parameter: ';
    }
    NoStringParameterToFunctionCallWalker.prototype.visitCallExpression = function (node) {
        this.validateExpression(node);
        _super.prototype.visitCallExpression.call(this, node);
    };
    NoStringParameterToFunctionCallWalker.prototype.validateExpression = function (node) {
        var functionName = AstUtils.getFunctionName(node);
        var firstArg = node.arguments[0];
        if (functionName === this.targetFunctionName && firstArg != null) {
            if (!AstUtils.isExpressionEvaluatingToFunction(firstArg, this.languageServices, this.typeChecker)) {
                var msg = this.failureString + firstArg.getFullText().trim().substring(0, 40);
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
            }
        }
    };
    return NoStringParameterToFunctionCallWalker;
})(ErrorTolerantWalker);
module.exports = NoStringParameterToFunctionCallWalker;
//# sourceMappingURL=NoStringParameterToFunctionCallWalker.js.map