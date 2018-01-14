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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoWithStatementWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-with-statement',
        type: 'maintainability',
        description: 'Do not use with statements. Assign the item to a new variable instead',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.FAILURE_STRING = 'Forbidden with statement';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoWithStatementWalker = (function (_super) {
    __extends(NoWithStatementWalker, _super);
    function NoWithStatementWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoWithStatementWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.WithStatement) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        _super.prototype.visitNode.call(this, node);
    };
    return NoWithStatementWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noWithStatementRule.js.map