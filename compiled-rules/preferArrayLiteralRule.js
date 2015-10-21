var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './utils/SyntaxKind', './utils/ErrorTolerantWalker'], function (require, exports) {
    var SyntaxKind = require('./utils/SyntaxKind');
    var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        Rule.prototype.apply = function (sourceFile) {
            return this.applyWithWalker(new NoGenericArrayWalker(sourceFile, this.getOptions()));
        };
        Rule.FAILURE_STRING = 'Replace generic-typed Array with array literal: ';
        return Rule;
    })(Lint.Rules.AbstractRule);
    exports.Rule = Rule;
    var NoGenericArrayWalker = (function (_super) {
        __extends(NoGenericArrayWalker, _super);
        function NoGenericArrayWalker() {
            _super.apply(this, arguments);
        }
        NoGenericArrayWalker.prototype.visitNode = function (node) {
            if (node.kind === SyntaxKind.current().TypeReference) {
                var ref = node;
                if (ref.typeName.text === 'Array') {
                    var failureString = Rule.FAILURE_STRING + node.getText();
                    var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                    this.addFailure(failure);
                }
            }
            _super.prototype.visitNode.call(this, node);
        };
        return NoGenericArrayWalker;
    })(ErrorTolerantWalker);
});
//# sourceMappingURL=preferArrayLiteralRule.js.map