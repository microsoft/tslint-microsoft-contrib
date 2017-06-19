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
var AstUtils_1 = require("./utils/AstUtils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoDisableAutoSanitizationWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: 'no-disable-auto-sanitization',
    type: 'maintainability',
    description: 'Do not disable auto-sanitization of HTML because this opens up your page to an XSS attack. ',
    options: null,
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '157, 159, 75, 79, 85, 749, 676'
};
Rule.FAILURE_STRING = 'Forbidden call to ';
exports.Rule = Rule;
var NoDisableAutoSanitizationWalker = (function (_super) {
    __extends(NoDisableAutoSanitizationWalker, _super);
    function NoDisableAutoSanitizationWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoDisableAutoSanitizationWalker.prototype.visitCallExpression = function (node) {
        var functionName = AstUtils_1.AstUtils.getFunctionName(node);
        if (functionName === 'execUnsafeLocalFunction' || functionName === 'setInnerHTMLUnsafe') {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + functionName);
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoDisableAutoSanitizationWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noDisableAutoSanitizationRule.js.map