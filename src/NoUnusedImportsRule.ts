
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused import: ";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var languageServiceHost = new Lint.LanguageServiceHost(syntaxTree, syntaxTree.sourceUnit().fullText());
        var languageServices = new TypeScript.Services.LanguageService(languageServiceHost);

        return this.applyWithWalker(new NoUnusedImportsWalker(syntaxTree, this.getOptions(), languageServices));
    }
}

class NoUnusedImportsWalker extends Lint.RuleWalker {

    private fileName: string;
    private languageServices: TypeScript.Services.LanguageService;

    public constructor(syntaxTree, options, languageServices) {
        super(syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.languageServices = languageServices;
    }

    public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void {
        if (!this.hasModifier(node.modifiers, 47 /* ExportKeyword */)) {
            var position = this.positionAfter(node.importKeyword);
            this.validateReferencesForVariable(node.identifier.text(), position);
        }
        super.visitImportDeclaration(node);
    }

    private hasModifier(modifiers, modifierKind) {
        for (var i = 0, n = modifiers.childCount(); i < n; i++) {
            var modifier = modifiers.childAt(i);
            if (modifier.kind() === modifierKind) {
                return true;
            }
        }
        return false;
    }

    private validateReferencesForVariable(name, position) {
        var references = this.languageServices.getReferencesAtPosition(this.fileName, position);
        if (references.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}
