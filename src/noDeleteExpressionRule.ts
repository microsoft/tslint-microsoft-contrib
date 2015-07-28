export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Variables should not be deleted: ";

    public apply(sourceFile): Lint.RuleFailure[] {
        const noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    }
}

class NoDeleteExpression extends Lint.RuleWalker {

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        super.visitExpressionStatement(node);
        if (node.expression.kind === ts.SyntaxKind.DeleteExpression) {
            // first child is delete keyword, second one is what is being deleted.
            let deletedObject: string = node.expression.getChildren()[1].getFullText();
            if (deletedObject.indexOf('.') === -1) {
                //if the deleted object does not contain a dot, that means that we are deleting entire variable.
                let msg: string = Rule.FAILURE_STRING + deletedObject.trim();
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
            }
        }
    }

}
