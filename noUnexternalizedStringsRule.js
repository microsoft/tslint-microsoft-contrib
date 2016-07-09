"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ErrorTolerantWalker_1 = require('./utils/ErrorTolerantWalker');
var SyntaxKind_1 = require('./utils/SyntaxKind');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoUnexternalizedStringsRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoUnexternalizedStringsRuleWalker = (function (_super) {
    __extends(NoUnexternalizedStringsRuleWalker, _super);
    function NoUnexternalizedStringsRuleWalker(sourceFile, opt) {
        var _this = this;
        _super.call(this, sourceFile, opt);
        this.signatures = Object.create(null);
        this.ignores = Object.create(null);
        var options = this.getOptions();
        var first = options && options.length > 0 ? options[0] : null;
        if (first) {
            if (Array.isArray(first.signatures)) {
                first.signatures.forEach(function (signature) { return _this.signatures[signature] = true; });
            }
            if (Array.isArray(first.ignores)) {
                first.ignores.forEach(function (ignore) { return _this.ignores[ignore] = true; });
            }
            if (first.messageIndex !== undefined) {
                this.messageIndex = first.messageIndex;
            }
        }
    }
    NoUnexternalizedStringsRuleWalker.prototype.visitStringLiteral = function (node) {
        this.checkStringLiteral(node);
        _super.prototype.visitStringLiteral.call(this, node);
    };
    NoUnexternalizedStringsRuleWalker.prototype.checkStringLiteral = function (node) {
        var text = node.getText();
        if (text.length >= 2 && text[0] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE
            && text[text.length - 1] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE) {
            return;
        }
        var info = this.findDescribingParent(node);
        if (info && info.ignoreUsage) {
            return;
        }
        var callInfo = info ? info.callInfo : null;
        if (callInfo && this.ignores[callInfo.callExpression.expression.getText()]) {
            return;
        }
        if (!callInfo || callInfo.argIndex === -1 || !this.signatures[callInfo.callExpression.expression.getText()]) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), "Unexternalized string found: " + node.getText()));
            return;
        }
        var messageArg = callInfo.argIndex === this.messageIndex
            ? callInfo.callExpression.arguments[this.messageIndex]
            : null;
        if (messageArg && messageArg !== node) {
            this.addFailure(this.createFailure(messageArg.getStart(), messageArg.getWidth(), "Message argument to '" + callInfo.callExpression.expression.getText() + "' must be a string literal."));
            return;
        }
    };
    NoUnexternalizedStringsRuleWalker.prototype.findDescribingParent = function (node) {
        var kinds = SyntaxKind_1.SyntaxKind.current();
        var parent;
        while ((parent = node.parent)) {
            var kind = parent.kind;
            if (kind === kinds.CallExpression) {
                var callExpression = parent;
                return { callInfo: { callExpression: callExpression, argIndex: callExpression.arguments.indexOf(node) } };
            }
            else if (kind === kinds.ImportEqualsDeclaration || kind === kinds.ImportDeclaration || kind === kinds.ExportDeclaration) {
                return { ignoreUsage: true };
            }
            else if (kind === kinds.VariableDeclaration || kind === kinds.FunctionDeclaration || kind === kinds.PropertyDeclaration
                || kind === kinds.MethodDeclaration || kind === kinds.VariableDeclarationList || kind === kinds.InterfaceDeclaration
                || kind === kinds.ClassDeclaration || kind === kinds.EnumDeclaration || kind === kinds.ModuleDeclaration
                || kind === kinds.TypeAliasDeclaration || kind === kinds.SourceFile) {
                return null;
            }
            node = parent;
        }
    };
    NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE = '\'';
    return NoUnexternalizedStringsRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noUnexternalizedStringsRule.js.map