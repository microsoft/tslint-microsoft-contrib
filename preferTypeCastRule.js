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
var FAILURE_STRING = 'Found as-cast instead of a traditional type-cast. Please convert to a type-cast: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PreferTypeCastRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: 'prefer-type-cast',
    type: 'maintainability',
    description: 'Prefer the tradition type casts instead of the new \'as-cast\' syntax',
    options: null,
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'Ignored',
    issueType: 'Warning',
    severity: 'Low',
    level: 'Opportunity for Excellence',
    group: 'Configurable',
    recommendation: 'true,   // pick either type-cast format and use it consistently',
    commonWeaknessEnumeration: '398, 710'
};
exports.Rule = Rule;
var PreferTypeCastRuleWalker = (function (_super) {
    __extends(PreferTypeCastRuleWalker, _super);
    function PreferTypeCastRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreferTypeCastRuleWalker.prototype.visitSourceFile = function (node) {
        if (/.*\.tsx/.test(node.fileName) === false) {
            _super.prototype.visitSourceFile.call(this, node);
        }
    };
    PreferTypeCastRuleWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.AsExpression) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
        }
        _super.prototype.visitNode.call(this, node);
    };
    return PreferTypeCastRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=preferTypeCastRule.js.map