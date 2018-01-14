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
var Lint = require("tslint");
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-empty-interfaces rule is deprecated. Replace your usage with the TSLint no-empty-interface rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithWalker(new NoEmptyInterfacesRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-empty-interfaces',
        type: 'maintainability',
        description: 'Do not use empty interfaces.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // use tslint no-empty-interface rule instead',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.FAILURE_STRING = 'Do not declare empty interfaces: ';
    Rule.isWarningShown = false;
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoEmptyInterfacesRuleWalker = (function (_super) {
    __extends(NoEmptyInterfacesRuleWalker, _super);
    function NoEmptyInterfacesRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoEmptyInterfacesRuleWalker.prototype.visitInterfaceDeclaration = function (node) {
        if (this.isInterfaceEmpty(node) && !this.hasMultipleParents(node)) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + '\'' + node.name.getText() + '\'');
        }
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    NoEmptyInterfacesRuleWalker.prototype.isInterfaceEmpty = function (node) {
        return node.members == null || node.members.length === 0;
    };
    NoEmptyInterfacesRuleWalker.prototype.hasMultipleParents = function (node) {
        if (node.heritageClauses == null || node.heritageClauses.length === 0) {
            return false;
        }
        return node.heritageClauses[0].types.length >= 2;
    };
    return NoEmptyInterfacesRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noEmptyInterfacesRule.js.map