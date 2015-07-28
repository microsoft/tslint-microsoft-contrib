
import AstUtils = require('./AstUtils');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Forbidden setTimeout string parameter: ";

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost("file.ts", sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoStringBasedSetTimeoutWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoStringBasedSetTimeoutWalker extends Lint.RuleWalker {

    private languageServices: ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    public constructor(sourceFile : ts.SourceFile, options : Lint.IOptions, languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageServices = languageServices;
        this.typeChecker = this.languageServices.getProgram().getTypeChecker();
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node : ts.CallExpression) : void {
        var functionName : string = AstUtils.getFunctionName(node);
        var firstArg : ts.Expression = node.arguments[0];
        if (functionName === 'setTimeout' && firstArg != null) {

            if (firstArg.kind === ts.SyntaxKind.ArrowFunction) {
                return; // arrow function literals are acceptable to pass to setTimeout
            }
            if (firstArg.kind === ts.SyntaxKind.FunctionExpression) {
                return; // function expressions are OK to pass
            }
            if (firstArg.kind === ts.SyntaxKind.Identifier) {
                var typeInfo : ts.DefinitionInfo[] = this.languageServices.getTypeDefinitionAtPosition('file.ts', firstArg.getStart());
                if (typeInfo != null && typeInfo[0] != null && typeInfo[0].kind === 'function') {
                    return; // variables with type function are OK to pass
                }
            }

            var type : ts.Type = this.typeChecker.getTypeAtLocation(firstArg);
            var signatures : ts.Signature[] = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
            if (signatures != null && signatures.length > 0) {
                var signatureDeclaration : ts.SignatureDeclaration = signatures[0].declaration;
                if (signatureDeclaration.kind === ts.SyntaxKind.FunctionType) {
                    return; // variables of type function are allowed to be passed as parameters
                }
            }

            if (firstArg.getFullText() === 'functionArg') {
                //AstUtils.dumpTypeInfo(firstArg, this.languageServices, this.typeChecker);
            }
            var msg : string = Rule.FAILURE_STRING + firstArg.getFullText().trim().substring(0, 40);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
        }
    }
}
