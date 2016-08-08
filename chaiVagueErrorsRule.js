"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker_1 = require('./utils/ErrorTolerantWalker');
var SyntaxKind_1 = require('./utils/SyntaxKind');
var ChaiUtils_1 = require('./utils/ChaiUtils');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ChaiVagueErrorsRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'chai-vague-errors',
        type: 'maintainability',
        description: 'Avoid Chai assertions that result in vague errors',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
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
        if (ChaiUtils_1.ChaiUtils.isExpectInvocation(node)) {
            if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    ChaiVagueErrorsRuleWalker.prototype.visitCallExpression = function (node) {
        if (ChaiUtils_1.ChaiUtils.isExpectInvocation(node)) {
            if (node.expression.kind === SyntaxKind_1.SyntaxKind.current().PropertyAccessExpression) {
                if (ChaiUtils_1.ChaiUtils.isEqualsInvocation(node.expression)) {
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
    return ChaiVagueErrorsRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=chaiVagueErrorsRule.js.map