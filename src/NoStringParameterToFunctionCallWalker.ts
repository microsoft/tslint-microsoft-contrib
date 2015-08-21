import ErrorTolerantWalker = require('./ErrorTolerantWalker');

import AstUtils = require('./AstUtils');

class NoStringParameterToFunctionCallWalker extends ErrorTolerantWalker {

    private failureString : string;
    private languageServices: ts.LanguageService;
    private typeChecker : ts.TypeChecker;
    private targetFunctionName : string;

    public constructor(sourceFile : ts.SourceFile,
                       targetFunctionName : string,
                       options : Lint.IOptions,
                       languageServices : ts.LanguageService) {
        super(sourceFile, options);
        this.languageServices = languageServices;
        this.typeChecker = this.languageServices.getProgram().getTypeChecker();
        this.targetFunctionName = targetFunctionName;
        this.failureString = 'Forbidden ' + targetFunctionName + ' string parameter: ';
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node : ts.CallExpression) : void {
        var functionName : string = AstUtils.getFunctionName(node);
        var firstArg : ts.Expression = node.arguments[0];
        if (functionName === this.targetFunctionName && firstArg != null) {

            if (!AstUtils.isExpressionEvaluatingToFunction(firstArg, this.languageServices, this.typeChecker)) {
                var msg : string = this.failureString + firstArg.getFullText().trim().substring(0, 40);
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
            }
        }
    }
}

export = NoStringParameterToFunctionCallWalker;