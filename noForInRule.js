var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoForInRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Do not use for in statements, use Object.keys instead: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoForInRuleWalker = (function (_super) {
    __extends(NoForInRuleWalker, _super);
    function NoForInRuleWalker() {
        _super.apply(this, arguments);
    }
    NoForInRuleWalker.prototype.visitForInStatement = function (node) {
        var initializer = node.initializer.getText();
        var expression = node.expression.getText();
        var msg = Rule.FAILURE_STRING + 'for (' + initializer + ' in ' + expression + ')';
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
    };
    return NoForInRuleWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noForInRule.js.map