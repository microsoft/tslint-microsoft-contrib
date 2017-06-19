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
var tsutils_1 = require("tsutils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoEmptyLineAfterOpeningBraceWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: 'no-empty-line-after-opening-brace',
    type: 'maintainability',
    description: 'Avoid an empty line after an opening brace',
    options: null,
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'Ignored',
    issueType: 'Warning',
    severity: 'Low',
    level: 'Opportunity for Excellence',
    group: 'Whitespace',
    recommendation: 'false,',
    commonWeaknessEnumeration: '710'
};
Rule.FAILURE_STRING = 'Opening brace cannot be followed by empty line';
exports.Rule = Rule;
var NoEmptyLineAfterOpeningBraceWalker = (function (_super) {
    __extends(NoEmptyLineAfterOpeningBraceWalker, _super);
    function NoEmptyLineAfterOpeningBraceWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.scanner = ts.createScanner(1, false, 0, sourceFile.text);
        return _this;
    }
    NoEmptyLineAfterOpeningBraceWalker.prototype.visitSourceFile = function (node) {
        this.scanAllTokens(node);
        _super.prototype.visitSourceFile.call(this, node);
    };
    NoEmptyLineAfterOpeningBraceWalker.prototype.scanAllTokens = function (node) {
        var _this = this;
        this.scanner.setTextPos(0);
        var previous;
        var previousPrevious;
        tsutils_1.forEachTokenWithTrivia(node, function (_a, tokenSyntaxKind, range) {
            if (previousPrevious === ts.SyntaxKind.OpenBraceToken &&
                previous === ts.SyntaxKind.NewLineTrivia &&
                tokenSyntaxKind === ts.SyntaxKind.NewLineTrivia) {
                _this.addFailureAt(range.pos, 1, Rule.FAILURE_STRING);
            }
            if (tokenSyntaxKind !== ts.SyntaxKind.WhitespaceTrivia) {
                previousPrevious = previous;
                previous = tokenSyntaxKind;
            }
        });
    };
    return NoEmptyLineAfterOpeningBraceWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
//# sourceMappingURL=noEmptyLineAfterOpeningBraceRule.js.map