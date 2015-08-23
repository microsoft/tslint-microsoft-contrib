import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'unused import: ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        var referencedDotImports : { [index: string]: boolean; } = this.getReferencedDotImports(sourceFile, this.getOptions());
        return this.applyWithWalker(new NoUnusedImportsWalker(sourceFile, this.getOptions(), languageService, referencedDotImports));
    }

    private getReferencedDotImports(sourceFile : ts.SourceFile, options : Lint.IOptions) : { [index: string]: boolean; } {
        var gatherImportHandler = new GatherNoRequireImportsWalker(sourceFile, options);
        this.applyWithWalker(gatherImportHandler);
        return gatherImportHandler.noRequireReferences;
    }
}

class GatherNoRequireImportsWalker extends Lint.RuleWalker {

    public noRequireReferences: { [index: string]: boolean; } = {};

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        var moduleReference = node.moduleReference;
        if (moduleReference.kind === ts.SyntaxKind.QualifiedName) {
            if ((<any>moduleReference).left != null) {
                this.gatherReferenceFromImport((<any>moduleReference).left.text);
            }
        }
        super.visitImportEqualsDeclaration(node);
    }


    private gatherReferenceFromImport(qualifiedName : string) : void {
        if (qualifiedName) {
            qualifiedName.split('.').forEach((name : string) => {
                this.noRequireReferences[name] = true;
            });
        }
    }
}

class NoUnusedImportsWalker extends ErrorTolerantWalker {

    private languageServices: ts.LanguageService;
    private noRequireReferences: { [index: string]: boolean; } = {};

    public constructor(sourceFile : ts.SourceFile,
                       options : Lint.IOptions,
                       languageServices : ts.LanguageService,
                       noRequireReferences: { [index: string]: boolean; }) {
        super(sourceFile, options);
        this.languageServices = languageServices;
        this.noRequireReferences = noRequireReferences;
    }


    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        if (!this.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
            this.validateReferencesForVariable((<any>node).name.text, (<any>node).name.getStart());
        }
        super.visitImportEqualsDeclaration(node);
    }

    private hasModifier(modifiers : ts.ModifiersArray, modifierKind : ts.SyntaxKind) : boolean {
        if (modifiers == null) {
            return false;
        }
        var result : boolean = false;
        modifiers.forEach((modifier : ts.Node) : void => {
            if (modifier.kind === modifierKind) {
                result = true;
            }
        });
        return result;
    }

    /**
     * As described in  https://github.com/palantir/tslint/issues/325,
     * the language service in typescript 1.4 doesn't seem to search for references in other imports.
     * This will be fixed, but we can work around it by keeping track for the import references manually.
     */
    private validateReferencesForVariable(name : string, position : number) {
        var references = this.languageServices.getReferencesAtPosition('file.ts', position);
        if (references.length <= 1 && !this.noRequireReferences[name]) {
            var failureString = Rule.FAILURE_STRING + '\'' + name + '\'';
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    }
}
