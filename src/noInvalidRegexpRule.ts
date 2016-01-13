import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the no-invalid-regexp rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInvalidRegexpRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoInvalidRegexpRuleWalker extends ErrorTolerantWalker {

    protected visitNewExpression(node: ts.NewExpression): void {
        this.validateCall(node);
        super.visitNewExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        this.validateCall(node);
        super.visitCallExpression(node);
    }

    private validateCall(expression: ts.CallExpression): void {
        if (expression.expression.getText() === 'RegExp') {
            if (expression.arguments.length > 0) {
                let arg1: ts.Expression = expression.arguments[0];
                if (arg1.kind === SyntaxKind.current().StringLiteral) {
                    let regexpText: string = (<ts.StringLiteral>arg1).text;
                    try {
                        var regex = new RegExp(regexpText);
                    } catch (e) {
                        this.addFailure(this.createFailure(arg1.getStart(), arg1.getWidth(), e.message));
                    }
                }
            }
        }
    }
}
