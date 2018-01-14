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
var ErrorTolerantWalker_1 = require("./utils/ErrorTolerantWalker");
var FAILURE_STRING = 'Avoid typeof x === \'undefined\' comparisons. Prefer x == undefined or x === undefined: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoTypeofUndefinedRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-typeof-undefined',
        type: 'maintainability',
        description: 'Do not use the idiom typeof `x === \'undefined\'`. You can safely use the simpler x === undefined ' +
            'or perhaps x == null if you want to check for either null or undefined.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoTypeofUndefinedRuleWalker = (function (_super) {
    __extends(NoTypeofUndefinedRuleWalker, _super);
    function NoTypeofUndefinedRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoTypeofUndefinedRuleWalker.prototype.visitBinaryExpression = function (node) {
        if ((this.isUndefinedString(node.left) && this.isTypeOfExpression(node.right))
            || this.isUndefinedString(node.right) && this.isTypeOfExpression(node.left)) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    NoTypeofUndefinedRuleWalker.prototype.isTypeOfExpression = function (node) {
        return node.kind === ts.SyntaxKind.TypeOfExpression;
    };
    NoTypeofUndefinedRuleWalker.prototype.isUndefinedString = function (node) {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
            if (node.text === 'undefined') {
                return true;
            }
        }
        return false;
    };
    return NoTypeofUndefinedRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noTypeofUndefinedRule.js.map