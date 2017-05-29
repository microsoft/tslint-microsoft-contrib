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
})(["require", "exports", './utils/ErrorTolerantWalker'], function (require, exports) {
    var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        Rule.prototype.apply = function (sourceFile) {
            return this.applyWithWalker(new NoEmptyInterfacesRuleWalker(sourceFile, this.getOptions()));
        };
        Rule.FAILURE_STRING = 'Do not declare empty interfaces: ';
        return Rule;
    })(Lint.Rules.AbstractRule);
    exports.Rule = Rule;
    var NoEmptyInterfacesRuleWalker = (function (_super) {
        __extends(NoEmptyInterfacesRuleWalker, _super);
        function NoEmptyInterfacesRuleWalker() {
            _super.apply(this, arguments);
        }
        NoEmptyInterfacesRuleWalker.prototype.visitInterfaceDeclaration = function (node) {
            if (node.members == null || node.members.length === 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + '\'' + node.name.getText() + '\''));
            }
            _super.prototype.visitInterfaceDeclaration.call(this, node);
        };
        return NoEmptyInterfacesRuleWalker;
    })(ErrorTolerantWalker);
});
//# sourceMappingURL=noEmptyInterfacesRule.js.map