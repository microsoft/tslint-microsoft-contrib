"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker_1 = require('./utils/ErrorTolerantWalker');
var AstUtils_1 = require('./utils/AstUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoDisableAutoSanitizationWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Forbidden call to ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoDisableAutoSanitizationWalker = (function (_super) {
    __extends(NoDisableAutoSanitizationWalker, _super);
    function NoDisableAutoSanitizationWalker() {
        _super.apply(this, arguments);
    }
    NoDisableAutoSanitizationWalker.prototype.visitCallExpression = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (functionName === 'execUnsafeLocalFunction' || functionName === 'setInnerHTMLUnsafe') {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + functionName));
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoDisableAutoSanitizationWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noDisableAutoSanitizationRule.js.map