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
        var referencedDotImports = this.getReferencedDotImports(sourceFile, this.getOptions());
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService, referencedDotImports));
    };
    Rule.prototype.getReferencedDotImports = function (sourceFile, options) {
        var gatherImportHandler = new GatherNoRequireImportsWalker(sourceFile, options);
        this.applyWithWalker(gatherImportHandler);
        return gatherImportHandler.noRequireReferences;
    };
    Rule.FAILURE_STRING = 'unused import: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var GatherNoRequireImportsWalker = (function (_super) {
    __extends(GatherNoRequireImportsWalker, _super);
    function GatherNoRequireImportsWalker() {
        _super.apply(this, arguments);
        this.noRequireReferences = {};
    }
    GatherNoRequireImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        var moduleReference = node.moduleReference;
        if (moduleReference.kind === 127) {
            if (moduleReference.left != null) {
                this.gatherReferenceFromImport(moduleReference.left.text);
            }
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    GatherNoRequireImportsWalker.prototype.gatherReferenceFromImport = function (qualifiedName) {
        var _this = this;
        if (qualifiedName) {
            qualifiedName.split('.').forEach(function (name) {
                _this.noRequireReferences[name] = true;
            });
        }
    };
    return GatherNoRequireImportsWalker;
})(Lint.RuleWalker);
var NoUnusedImportsWalker = (function (_super) {
    __extends(NoUnusedImportsWalker, _super);
    function NoUnusedImportsWalker(sourceFile, options, languageServices, noRequireReferences) {
        _super.call(this, sourceFile, options);
        this.noRequireReferences = {};
        this.languageServices = languageServices;
        this.noRequireReferences = noRequireReferences;
    }
    NoUnusedImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (!this.hasModifier(node.modifiers, 78)) {
            this.validateReferencesForVariable(node.name.text, node.name.getStart());
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    NoUnusedImportsWalker.prototype.hasModifier = function (modifiers, modifierKind) {
        if (modifiers == null) {
            return false;
        }
        var result = false;
        modifiers.forEach(function (modifier) {
            if (modifier.kind === modifierKind) {
                result = true;
            }
        });
        return result;
    };
    NoUnusedImportsWalker.prototype.validateReferencesForVariable = function (name, position) {
        var references = this.languageServices.getReferencesAtPosition('file.ts', position);
        if (references.length <= 1 && !this.noRequireReferences[name]) {
            var failureString = Rule.FAILURE_STRING + '\'' + name + '\'';
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    };
    return NoUnusedImportsWalker;
})(ErrorTolerantWalker);
//# sourceMappingURL=noUnusedImportsRule.js.map