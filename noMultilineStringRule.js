var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SyntaxKind = require('./utils/SyntaxKind');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoMultilineStringWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Forbidden Multiline string: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoMultilineStringWalker = (function (_super) {
    __extends(NoMultilineStringWalker, _super);
    function NoMultilineStringWalker() {
        _super.apply(this, arguments);
    }
    NoMultilineStringWalker.prototype.visitNode = function (node) {
        if (node.kind === SyntaxKind.current().NoSubstitutionTemplateLiteral) {
            var fullText = node.getFullText();
            var firstLine = fullText.substring(0, fullText.indexOf('\n'));
            var trimmed = firstLine.substring(0, 40);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + trimmed + '...'));
        }
        _super.prototype.visitNode.call(this, node);
    };
    return NoMultilineStringWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noMultilineStringRule.js.map