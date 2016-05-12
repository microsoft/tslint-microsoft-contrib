import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the no-control-regex rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Unexpected control character in regular expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoControlRegexRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoControlRegexRuleWalker extends ErrorTolerantWalker {
    protected visitNewExpression(node: ts.NewExpression): void {
        this.validateCall(node);
        super.visitNewExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        this.validateCall(node);
        super.visitCallExpression(node);
    }


    protected visitRegularExpressionLiteral(node: ts.Node): void {
        if (/(\\x[0-1][0-9a-f])/.test(node.getText())) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitRegularExpressionLiteral(node);
    }

    /* tslint:disable:no-control-regex */
    private validateCall(expression: ts.CallExpression): void {
        if (expression.expression.getText() === 'RegExp') {
            if (expression.arguments.length > 0) {
                const arg1: ts.Expression = expression.arguments[0];
                if (arg1.kind === SyntaxKind.current().StringLiteral) {
                    const regexpText: string = (<ts.StringLiteral>arg1).text;
                    if (/[\x00-\x1f]/.test(regexpText)) {
                        this.addFailure(this.createFailure(arg1.getStart(), arg1.getWidth(), Rule.FAILURE_STRING));
                    }
                }
            }
        }
    }
    /* tslint:enable:no-control-regex */
}
