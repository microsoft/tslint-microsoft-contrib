import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-increment-decrement rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoIncrementDecrementWalker(sourceFile, this.getOptions()));
    }
}

class NoIncrementDecrementWalker extends ErrorTolerantWalker {

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    private validateUnaryExpression(node : ts.PrefixUnaryExpression | ts.PrefixUnaryExpression) {
        if (node.operator === SyntaxKind.current().PlusPlusToken) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden ++ operator'));
        } else if (node.operator === SyntaxKind.current().MinusMinusToken) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden -- operator'));
        }
    }

}
