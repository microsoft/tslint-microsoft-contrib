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
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService));
    };
    Rule.FAILURE_STRING = 'unused import: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUnusedImportsWalker = (function (_super) {
    __extends(NoUnusedImportsWalker, _super);
    function NoUnusedImportsWalker(sourceFile, options, languageServices) {
        _super.call(this, sourceFile, options);
        this.languageServices = languageServices;
    }
    NoUnusedImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (!Lint.hasModifier(node.modifiers, 78)) {
            this.validateReferencesForVariable(node.name.text, node.name.getStart());
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    NoUnusedImportsWalker.prototype.validateReferencesForVariable = function (name, position) {
        var highlights = this.languageServices.getDocumentHighlights('file.ts', position, ['file.ts']);
        if (highlights[0].highlightSpans.length <= 1) {
            this.addFailure(this.createFailure(position, name.length, Rule.FAILURE_STRING + '\'' + name + '\''));
        }
    };
    return NoUnusedImportsWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noUnusedImportsRule.js.map