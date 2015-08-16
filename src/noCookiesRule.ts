
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden call to document.cookie';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService : ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoCookiesWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoCookiesWalker extends ErrorTolerantWalker {

    private languageService : ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService : ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }


    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        var propertyName = node.name.text;
        if (propertyName === 'cookie') {

            var leftSide : ts.Expression = node.expression;
            try {
                var leftSideType: ts.Type = this.typeChecker.getTypeAtLocation(leftSide);
                var typeAsString: string = this.typeChecker.typeToString(leftSideType);
                if (leftSideType.flags === ts.TypeFlags.Any || typeAsString === 'Document') {
                    this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING));
                }
            } catch (e) {
                // TODO: this error seems like a tslint error
                if (leftSide.getFullText().trim() === 'document') {
                    this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }

        super.visitPropertyAccessExpression(node);
    }

}
