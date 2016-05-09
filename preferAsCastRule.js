"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var FAILURE_STRING = 'Found type-cast that does not use the as keyword. Please convert to an as-cast: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PreferAsCastRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var PreferAsCastRuleWalker = (function (_super) {
    __extends(PreferAsCastRuleWalker, _super);
    function PreferAsCastRuleWalker() {
        _super.apply(this, arguments);
    }
    PreferAsCastRuleWalker.prototype.visitTypeAssertionExpression = function (node) {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
        _super.prototype.visitTypeAssertionExpression.call(this, node);
    };
    return PreferAsCastRuleWalker;
}(ErrorTolerantWalker));
//# sourceMappingURL=preferAsCastRule.js.map