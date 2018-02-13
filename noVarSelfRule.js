"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var FAILURE_STRING = 'Assigning this reference to local variable: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-var-self rule is deprecated. Replace your usage with the TSLint no-this-assignment rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-var-self',
        type: 'maintainability',
        description: 'Do not use var self = this; instead, manage scope with arrow functions/lambdas.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false,',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.isWarningShown = false;
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoVarSelfRuleWalker = (function (_super) {
    __extends(NoVarSelfRuleWalker, _super);
    function NoVarSelfRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.bannedVariableNames = /.*/;
        if (options.ruleArguments != null && options.ruleArguments.length > 0) {
            _this.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }
        return _this;
    }
    NoVarSelfRuleWalker.prototype.visitVariableDeclaration = function (node) {
        if (node.initializer != null && node.initializer.kind === ts.SyntaxKind.ThisKeyword) {
            if (node.name.kind === ts.SyntaxKind.Identifier) {
                var identifier = node.name;
                if (this.bannedVariableNames.test(identifier.text)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
                }
            }
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    return NoVarSelfRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noVarSelfRule.js.map