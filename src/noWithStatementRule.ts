import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden with statement';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoWithStatementWalker(sourceFile, this.getOptions()));
    }
}

class NoWithStatementWalker extends ErrorTolerantWalker {

    public constructor(sourceFile : ts.SourceFile, options : Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.WithStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNode(node);
    }
}
