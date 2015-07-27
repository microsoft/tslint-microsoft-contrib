
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unused import: ";

    public apply(sourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost("file.ts", sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoUnusedImportsWalker extends Lint.RuleWalker {

    private fileName: string;
    private languageServices: any;

    public constructor(sourceFile : ts.SourceFile, options, languageServices) {
        super(sourceFile, options);
        console.log('got here2');
        this.fileName = sourceFile.fileName;
        this.languageServices = languageServices;
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void {
        console.log('visiting class');
        super.visitClassDeclaration(node);
    }

    public visitImportDeclaration(node: ts.ImportDeclaration): void {
        console.log('got here');
        if (!this.hasModifier(node.modifiers, 47 /* ExportKeyword */)) {
            //var position = (<any>this).positionAfter(node.importKeyword);
            //this.validateReferencesForVariable(node.identifier.text(), position);
        }
        super.visitImportDeclaration(node);
    }

    private hasModifier(modifiers : ts.ModifiersArray, modifierKind) {
        console.log(modifiers);
        //for (var i = 0, n = modifiers.childCount(); i < n; i++) {
        //    var modifier = modifiers.childAt(i);
        //    if (modifier.kind() === modifierKind) {
        //        return true;
        //    }
        //}
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
