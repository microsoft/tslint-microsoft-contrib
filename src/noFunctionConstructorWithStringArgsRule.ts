import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

import AstUtils = require('./utils/AstUtils');

/**
 * Implementation of the no-function-constructor-with-string-args rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'forbidden: Function constructor with string arguments ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoFunctionConstructorWithStringArgsWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoFunctionConstructorWithStringArgsWalker extends ErrorTolerantWalker {

    private languageService: ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    public constructor(sourceFile : ts.SourceFile, options : Lint.IOptions, languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageServices;
        this.typeChecker = this.languageService.getProgram().getTypeChecker();
    }


    protected visitNewExpression(node: ts.NewExpression): void {
        var functionName  = AstUtils.getFunctionName(node);
        if (functionName === 'Function') {
            if (node.arguments.length > 0) {
              this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitNewExpression(node);
    }
}
