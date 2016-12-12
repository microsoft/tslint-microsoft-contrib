import * as ts from 'typescript';
import * as Lint from 'tslint';
import {ScopedSymbolTrackingWalker} from './ScopedSymbolTrackingWalker';

import {AstUtils} from './AstUtils';

/**
 * A walker that creates failures whenever it detects a string parameter is being passed to a certain constructor. .
 */
export class NoStringParameterToFunctionCallWalker extends ScopedSymbolTrackingWalker {
    private failureString : string;
    private targetFunctionName : string;

    public constructor(sourceFile : ts.SourceFile,
                       targetFunctionName : string,
                       options : Lint.IOptions,
                       languageServices : ts.LanguageService) {
        super(sourceFile, options, languageServices);
        this.targetFunctionName = targetFunctionName;
        this.failureString = 'Forbidden ' + targetFunctionName + ' string parameter: ';
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node : ts.CallExpression) : void {
        const functionName : string = AstUtils.getFunctionName(node);
        const firstArg : ts.Expression = node.arguments[0];
        if (functionName === this.targetFunctionName && firstArg != null) {
            if (!this.isExpressionEvaluatingToFunction(firstArg)) {
                const msg : string = this.failureString + firstArg.getFullText().trim().substring(0, 40);
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
            }
        }
    }
}