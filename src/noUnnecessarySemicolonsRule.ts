
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "unnecessary semi-colon";

    public apply(sourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    }
}

class NoUnnecessarySemicolonsWalker extends Lint.RuleWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.EmptyStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNode(node);
    }
}
