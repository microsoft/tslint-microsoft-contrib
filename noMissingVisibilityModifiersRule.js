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
        return this.applyWithWalker(new MissingVisibilityModifierWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-missing-visibility-modifiers',
        type: 'maintainability',
        description: 'Deprecated - This rule is in the TSLint product as `member-access`',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // use tslint member-access rule instead',
        commonWeaknessEnumeration: '398, 710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MissingVisibilityModifierWalker = (function (_super) {
    __extends(MissingVisibilityModifierWalker, _super);
    function MissingVisibilityModifierWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingVisibilityModifierWalker.prototype.visitPropertyDeclaration = function (node) {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = 'Field missing visibility modifier: ' + this.getFailureCodeSnippet(node);
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    MissingVisibilityModifierWalker.prototype.visitMethodDeclaration = function (node) {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = 'Method missing visibility modifier: ' + this.getFailureCodeSnippet(node);
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    MissingVisibilityModifierWalker.prototype.isMissingVisibilityModifier = function (node) {
        return !(AstUtils_1.AstUtils.isPrivate(node) || AstUtils_1.AstUtils.isProtected(node) || AstUtils_1.AstUtils.isPublic(node));
    };
    MissingVisibilityModifierWalker.prototype.getFailureCodeSnippet = function (node) {
        var message = node.getText();
        if (message.indexOf('\n') > 0) {
            return message.substr(0, message.indexOf('\n'));
        }
        return message;
    };
    return MissingVisibilityModifierWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noMissingVisibilityModifiersRule.js.map