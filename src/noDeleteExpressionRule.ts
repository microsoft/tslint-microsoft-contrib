import ErrorTolerantWalker = require('./ErrorTolerantWalker');

/**
 * Implementation of the no-delete-expression rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Variables should not be deleted: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    }
}

class NoDeleteExpression extends ErrorTolerantWalker {

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        super.visitExpressionStatement(node);
        if (node.expression.kind === ts.SyntaxKind.DeleteExpression) {
            // first child is delete keyword, second one is what is being deleted.
            let deletedObject: ts.Node = node.expression.getChildren()[1];

            if (deletedObject.kind === ts.SyntaxKind.ElementAccessExpression) {
                const deletedExpression: ts.Expression = (<any>deletedObject).expression;
                if (deletedExpression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                    this.addNoDeleteFailure(deletedObject);
                }
            } else if (deletedObject.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                this.addNoDeleteFailure(deletedObject);
            }
        }
    }

    public addNoDeleteFailure(deletedObject: ts.Node): void {
        let msg: string = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        this.addFailure(this.createFailure(deletedObject.getStart(), deletedObject.getWidth(), msg));
    }

}
