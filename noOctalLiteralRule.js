var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var noOctalLiteral = new NoOctalLiteral(sourceFile, this.getOptions());
        return this.applyWithWalker(noOctalLiteral);
    };
    Rule.FAILURE_STRING = 'Octal literals should not be used: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoOctalLiteral = (function (_super) {
    __extends(NoOctalLiteral, _super);
    function NoOctalLiteral() {
        _super.apply(this, arguments);
    }
    NoOctalLiteral.prototype.visitNode = function (node) {
        this.handleNode(node);
        _super.prototype.visitNode.call(this, node);
    };
    NoOctalLiteral.prototype.handleNode = function (node) {
        if (node.kind === 228) {
            var text = node.getText();
            this.matchRegexAndFail(text, /(".*(\\-?[0-7]{1,3}(?![0-9])).*")/g);
            this.matchRegexAndFail(text, /('.*(\\-?[0-7]{1,3}(?![0-9])).*')/g);
        }
    };
    NoOctalLiteral.prototype.matchRegexAndFail = function (text, regex) {
        var match;
        while (match = regex.exec(text)) {
            var startOfMatch = text.indexOf(match[1]);
            var failure = void 0;
            failure = this.createFailure(startOfMatch, match[2].length, Rule.FAILURE_STRING + match[2]);
            if (failure != null) {
                this.addFailure(failure);
            }
        }
    };
    return NoOctalLiteral;
})(ErrorTolerantWalker);
//# sourceMappingURL=noOctalLiteralRule.js.map