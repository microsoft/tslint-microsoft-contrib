"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
var FAILURE_STRING = 'Suspicious comment found: ';
var SUSPICIOUS_WORDS = ['BUG', 'HACK', 'FIXME', 'LATER', 'LATER2', 'TODO'];
var FAILURE_STRING_OPTION = '\nTo disable this warning, the comment should include one of the following regex: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoSuspiciousCommentRuleWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'no-suspicious-comment',
        type: 'maintainability',
        description: "Do not use suspicious comments, such as " + SUSPICIOUS_WORDS.join(', '),
        options: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        optionsDescription: "One argument may be optionally provided: \n\n' +\n            '* an array of regex that disable the warning if one or several of them\n            are found in the comment text. (Example: `['https://github.com/my-org/my-project/*']`)",
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '546'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoSuspiciousCommentRuleWalker = (function (_super) {
    __extends(NoSuspiciousCommentRuleWalker, _super);
    function NoSuspiciousCommentRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.exceptionRegex = [];
        if (options.ruleArguments !== undefined && options.ruleArguments.length > 0) {
            options.ruleArguments.forEach(function (regexStr) {
                _this.exceptionRegex.push(new RegExp(regexStr));
            });
        }
        return _this;
    }
    NoSuspiciousCommentRuleWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        tsutils_1.forEachTokenWithTrivia(node, function (text, tokenSyntaxKind, range) {
            if (tokenSyntaxKind === ts.SyntaxKind.SingleLineCommentTrivia || tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                _this.scanCommentForSuspiciousWords(range.pos, text.substring(range.pos, range.end));
            }
        });
    };
    NoSuspiciousCommentRuleWalker.prototype.scanCommentForSuspiciousWords = function (startPosition, commentText) {
        var _this = this;
        if (this.commentContainsExceptionRegex(this.exceptionRegex, commentText)) {
            return;
        }
        SUSPICIOUS_WORDS.forEach(function (suspiciousWord) {
            _this.scanCommentForSuspiciousWord(suspiciousWord, commentText, startPosition);
        });
    };
    NoSuspiciousCommentRuleWalker.prototype.scanCommentForSuspiciousWord = function (suspiciousWord, commentText, startPosition) {
        var regexExactCaseNoColon = new RegExp('\\b' + suspiciousWord + '\\b');
        var regexCaseInsensistiveWithColon = new RegExp('\\b' + suspiciousWord + '\\b:', 'i');
        if (regexExactCaseNoColon.test(commentText) || regexCaseInsensistiveWithColon.test(commentText)) {
            this.foundSuspiciousComment(startPosition, commentText, suspiciousWord);
        }
    };
    NoSuspiciousCommentRuleWalker.prototype.foundSuspiciousComment = function (startPosition, commentText, suspiciousWord) {
        var errorMessage = FAILURE_STRING + suspiciousWord;
        if (this.exceptionRegex.length > 0) {
            errorMessage += '.' + this.getFailureMessageWithExceptionRegexOption();
        }
        this.addFailureAt(startPosition, commentText.length, errorMessage);
    };
    NoSuspiciousCommentRuleWalker.prototype.commentContainsExceptionRegex = function (exceptionRegex, commentText) {
        for (var _i = 0, exceptionRegex_1 = exceptionRegex; _i < exceptionRegex_1.length; _i++) {
            var regex = exceptionRegex_1[_i];
            if (regex.test(commentText)) {
                return true;
            }
        }
        return false;
    };
    NoSuspiciousCommentRuleWalker.prototype.getFailureMessageWithExceptionRegexOption = function () {
        var message = FAILURE_STRING_OPTION;
        this.exceptionRegex.forEach(function (regex) {
            message += regex.toString();
        });
        return message;
    };
    return NoSuspiciousCommentRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=noSuspiciousCommentRule.js.map