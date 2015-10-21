var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        var walker = new NoStringParameterToFunctionCallWalker(sourceFile, 'setTimeout', this.getOptions(), languageService);
        return this.applyWithWalker(walker);
    };
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
//# sourceMappingURL=noStringBasedSetTimeoutRule.js.map