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
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'unnecessary semi-colon';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUnnecessarySemicolonsWalker = (function (_super) {
    __extends(NoUnnecessarySemicolonsWalker, _super);
    function NoUnnecessarySemicolonsWalker() {
        _super.apply(this, arguments);
    }
    NoUnnecessarySemicolonsWalker.prototype.visitNode = function (node) {
        if (node.kind === 182) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        _super.prototype.visitNode.call(this, node);
    };
    return NoUnnecessarySemicolonsWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noUnnecessarySemicolonsRule.js.map