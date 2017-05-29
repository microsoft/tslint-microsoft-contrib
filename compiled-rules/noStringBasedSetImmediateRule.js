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
})(["require", "exports", './utils/NoStringParameterToFunctionCallWalker'], function (require, exports) {
    var NoStringParameterToFunctionCallWalker = require('./utils/NoStringParameterToFunctionCallWalker');
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        Rule.prototype.apply = function (sourceFile) {
            var documentRegistry = ts.createDocumentRegistry();
            var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
            var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
            var walker = new NoStringParameterToFunctionCallWalker(sourceFile, 'setImmediate', this.getOptions(), languageService);
            return this.applyWithWalker(walker);
        };
        return Rule;
    })(Lint.Rules.AbstractRule);
    exports.Rule = Rule;
});
//# sourceMappingURL=noStringBasedSetImmediateRule.js.map