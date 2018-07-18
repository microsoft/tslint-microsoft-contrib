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
var tsutils_1 = require("tsutils");
var FAILURE_STRING = 'Replace block comment with a single-line comment';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoSingleLineBlockCommentRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-single-line-block-comment',
        type: 'maintainability',
        description: 'Avoid single line block comments; use single line comments instead',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Whitespace',
        commonWeaknessEnumeration: '710'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoSingleLineBlockCommentRuleWalker = (function (_super) {
    __extends(NoSingleLineBlockCommentRuleWalker, _super);
    function NoSingleLineBlockCommentRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoSingleLineBlockCommentRuleWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        tsutils_1.forEachTokenWithTrivia(node, function (fullText, tokenSyntaxKind, range) {
            var tokenText = fullText.substring(range.pos, range.end);
            if (tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia
                && _this.isSingleLineComment(tokenText)
                && !_this.isTsLintSuppression(tokenText)
                && !_this.isFollowedByMoreCodeOnSameLine(fullText, range)) {
                _this.addFailureAt(range.pos, range.end - range.pos, FAILURE_STRING);
            }
        });
    };
    NoSingleLineBlockCommentRuleWalker.prototype.isSingleLineComment = function (commentText) {
        var lines = commentText.split(/\r?\n/);
        return lines.length === 1;
    };
    NoSingleLineBlockCommentRuleWalker.prototype.isTsLintSuppression = function (commentText) {
        return /\/*\s*tslint:(enable|disable):.*/.test(commentText);
    };
    NoSingleLineBlockCommentRuleWalker.prototype.isFollowedByMoreCodeOnSameLine = function (fullText, range) {
        var restOfText = fullText.substring(range.end);
        return /^\s*\r?\n/.test(restOfText) === false;
    };
    return NoSingleLineBlockCommentRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noSingleLineBlockCommentRule.js.map