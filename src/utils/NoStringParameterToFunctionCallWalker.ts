import * as ts from "typescript";
import * as Lint from "tslint";
import { ScopedSymbolTrackingWalker } from "./ScopedSymbolTrackingWalker";

import { AstUtils } from "./AstUtils";

/**
 * A walker that creates failures whenever it detects a string parameter is being passed to a certain constructor. .
 */
export class NoStringParameterToFunctionCallWalker extends ScopedSymbolTrackingWalker {
    private readonly failureString: string;
    private readonly targetFunctionName: string;

    public constructor(sourceFile: ts.SourceFile, targetFunctionName: string, options: Lint.IOptions, program?: ts.Program) {
        super(sourceFile, options, program);
        this.targetFunctionName = targetFunctionName;
        this.failureString = "Forbidden " + targetFunctionName + " string parameter: ";
    }

    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node: ts.CallExpression): void {
        const functionName = AstUtils.getFunctionName(node);
        const functionTarget = AstUtils.getFunctionTarget(node);
        const functionTargetType = this.getFunctionTargetType(node);
        const firstArg: ts.Expression = node.arguments[0];
        if (functionName === this.targetFunctionName && firstArg !== undefined) {
            if (functionTarget) {
                if (functionTargetType) {
                    if (!functionTargetType.match(/^(any|Window|Worker)$/)) {
                        return;
                    }
                } else {
                    if (!functionTarget.match(/^(this|window)$/)) {
                        return;
                    }
                }
            }
            if (!this.isExpressionEvaluatingToFunction(firstArg)) {
                const msg: string =
                    this.failureString +
                    firstArg
                        .getFullText()
                        .trim()
                        .substring(0, 40);
                this.addFailureAt(node.getStart(), node.getWidth(), msg);
            }
        }
    }
}
