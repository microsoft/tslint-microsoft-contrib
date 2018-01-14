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
        return this.applyWithWalker(new MissingJSDocWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'missing-jsdoc',
        type: 'maintainability',
        description: 'All files must have a top level JSDoc comment.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };
    Rule.FAILURE_STRING = 'File missing JSDoc comment at the top-level: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MissingJSDocWalker = (function (_super) {
    __extends(MissingJSDocWalker, _super);
    function MissingJSDocWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingJSDocWalker.prototype.visitSourceFile = function (node) {
        if (!/^\/\*\*\s*$/gm.test(node.getFullText())) {
            var failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName;
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
    };
    return MissingJSDocWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=missingJsdocRule.js.map