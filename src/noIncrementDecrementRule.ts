
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoIncrementDecrementWalker(sourceFile, this.getOptions()));
    }
}

class NoIncrementDecrementWalker extends Lint.RuleWalker {

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    private validateUnaryExpression(node : ts.PrefixUnaryExpression | ts.PrefixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden ++ operator'));
        } else if (node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'Forbidden -- operator'));
        }
    }

}
