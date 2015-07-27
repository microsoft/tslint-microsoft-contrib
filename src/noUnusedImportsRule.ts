
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused import: ";

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost("file.ts", sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoUnusedImportsWalker extends Lint.RuleWalker {

    private languageServices: ts.LanguageService;

    public constructor(sourceFile : ts.SourceFile, options : Lint.IOptions, languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageServices = languageServices;
    }

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        if (!Lint.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            this.validateReferencesForVariable(node.name.text, node.name.getStart());
        }
        super.visitImportEqualsDeclaration(node);
    }

    private validateReferencesForVariable(name : string, position : number) {
        var highlights = this.languageServices.getDocumentHighlights("file.ts", position, ["file.ts"]);
        if (highlights[0].highlightSpans.length <= 1) {
            this.addFailure(this.createFailure(position, name.length, Rule.FAILURE_STRING + "'" + name + "'"));
        }
    }
}
