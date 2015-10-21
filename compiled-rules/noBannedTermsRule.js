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
})(["require", "exports", './utils/BannedTermWalker'], function (require, exports) {
    var BannedTermWalker = require('./utils/BannedTermWalker');
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        Rule.prototype.apply = function (sourceFile) {
            var walker = new BannedTermWalker(sourceFile, this.getOptions(), Rule.FAILURE_STRING, Rule.BANNED_TERMS);
            return this.applyWithWalker(walker);
        };
        Rule.FAILURE_STRING = 'Forbidden reference to banned term: ';
        Rule.BANNED_TERMS = ['caller', 'callee', 'arguments', 'eval'];
        return Rule;
    })(Lint.Rules.AbstractRule);
    exports.Rule = Rule;
});
//# sourceMappingURL=noBannedTermsRule.js.map