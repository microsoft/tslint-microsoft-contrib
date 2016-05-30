import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the use-named-parameter rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Use a named parameter instead: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseNamedParameterWalker(sourceFile, this.getOptions()));
    }
}

class UseNamedParameterWalker extends ErrorTolerantWalker {
    protected visitElementAccessExpression(node: ts.ElementAccessExpression): void {
        if (node.argumentExpression != null) {
            if (node.argumentExpression.kind === SyntaxKind.current().NumericLiteral) {
                if (node.expression.getText() === 'arguments') {
                    const failureString = Rule.FAILURE_STRING + '\'' + node.getText() + '\'';
                    const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                    this.addFailure(failure);
                }
            }
        }
        super.visitElementAccessExpression(node);
    }
}
